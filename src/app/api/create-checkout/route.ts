import { NextRequest, NextResponse } from "next/server"
import Stripe from "stripe"

// Inicializar Stripe com versão estável e suportada
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
  apiVersion: "2024-11-20.acacia" as any,
  typescript: true,
})

export async function POST(req: NextRequest) {
  try {
    const { priceId } = await req.json()
    
    if (!process.env.STRIPE_SECRET_KEY) {
      return NextResponse.json(
        { error: "Stripe não configurado. Configure STRIPE_SECRET_KEY nas variáveis de ambiente." },
        { status: 500 }
      )
    }

    if (!priceId) {
      return NextResponse.json(
        { error: "Price ID é obrigatório" },
        { status: 400 }
      )
    }

    // Criar sessão de checkout do Stripe
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: "subscription",
      success_url: `${req.headers.get("origin") || "http://localhost:3000"}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${req.headers.get("origin") || "http://localhost:3000"}/`,
      allow_promotion_codes: true,
      billing_address_collection: "auto",
      subscription_data: {
        trial_period_days: 7,
      },
    })

    return NextResponse.json({ sessionId: session.id, url: session.url })
    
  } catch (error) {
    console.error("Erro ao criar checkout:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Erro ao processar pagamento" },
      { status: 500 }
    )
  }
}
