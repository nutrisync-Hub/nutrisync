import { NextResponse } from "next/server"
import Stripe from "stripe"

// Inicializar Stripe
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
  apiVersion: "2024-11-20.acacia" as any,
  typescript: true,
})

export async function GET() {
  try {
    if (!process.env.STRIPE_SECRET_KEY) {
      return NextResponse.json(
        { error: "STRIPE_SECRET_KEY não configurada" },
        { status: 500 }
      )
    }

    console.log("🚀 Criando produtos no Stripe...")

    // Criar produto Básico
    const basicProduct = await stripe.products.create({
      name: "Plano Básico",
      description: "Análise de alimentos, contagem de calorias e plano alimentar semanal",
    })

    const basicPrice = await stripe.prices.create({
      product: basicProduct.id,
      unit_amount: 2990, // R$ 29,90 em centavos
      currency: "brl",
      recurring: {
        interval: "month",
      },
    })

    // Criar produto Premium
    const premiumProduct = await stripe.products.create({
      name: "Plano Premium",
      description: "Análise avançada com IA, planos personalizados e suporte prioritário",
    })

    const premiumPrice = await stripe.prices.create({
      product: premiumProduct.id,
      unit_amount: 4990, // R$ 49,90 em centavos
      currency: "brl",
      recurring: {
        interval: "month",
      },
    })

    // Criar produto Profissional
    const proProduct = await stripe.products.create({
      name: "Plano Profissional",
      description: "Consultoria nutricional, integração com wearables e API para desenvolvedores",
    })

    const proPrice = await stripe.prices.create({
      product: proProduct.id,
      unit_amount: 7990, // R$ 79,90 em centavos
      currency: "brl",
      recurring: {
        interval: "month",
      },
    })

    const priceIds = {
      basic: basicPrice.id,
      premium: premiumPrice.id,
      pro: proPrice.id,
    }

    return NextResponse.json({
      success: true,
      message: "✅ Produtos criados com sucesso no Stripe!",
      priceIds,
      products: {
        basic: {
          productId: basicProduct.id,
          priceId: basicPrice.id,
          name: "Plano Básico",
          amount: "R$ 29,90/mês"
        },
        premium: {
          productId: premiumProduct.id,
          priceId: premiumPrice.id,
          name: "Plano Premium",
          amount: "R$ 49,90/mês"
        },
        pro: {
          productId: proProduct.id,
          priceId: proPrice.id,
          name: "Plano Profissional",
          amount: "R$ 79,90/mês"
        }
      },
      instructions: "Agora atualize o arquivo src/components/custom/stripe-checkout.tsx com esses Price IDs"
    })

  } catch (error) {
    console.error("❌ Erro ao criar produtos:", error)
    return NextResponse.json(
      { 
        error: "Erro ao criar produtos no Stripe",
        details: error instanceof Error ? error.message : "Erro desconhecido"
      },
      { status: 500 }
    )
  }
}
