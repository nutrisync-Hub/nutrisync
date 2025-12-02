"use client"

import { X, Check, Crown, Sparkles } from "lucide-react"
import { SUBSCRIPTION_PLANS, SubscriptionPlan } from "@/lib/subscription"

interface SubscriptionModalProps {
  isOpen: boolean
  onClose: () => void
  onSelectPlan: (plan: SubscriptionPlan) => void
}

export function SubscriptionModal({ isOpen, onClose, onSelectPlan }: SubscriptionModalProps) {
  if (!isOpen) return null
  
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-gradient-to-r from-emerald-500 to-teal-600 text-white p-6 rounded-t-3xl">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 hover:bg-white/20 rounded-full transition-all"
          >
            <X className="w-6 h-6" />
          </button>
          <div className="flex items-center gap-3 mb-2">
            <Crown className="w-8 h-8" />
            <h2 className="text-2xl font-bold">Escolha seu Plano</h2>
          </div>
          <p className="text-emerald-50">7 dias grátis para testar • Cancele quando quiser</p>
        </div>
        
        <div className="p-6 space-y-4">
          {SUBSCRIPTION_PLANS.map((plan, index) => {
            const isPopular = plan.id === "quarterly"
            const savings = plan.id === "quarterly" 
              ? "Economize R$ 19,80" 
              : plan.id === "yearly" 
              ? "Economize R$ 138,90" 
              : null
            
            return (
              <div
                key={plan.id}
                className={`relative border-2 rounded-2xl p-6 transition-all hover:shadow-xl ${
                  isPopular
                    ? "border-emerald-500 bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20"
                    : "border-gray-200 dark:border-gray-700 hover:border-emerald-300"
                }`}
              >
                {isPopular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-emerald-500 to-teal-600 text-white px-4 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                    <Sparkles className="w-3 h-3" />
                    MAIS POPULAR
                  </div>
                )}
                
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-bold mb-1">{plan.name}</h3>
                    <div className="flex items-baseline gap-2">
                      <span className="text-3xl font-bold text-emerald-600">
                        R$ {plan.price.toFixed(2)}
                      </span>
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        /{plan.interval === "monthly" ? "mês" : plan.interval === "quarterly" ? "trimestre" : "ano"}
                      </span>
                    </div>
                    {savings && (
                      <p className="text-sm font-medium text-emerald-600 mt-1">{savings}</p>
                    )}
                  </div>
                </div>
                
                <ul className="space-y-2 mb-6">
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-sm">
                      <Check className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-700 dark:text-gray-300">{feature}</span>
                    </li>
                  ))}
                </ul>
                
                <button
                  onClick={() => onSelectPlan(plan)}
                  className={`w-full py-3 rounded-xl font-semibold transition-all ${
                    isPopular
                      ? "bg-gradient-to-r from-emerald-500 to-teal-600 text-white hover:shadow-2xl hover:scale-105"
                      : "bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600"
                  }`}
                >
                  Começar Teste Grátis
                </button>
              </div>
            )
          })}
        </div>
        
        <div className="bg-gray-50 dark:bg-gray-900 p-6 rounded-b-3xl border-t border-gray-200 dark:border-gray-700">
          <div className="max-w-2xl mx-auto space-y-3 text-sm text-gray-600 dark:text-gray-400 text-center">
            <p className="flex items-center justify-center gap-2">
              <Check className="w-4 h-4 text-emerald-600" />
              <span>7 dias de teste grátis em todos os planos</span>
            </p>
            <p className="flex items-center justify-center gap-2">
              <Check className="w-4 h-4 text-emerald-600" />
              <span>Cancele quando quiser, sem multas</span>
            </p>
            <p className="flex items-center justify-center gap-2">
              <Check className="w-4 h-4 text-emerald-600" />
              <span>Pagamento seguro via Stripe</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
