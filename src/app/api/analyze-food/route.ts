import { NextRequest, NextResponse } from "next/server"
import OpenAI from "openai"

export async function POST(request: NextRequest) {
  try {
    // Verifica se a API key está configurada em runtime
    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { error: "Configuração da API OpenAI não encontrada. Configure a variável OPENAI_API_KEY." },
        { status: 500 }
      )
    }

    // Inicializa o OpenAI apenas em runtime
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    })

    const { imageUrl } = await request.json()

    if (!imageUrl) {
      return NextResponse.json(
        { error: "URL da imagem é obrigatória" },
        { status: 400 }
      )
    }

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "user",
          content: [
            {
              type: "text",
              text: `Analise esta imagem de alimento e retorne APENAS um JSON válido (sem markdown, sem explicações) com as seguintes informações nutricionais estimadas:

{
  "description": "descrição detalhada dos alimentos identificados",
  "calories": número estimado de calorias totais,
  "protein": gramas de proteína,
  "carbs": gramas de carboidratos,
  "fats": gramas de gorduras,
  "fiber": gramas de fibras,
  "items": [
    {
      "name": "nome do alimento",
      "portion": "porção estimada"
    }
  ]
}

Seja preciso nas estimativas nutricionais. Se não conseguir identificar claramente, retorne valores conservadores.`,
            },
            {
              type: "image_url",
              image_url: {
                url: imageUrl,
              },
            },
          ],
        },
      ],
      max_tokens: 1000,
    })

    const content = response.choices[0].message.content
    if (!content) {
      throw new Error("Nenhuma resposta da IA")
    }

    // Remove markdown se houver
    const cleanContent = content.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim()
    const nutritionData = JSON.parse(cleanContent)

    return NextResponse.json(nutritionData)
  } catch (error) {
    console.error("Erro ao analisar imagem:", error)
    return NextResponse.json(
      { error: "Erro ao analisar a imagem. Tente novamente." },
      { status: 500 }
    )
  }
}
