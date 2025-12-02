import { NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { userProfile } = await request.json()

    if (!userProfile) {
      return NextResponse.json(
        { error: "Perfil do usuário não fornecido" },
        { status: 400 }
      )
    }

    const apiKey = process.env.OPENAI_API_KEY

    if (!apiKey) {
      return NextResponse.json(
        { error: "Chave da API OpenAI não configurada" },
        { status: 500 }
      )
    }

    // Prompt detalhado para gerar plano alimentar personalizado
    const prompt = `Você é um nutricionista especializado. Crie um plano alimentar COMPLETO e DETALHADO para 1 dia baseado nos seguintes dados do paciente:

DADOS DO PACIENTE:
- IMC: ${userProfile.bmi}
- Peso atual: ${userProfile.weight}kg
- Peso ideal: ${userProfile.idealWeight}kg
- Meta de calorias diárias: ${userProfile.dailyCalories} kcal (déficit calórico já calculado)
- Meta de proteína diária: ${userProfile.dailyProtein}g
- Sexo: ${userProfile.gender === "male" ? "Masculino" : "Feminino"}
- Nível de atividade: ${userProfile.activityLevel}

INSTRUÇÕES IMPORTANTES:
1. Crie um plano alimentar COMPLETO do café da manhã até a última refeição
2. O plano deve ter EXATAMENTE 5 refeições: Café da Manhã, Lanche da Manhã, Almoço, Lanche da Tarde, Jantar
3. Para CADA refeição, forneça 3 OPÇÕES DIFERENTES para o usuário escolher
4. TODAS as opções devem respeitar o déficit calórico total de ${userProfile.dailyCalories} kcal
5. TODAS as opções devem ajudar a atingir a meta de ${userProfile.dailyProtein}g de proteína
6. Seja ESPECÍFICO nas quantidades (ex: "2 ovos", "100g de frango", "1 xícara de arroz")
7. Inclua alimentos brasileiros comuns e acessíveis
8. Varie os alimentos entre as opções
9. Considere o IMC: ${userProfile.bmi < 18.5 ? "abaixo do peso - foque em alimentos nutritivos e calóricos" : userProfile.bmi < 25 ? "peso normal - mantenha equilíbrio" : userProfile.bmi < 30 ? "sobrepeso - priorize proteínas e fibras" : "obesidade - maximize saciedade com proteínas e fibras"}

Retorne APENAS um JSON válido no seguinte formato (sem markdown, sem explicações extras):

{
  "mealPlan": {
    "breakfast": {
      "name": "Café da Manhã",
      "targetCalories": [número],
      "targetProtein": [número],
      "options": [
        {
          "id": 1,
          "name": "Opção 1 - [nome descritivo]",
          "foods": [
            {
              "name": "[nome do alimento]",
              "portion": "[quantidade específica]",
              "calories": [número],
              "protein": [número],
              "carbs": [número],
              "fats": [número],
              "fiber": [número]
            }
          ],
          "totalCalories": [número],
          "totalProtein": [número],
          "totalCarbs": [número],
          "totalFats": [número],
          "totalFiber": [número]
        }
      ]
    },
    "morningSnack": { ... },
    "lunch": { ... },
    "afternoonSnack": { ... },
    "dinner": { ... }
  },
  "dailyTotals": {
    "calories": [número],
    "protein": [número],
    "carbs": [número],
    "fats": [número],
    "fiber": [número]
  },
  "nutritionistNotes": "[dica personalizada do nutricionista baseada no perfil]"
}`

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-4o",
        messages: [
          {
            role: "system",
            content: "Você é um nutricionista especializado em emagrecimento saudável. Sempre retorne JSON válido, sem markdown."
          },
          {
            role: "user",
            content: prompt,
          },
        ],
        temperature: 0.8,
        max_tokens: 4000,
      }),
    })

    if (!response.ok) {
      const errorData = await response.json()
      console.error("Erro da API OpenAI:", errorData)
      return NextResponse.json(
        { error: "Erro ao gerar plano alimentar" },
        { status: response.status }
      )
    }

    const data = await response.json()
    const content = data.choices[0].message.content

    // Limpar possível markdown do JSON
    let cleanContent = content.trim()
    if (cleanContent.startsWith("```json")) {
      cleanContent = cleanContent.replace(/```json\n?/g, "").replace(/```\n?/g, "")
    } else if (cleanContent.startsWith("```")) {
      cleanContent = cleanContent.replace(/```\n?/g, "")
    }

    const mealPlanData = JSON.parse(cleanContent)

    return NextResponse.json(mealPlanData)
  } catch (error) {
    console.error("Erro ao gerar plano alimentar:", error)
    return NextResponse.json(
      { error: "Erro interno ao processar solicitação" },
      { status: 500 }
    )
  }
}
