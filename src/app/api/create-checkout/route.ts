import { NextRequest, NextResponse } from "next/server"

export async function POST(req: NextRequest) {
  try {
    const { planId, userId } = await req.json()
    
    if (!process.env.STRIPE_SECRET_KEY) {
      return NextResponse.json(
        { error: "Stripe não configurado. Configure STRIPE_SECRET_KEY nas variáveis de ambiente." },
        { status: 500 }
      )
    }
    
    // Aqui você integraria com o Stripe para criar uma sessão de checkout
    // Por enquanto, retornamos uma URL de exemplo
    
    // Exemplo de integração com Stripe (descomente quando configurar):
    /*
    const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY)
    
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price: planId === 'monthly' ? 'price_monthly_id' : 
                 planId === 'quarterly' ? 'price_quarterly_id' : 
                 'price_yearly_id',
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: `${req.headers.get('origin')}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${req.headers.get('origin')}/`,
      customer_email: userId,
      subscription_data: {
        trial_period_days: 7,
      },
    })
    
    return NextResponse.json({ url: session.url })
    */
    
    // Resposta temporária até configurar Stripe
    return NextResponse.json({ 
      message: "Para ativar pagamentos, configure sua chave do Stripe",
      planId,
      instructions: [
        "1. Crie uma conta no Stripe (https://stripe.com)",
        "2. Obtenha sua Secret Key no dashboard",
        "3. Adicione STRIPE_SECRET_KEY nas variáveis de ambiente",
        "4. Crie produtos e preços no Stripe",
        "5. Atualize o código com os IDs dos preços"
      ]
    })
    
  } catch (error) {
    console.error("Erro ao criar checkout:", error)
    return NextResponse.json(
      { error: "Erro ao processar pagamento" },
      { status: 500 }
    )
  }
}
