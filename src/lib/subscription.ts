// Sistema de assinatura do NutriSync
export interface SubscriptionPlan {
  id: string
  name: string
  price: number
  interval: "monthly" | "quarterly" | "yearly"
  features: string[]
}

export const SUBSCRIPTION_PLANS: SubscriptionPlan[] = [
  {
    id: "monthly",
    name: "Mensal",
    price: 19.90,
    interval: "monthly",
    features: [
      "Acesso completo ao app",
      "Contador de calorias com IA",
      "Plano alimentar personalizado",
      "Análise de fotos de refeições",
      "Dicas científicas",
      "Acompanhamento de progresso"
    ]
  },
  {
    id: "quarterly",
    name: "Trimestral",
    price: 39.90,
    interval: "quarterly",
    features: [
      "Todos os recursos do plano mensal",
      "Economia de R$ 19,80",
      "Suporte prioritário"
    ]
  },
  {
    id: "yearly",
    name: "Anual",
    price: 99.90,
    interval: "yearly",
    features: [
      "Todos os recursos do plano mensal",
      "Economia de R$ 138,90",
      "Suporte prioritário",
      "Acesso antecipado a novos recursos"
    ]
  }
]

export interface UserSubscription {
  status: "trial" | "active" | "expired" | "cancelled"
  plan?: SubscriptionPlan
  trialEndsAt?: Date
  currentPeriodEnd?: Date
  startedAt: Date
}

// Verificar se usuário está em período de teste
export function isInTrial(subscription: UserSubscription): boolean {
  if (subscription.status !== "trial") return false
  if (!subscription.trialEndsAt) return false
  return new Date() < subscription.trialEndsAt
}

// Verificar se assinatura está ativa
export function hasActiveSubscription(subscription: UserSubscription): boolean {
  if (subscription.status === "trial" && isInTrial(subscription)) return true
  if (subscription.status === "active" && subscription.currentPeriodEnd) {
    return new Date() < subscription.currentPeriodEnd
  }
  return false
}

// Calcular dias restantes do trial
export function getTrialDaysRemaining(subscription: UserSubscription): number {
  if (!subscription.trialEndsAt) return 0
  const now = new Date()
  const diff = subscription.trialEndsAt.getTime() - now.getTime()
  return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)))
}

// Inicializar assinatura com trial de 7 dias
export function initializeTrialSubscription(): UserSubscription {
  const now = new Date()
  const trialEndsAt = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000) // 7 dias
  
  return {
    status: "trial",
    trialEndsAt,
    startedAt: now
  }
}

// Gerenciar localStorage
const STORAGE_KEY = "nutrisync_subscription"

export function saveSubscription(subscription: UserSubscription): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify({
    ...subscription,
    trialEndsAt: subscription.trialEndsAt?.toISOString(),
    currentPeriodEnd: subscription.currentPeriodEnd?.toISOString(),
    startedAt: subscription.startedAt.toISOString()
  }))
}

export function loadSubscription(): UserSubscription | null {
  const stored = localStorage.getItem(STORAGE_KEY)
  if (!stored) return null
  
  const data = JSON.parse(stored)
  return {
    ...data,
    trialEndsAt: data.trialEndsAt ? new Date(data.trialEndsAt) : undefined,
    currentPeriodEnd: data.currentPeriodEnd ? new Date(data.currentPeriodEnd) : undefined,
    startedAt: new Date(data.startedAt)
  }
}
