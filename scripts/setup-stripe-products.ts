import Stripe from "stripe"

// Inicializar Stripe
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
  apiVersion: "2024-11-20.acacia" as any,
  typescript: true,
})

async function setupStripeProducts() {
  try {
    console.log("🚀 Criando produtos no Stripe...\n")

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

    console.log("✅ Plano Básico criado:")
    console.log(`   Product ID: ${basicProduct.id}`)
    console.log(`   Price ID: ${basicPrice.id}\n`)

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

    console.log("✅ Plano Premium criado:")
    console.log(`   Product ID: ${premiumProduct.id}`)
    console.log(`   Price ID: ${premiumPrice.id}\n`)

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

    console.log("✅ Plano Profissional criado:")
    console.log(`   Product ID: ${proProduct.id}`)
    console.log(`   Price ID: ${proPrice.id}\n`)

    // Retornar os IDs para atualização do código
    const priceIds = {
      basic: basicPrice.id,
      premium: premiumPrice.id,
      pro: proPrice.id,
    }

    console.log("🎉 Todos os produtos foram criados com sucesso!\n")
    console.log("📋 Price IDs para usar no código:")
    console.log(JSON.stringify(priceIds, null, 2))

    return priceIds

  } catch (error) {
    console.error("❌ Erro ao criar produtos:", error)
    throw error
  }
}

// Executar o script
setupStripeProducts()
  .then(() => {
    console.log("\n✅ Setup concluído!")
    process.exit(0)
  })
  .catch((error) => {
    console.error("\n❌ Falha no setup:", error)
    process.exit(1)
  })
