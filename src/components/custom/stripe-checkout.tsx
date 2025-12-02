"use client"

import { useState } from 'react'
import { loadStripe } from '@stripe/stripe-js'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Check, Loader2 } from 'lucide-react'

// Inicializar Stripe Promise
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || '')

interface Plan {
  id: string
  name: string
  price: string
  priceId: string
  features: string[]
  popular?: boolean
}

const plans: Plan[] = [
  {
    id: 'basic',
    name: 'Básico',
    price: 'R$ 29,90',
    priceId: 'price_basic', // Substitua pelo ID real do Stripe
    features: [
      'Análise de fotos de alimentos',
      'Contagem de calorias e proteínas',
      'Plano alimentar semanal',
      'Acompanhamento de peso',
      'Suporte por email'
    ]
  },
  {
    id: 'premium',
    name: 'Premium',
    price: 'R$ 49,90',
    priceId: 'price_premium', // Substitua pelo ID real do Stripe
    features: [
      'Tudo do plano Básico',
      'Análise nutricional avançada com IA',
      'Planos alimentares personalizados',
      'Relatórios semanais detalhados',
      'Suporte prioritário 24/7',
      'Acesso a receitas exclusivas'
    ],
    popular: true
  },
  {
    id: 'pro',
    name: 'Profissional',
    price: 'R$ 79,90',
    priceId: 'price_pro', // Substitua pelo ID real do Stripe
    features: [
      'Tudo do plano Premium',
      'Consultoria nutricional mensal',
      'Planos para objetivos específicos',
      'Integração com wearables',
      'API para desenvolvedores',
      'Suporte dedicado'
    ]
  }
]

export function StripeCheckout() {
  const [loading, setLoading] = useState<string | null>(null)

  const handleCheckout = async (plan: Plan) => {
    try {
      setLoading(plan.id)

      const stripe = await stripePromise

      if (!stripe) {
        alert('Erro ao carregar Stripe. Verifique sua conexão.')
        setLoading(null)
        return
      }

      // Redirecionar diretamente para o Stripe Checkout usando Payment Links
      // Esta é a forma mais simples e funciona com static export
      const checkoutUrl = `https://checkout.stripe.com/c/pay/${plan.priceId}`
      
      // Para produção, você deve criar Payment Links no dashboard do Stripe
      // e usar as URLs geradas. Exemplo:
      // const checkoutUrl = 'https://buy.stripe.com/test_xxxxxxxxxxxxx'
      
      window.location.href = checkoutUrl

    } catch (error) {
      console.error('Erro:', error)
      alert('Erro ao processar pagamento. Tente novamente.')
      setLoading(null)
    }
  }

  return (
    <div className="w-full py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Escolha seu Plano
          </h2>
          <p className="text-xl text-gray-600">
            Comece sua jornada nutricional hoje mesmo
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {plans.map((plan) => (
            <Card
              key={plan.id}
              className={`relative ${
                plan.popular
                  ? 'border-[#004d40] border-2 shadow-2xl scale-105'
                  : 'border-gray-200'
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <Badge className="bg-[#004d40] text-white px-4 py-1">
                    Mais Popular
                  </Badge>
                </div>
              )}

              <CardHeader className="text-center pb-8 pt-8">
                <CardTitle className="text-2xl font-bold text-gray-900">
                  {plan.name}
                </CardTitle>
                <div className="mt-4">
                  <span className="text-5xl font-bold text-[#004d40]">
                    {plan.price}
                  </span>
                  <span className="text-gray-600">/mês</span>
                </div>
              </CardHeader>

              <CardContent className="space-y-6">
                <ul className="space-y-3">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <Check className="w-5 h-5 text-[#004d40] flex-shrink-0 mt-0.5" />
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>

                <Button
                  onClick={() => handleCheckout(plan)}
                  disabled={loading !== null}
                  className={`w-full py-6 text-lg font-semibold ${
                    plan.popular
                      ? 'bg-[#004d40] hover:bg-[#00695c]'
                      : 'bg-gray-800 hover:bg-gray-900'
                  }`}
                >
                  {loading === plan.id ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      Processando...
                    </>
                  ) : (
                    'Assinar Agora'
                  )}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-12 text-center text-gray-600">
          <p className="text-sm">
            💳 Pagamento seguro processado pelo Stripe
          </p>
          <p className="text-sm mt-2">
            Cancele a qualquer momento, sem taxas adicionais
          </p>
        </div>
      </div>
    </div>
  )
}
