"use client"

import { useState, useEffect } from "react"
import { X, Crown, Clock } from "lucide-react"
import { UserSubscription, getTrialDaysRemaining, hasActiveSubscription } from "@/lib/subscription"

interface SubscriptionBannerProps {
  subscription: UserSubscription | null
  onUpgrade: () => void
}

export function SubscriptionBanner({ subscription, onUpgrade }: SubscriptionBannerProps) {
  const [isVisible, setIsVisible] = useState(true)
  
  if (!subscription || !isVisible) return null
  
  // Não mostrar banner se assinatura está ativa
  if (hasActiveSubscription(subscription) && subscription.status !== "trial") {
    return null
  }
  
  const daysRemaining = getTrialDaysRemaining(subscription)
  
  // Trial expirado
  if (subscription.status === "trial" && daysRemaining === 0) {
    return (
      <div className="bg-gradient-to-r from-red-500 to-orange-600 text-white p-4 relative">
        <button
          onClick={() => setIsVisible(false)}
          className="absolute top-2 right-2 p-1 hover:bg-white/20 rounded-full transition-all"
        >
          <X className="w-4 h-4" />
        </button>
        <div className="max-w-4xl mx-auto flex items-center gap-3">
          <Crown className="w-6 h-6 flex-shrink-0" />
          <div className="flex-1">
            <p className="font-bold text-sm">Seu período de teste expirou</p>
            <p className="text-xs text-red-50">Assine agora para continuar usando o NutriSync</p>
          </div>
          <button
            onClick={onUpgrade}
            className="bg-white text-red-600 px-4 py-2 rounded-lg font-semibold text-sm hover:bg-red-50 transition-all flex-shrink-0"
          >
            Assinar
          </button>
        </div>
      </div>
    )
  }
  
  // Trial ativo
  if (subscription.status === "trial" && daysRemaining > 0) {
    return (
      <div className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white p-4 relative">
        <button
          onClick={() => setIsVisible(false)}
          className="absolute top-2 right-2 p-1 hover:bg-white/20 rounded-full transition-all"
        >
          <X className="w-4 h-4" />
        </button>
        <div className="max-w-4xl mx-auto flex items-center gap-3">
          <Clock className="w-6 h-6 flex-shrink-0" />
          <div className="flex-1">
            <p className="font-bold text-sm">
              {daysRemaining === 1 
                ? "Último dia de teste grátis!" 
                : `${daysRemaining} dias restantes de teste grátis`}
            </p>
            <p className="text-xs text-emerald-50">Aproveite todos os recursos premium</p>
          </div>
          <button
            onClick={onUpgrade}
            className="bg-white text-emerald-600 px-4 py-2 rounded-lg font-semibold text-sm hover:bg-emerald-50 transition-all flex-shrink-0"
          >
            Ver Planos
          </button>
        </div>
      </div>
    )
  }
  
  return null
}
