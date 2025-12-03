"use client"

import { useState } from "react"
import { User, Camera, UtensilsCrossed, FileText, TrendingUp, Scale, CreditCard, Watch } from "lucide-react"
import supabase from "@/lib/supabase"
import supabase from "@/lib/supabase"
import supabase from "@/lib/supabase"
import supabase from "@/lib/supabase"
import supabase from "@/lib/supabase"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Checkbox } from "@/components/ui/checkbox"

interface UserData {
  nome: string
  idade: number
  sexo: string
  peso: number
  altura: number
  imc: number
  aguaDiaria: number
  proteinasDiarias: number
  caloriasMaximas: number
  pesoIdeal: { min: number; max: number }
  restricoes: string[]
  meta: string
  monitorConectado: boolean
  planoAtivo: string | null
  dataInicioTeste: Date | null
  dataFimTeste: Date | null
}

interface Refeicao {
  id: number
  foto: string
  calorias: number
  proteinas: number
  hora: string
  ultimaRefeicao: boolean
}

interface RefeicaoPlano {
  nome: string
  calorias: number
  proteinas: number
  descricao: string
}

interface DiaPlano {
  dia: string
  refeicoes: {
    cafeDaManha: RefeicaoPlano
    lanche1: RefeicaoPlano
    almoco: RefeicaoPlano
    lanche2: RefeicaoPlano
    jantar: RefeicaoPlano
  }
}

interface AtividadeFisica {
  data: string
  caloriasGastas: number
  passos: number
  distancia: number
  tempoAtivo: number
}

export default function NutriSync() {
  const [activeTab, setActiveTab] = useState("cadastro")
  const [userData, setUserData] = useState<UserData | null>(null)
  const [planoAlimentar, setPlanoAlimentar] = useState<DiaPlano[]>([])
  const [formData, setFormData] = useState({
    nome: "",
    idade: "",
    sexo: "",
    peso: "",
    altura: "",
    restricoes: [] as string[],
    meta: ""
  })
  
  const [refeicoes, setRefeicoes] = useState<Refeicao[]>([])
  const [fotoAtual, setFotoAtual] = useState("")
  const [aguaConsumida, setAguaConsumida] = useState(0)
  const [pesosRegistrados, setPesosRegistrados] = useState<{data: string, peso: number}[]>([])
  const [atividadesFisicas, setAtividadesFisicas] = useState<AtividadeFisica[]>([])

  const toggleRestricao = (restricao: string) => {
    setFormData(prev => ({
      ...prev,
      restricoes: prev.restricoes.includes(restricao)
        ? prev.restricoes.filter(r => r !== restricao)
        : [...prev.restricoes, restricao]
    }))
  }

  const calcularPesoIdeal = (altura: number) => {
    const alturaMetros = altura > 3 ? altura / 100 : altura
    const pesoMin = 18.5 * (alturaMetros * alturaMetros)
    const pesoMax = 24.9 * (alturaMetros * alturaMetros)
    return { min: Math.round(pesoMin * 10) / 10, max: Math.round(pesoMax * 10) / 10 }
  }

  const gerarPlanoAlimentar = (userData: UserData): DiaPlano[] => {
    const dias = ["Segunda-feira", "Terça-feira", "Quarta-feira", "Quinta-feira", "Sexta-feira", "Sábado", "Domingo"]
    const plano: DiaPlano[] = []

    const temRestricao = (tipo: string) => userData.restricoes.includes(tipo)
    const semRestricoes = userData.restricoes.includes("sem-restricoes")

    // Opções de café da manhã
    const cafesDaManha = [
      {
        nome: "Ovos Mexidos com Aveia",
        calorias: 350,
        proteinas: 25,
        descricao: "3 ovos mexidos + 40g aveia + 1 banana",
        restricoes: ["vegano"]
      },
      {
        nome: "Tapioca com Frango",
        calorias: 320,
        proteinas: 28,
        descricao: "2 tapiocas + 100g frango desfiado + queijo",
        restricoes: ["vegano", "vegetariano", "gluten"]
      },
      {
        nome: "Panqueca de Banana",
        calorias: 380,
        proteinas: 22,
        descricao: "2 ovos + 1 banana + aveia + mel",
        restricoes: ["vegano", "lactose"]
      },
      {
        nome: "Iogurte com Granola",
        calorias: 300,
        proteinas: 18,
        descricao: "200g iogurte grego + 50g granola + frutas",
        restricoes: ["vegano", "lactose"]
      },
      {
        nome: "Smoothie Proteico",
        calorias: 340,
        proteinas: 30,
        descricao: "Whey protein + banana + aveia + leite vegetal",
        restricoes: []
      }
    ]

    // Opções de lanches
    const lanches = [
      {
        nome: "Mix de Castanhas",
        calorias: 180,
        proteinas: 8,
        descricao: "30g castanhas variadas + 1 fruta",
        restricoes: []
      },
      {
        nome: "Pasta de Amendoim",
        calorias: 200,
        proteinas: 10,
        descricao: "2 colheres de pasta + 1 maçã",
        restricoes: []
      },
      {
        nome: "Queijo com Biscoito",
        calorias: 150,
        proteinas: 12,
        descricao: "50g queijo branco + biscoito integral",
        restricoes: ["vegano", "lactose"]
      },
      {
        nome: "Vitamina de Frutas",
        calorias: 160,
        proteinas: 8,
        descricao: "Leite vegetal + banana + morango",
        restricoes: []
      }
    ]

    // Opções de almoço
    const almocos = [
      {
        nome: "Frango Grelhado com Arroz",
        calorias: 550,
        proteinas: 45,
        descricao: "150g frango + arroz integral + legumes",
        restricoes: ["vegano", "vegetariano"]
      },
      {
        nome: "Salmão com Batata Doce",
        calorias: 520,
        proteinas: 42,
        descricao: "150g salmão + batata doce + salada",
        restricoes: ["vegano", "vegetariano"]
      },
      {
        nome: "Carne Moída com Quinoa",
        calorias: 580,
        proteinas: 48,
        descricao: "150g carne moída + quinoa + brócolis",
        restricoes: ["vegano", "vegetariano"]
      },
      {
        nome: "Grão de Bico com Legumes",
        calorias: 480,
        proteinas: 22,
        descricao: "200g grão de bico + legumes variados + arroz",
        restricoes: []
      },
      {
        nome: "Tofu Grelhado com Arroz",
        calorias: 450,
        proteinas: 28,
        descricao: "200g tofu + arroz integral + vegetais",
        restricoes: []
      }
    ]

    // Opções de jantar
    const jantares = [
      {
        nome: "Omelete de Claras",
        calorias: 320,
        proteinas: 35,
        descricao: "6 claras + 2 ovos inteiros + vegetais",
        restricoes: ["vegano"]
      },
      {
        nome: "Peixe com Legumes",
        calorias: 380,
        proteinas: 40,
        descricao: "150g peixe branco + legumes grelhados",
        restricoes: ["vegano", "vegetariano"]
      },
      {
        nome: "Frango com Salada",
        calorias: 350,
        proteinas: 42,
        descricao: "150g frango + salada completa + azeite",
        restricoes: ["vegano", "vegetariano"]
      },
      {
        nome: "Sopa de Lentilha",
        calorias: 320,
        proteinas: 18,
        descricao: "Lentilha + legumes + temperos naturais",
        restricoes: []
      }
    ]

    const filtrarOpcoes = (opcoes: any[]) => {
      if (semRestricoes) return opcoes
      
      return opcoes.filter(opcao => {
        if (temRestricao("vegano") && opcao.restricoes.includes("vegano")) return false
        if (temRestricao("vegetariano") && opcao.restricoes.includes("vegetariano")) return false
        if (temRestricao("lactose") && opcao.restricoes.includes("lactose")) return false
        if (temRestricao("gluten") && opcao.restricoes.includes("gluten")) return false
        return true
      })
    }

    const cafesDisponiveis = filtrarOpcoes(cafesDaManha)
    const lanchesDisponiveis = filtrarOpcoes(lanches)
    const almocosDisponiveis = filtrarOpcoes(almocos)
    const jantaresDisponiveis = filtrarOpcoes(jantares)

    dias.forEach((dia, index) => {
      plano.push({
        dia,
        refeicoes: {
          cafeDaManha: cafesDisponiveis[index % cafesDisponiveis.length],
          lanche1: lanchesDisponiveis[index % lanchesDisponiveis.length],
          almoco: almocosDisponiveis[index % almocosDisponiveis.length],
          lanche2: lanchesDisponiveis[(index + 1) % lanchesDisponiveis.length],
          jantar: jantaresDisponiveis[index % jantaresDisponiveis.length]
        }
      })
    })

    return plano
  }

  const calcularDadosNutricionais = () => {
    const peso = parseFloat(formData.peso)
    let altura = parseFloat(formData.altura)
    const idade = parseInt(formData.idade)
    const sexo = formData.sexo
    const meta = formData.meta

    if (altura > 3) {
      altura = altura / 100
    }

    const imc = peso / (altura * altura)
    const pesoIdeal = calcularPesoIdeal(altura)
    const aguaDiaria = peso * 0.035

    let proteinasDiarias = 0
    if (meta === "perda") {
      proteinasDiarias = peso * 2.0
    } else if (meta === "ganho") {
      proteinasDiarias = peso * 2.2
    } else {
      proteinasDiarias = peso * 1.6
    }

    let tmb = 0
    if (sexo === "masculino") {
      tmb = 88.362 + (13.397 * peso) + (4.799 * altura * 100) - (5.677 * idade)
    } else {
      tmb = 447.593 + (9.247 * peso) + (3.098 * altura * 100) - (4.330 * idade)
    }
    
    const get = tmb * 1.55
    
    let caloriasMaximas = 0
    if (meta === "perda") {
      caloriasMaximas = Math.round(get * 0.8)
    } else if (meta === "ganho") {
      caloriasMaximas = Math.round(get * 1.15)
    } else {
      caloriasMaximas = Math.round(get)
    }

    const newUserData: UserData = {
      nome: formData.nome,
      idade,
      sexo,
      peso,
      altura,
      imc,
      aguaDiaria,
      proteinasDiarias,
      caloriasMaximas,
      pesoIdeal,
      restricoes: formData.restricoes,
      meta,
      monitorConectado: false,
      planoAtivo: null,
      dataInicioTeste: null,
      dataFimTeste: null
    }

    setUserData(newUserData)
    
    // Gerar plano alimentar automaticamente
    const plano = gerarPlanoAlimentar(newUserData)
    setPlanoAlimentar(plano)
    
    setActiveTab("contagem")
  }

  const simularAnaliseImagem = () => {
    const caloriasEstimadas = Math.floor(Math.random() * 400) + 200
    const proteinasEstimadas = Math.floor(Math.random() * 30) + 10
    return { calorias: caloriasEstimadas, proteinas: proteinasEstimadas }
  }

  const adicionarRefeicao = (ultimaRefeicao: boolean = false) => {
    const analise = simularAnaliseImagem()
    const agora = new Date()
    const novaRefeicao: Refeicao = {
      id: Date.now(),
      foto: fotoAtual || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&h=300&fit=crop",
      calorias: analise.calorias,
      proteinas: analise.proteinas,
      hora: `${agora.getHours().toString().padStart(2, '0')}:${agora.getMinutes().toString().padStart(2, '0')}`,
      ultimaRefeicao
    }
    
    setRefeicoes([...refeicoes, novaRefeicao])
    setFotoAtual("")
  }

  const calcularTotaisDia = () => {
    const totalCalorias = refeicoes.reduce((acc, ref) => acc + ref.calorias, 0)
    const totalProteinas = refeicoes.reduce((acc, ref) => acc + ref.proteinas, 0)
    return { totalCalorias, totalProteinas }
  }

  const adicionarAgua = (quantidade: number) => {
    setAguaConsumida(prev => Math.min(prev + quantidade, (userData?.aguaDiaria || 0) * 1000))
  }

  const registrarPeso = () => {
    if (userData) {
      const agora = new Date()
      const novoPeso = {
        data: `${agora.getDate().toString().padStart(2, '0')}/${(agora.getMonth() + 1).toString().padStart(2, '0')}/${agora.getFullYear()}`,
        peso: userData.peso
      }
      setPesosRegistrados([...pesosRegistrados, novoPeso])
    }
  }

  const conectarMonitor = () => {
    if (userData) {
      setUserData({...userData, monitorConectado: true})
      const agora = new Date()
      // Simular dados do monitor
      const novaAtividade: AtividadeFisica = {
        data: `${agora.getDate().toString().padStart(2, '0')}/${(agora.getMonth() + 1).toString().padStart(2, '0')}/${agora.getFullYear()}`,
        caloriasGastas: Math.floor(Math.random() * 500) + 300,
        passos: Math.floor(Math.random() * 5000) + 5000,
        distancia: Math.floor(Math.random() * 5) + 3,
        tempoAtivo: Math.floor(Math.random() * 60) + 30
      }
      setAtividadesFisicas([...atividadesFisicas, novaAtividade])
    }
  }

  const iniciarTesteGratis = (planoEscolhido: string) => {
    if (userData) {
      const dataInicio = new Date()
      const dataFim = new Date()
      dataFim.setDate(dataFim.getDate() + 7)
      
      setUserData({
        ...userData,
        planoAtivo: planoEscolhido,
        dataInicioTeste: dataInicio,
        dataFimTeste: dataFim
      })
    }
  }

  const assinarPlano = (plano: string) => {
    if (userData) {
      setUserData({
        ...userData,
        planoAtivo: plano,
        dataInicioTeste: null,
        dataFimTeste: null
      })
    }
  }

  const verificarAcessoAba = (aba: string) => {
    if (aba === "cadastro" || aba === "assinatura") return true
    if (!userData) return false
    if (!userData.planoAtivo) return false
    
    // Durante teste grátis, tem acesso a tudo
    if (userData.dataInicioTeste && userData.dataFimTeste) {
      const agora = new Date()
      if (agora <= userData.dataFimTeste) return true
      // Se passou dos 7 dias, converte automaticamente para assinatura paga
      if (agora > userData.dataFimTeste && userData.planoAtivo) {
        return true // Mantém acesso pois será cobrado
      }
    }
    
    // Com assinatura ativa, tem acesso a tudo
    if (userData.planoAtivo && !userData.dataInicioTeste) return true
    
    return false
  }

  const getIMCCategoria = (imc: number) => {
    if (imc < 18.5) return { texto: "Abaixo do peso", cor: "text-blue-600" }
    if (imc < 25) return { texto: "Peso normal", cor: "text-[#004d40]" }
    if (imc < 30) return { texto: "Sobrepeso", cor: "text-yellow-600" }
    return { texto: "Obesidade", cor: "text-red-600" }
  }

  const getMetaTexto = (meta: string) => {
    if (meta === "perda") return "Perda de Peso"
    if (meta === "ganho") return "Ganho de Massa Magra"
    return "Manter Resultados"
  }

  const totais = calcularTotaisDia()
  const atividadeHoje = atividadesFisicas[atividadesFisicas.length - 1]
  const deficitCalorico = atividadeHoje ? totais.totalCalorias - atividadeHoje.caloriasGastas : 0

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#e0f2f1] via-white to-[#e0f2f1]">
      <div className="relative w-full h-64 md:h-80 overflow-hidden">
        <img 
          src="https://k6hrqrxuu8obbfwn.public.blob.vercel-storage.com/temp/1acdeac9-daff-451c-b8ea-25593663a852.jpg" 
          alt="NutriSync - Seu corpo, sua meta" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent"></div>
      </div>

      <header className="bg-[#004d40] text-white py-6 px-4 shadow-lg">
        <div className="max-w-7xl mx-auto">
          <p className="text-center text-emerald-400">Seu assistente nutricional inteligente</p>
        </div>
      </header>

      <div className="max-w-7xl mx-auto p-4 md:p-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 md:grid-cols-6 gap-2 bg-transparent p-0 mb-8">
            <TabsTrigger 
              value="cadastro" 
              className="flex items-center justify-center gap-2 px-4 py-3 rounded-lg transition-all data-[state=active]:bg-[#004d40] data-[state=active]:text-white data-[state=active]:shadow-md hover:bg-gray-100 bg-white shadow-sm"
            >
              <User className="w-5 h-5" />
              <span className="hidden sm:inline font-medium uppercase">Cadastro</span>
            </TabsTrigger>
            <TabsTrigger 
              value="contagem" 
              className="flex items-center justify-center gap-2 px-4 py-3 rounded-lg transition-all data-[state=active]:bg-[#004d40] data-[state=active]:text-white data-[state=active]:shadow-md hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed bg-white shadow-sm" 
              disabled={!verificarAcessoAba("contagem")}
            >
              <Camera className="w-5 h-5" />
              <span className="hidden sm:inline font-medium uppercase">Contagem</span>
            </TabsTrigger>
            <TabsTrigger 
              value="plano" 
              className="flex items-center justify-center gap-2 px-4 py-3 rounded-lg transition-all data-[state=active]:bg-[#004d40] data-[state=active]:text-white data-[state=active]:shadow-md hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed bg-white shadow-sm" 
              disabled={!verificarAcessoAba("plano")}
            >
              <UtensilsCrossed className="w-5 h-5" />
              <span className="hidden sm:inline font-medium uppercase">Plano</span>
            </TabsTrigger>
            <TabsTrigger 
              value="relatorio" 
              className="flex items-center justify-center gap-2 px-4 py-3 rounded-lg transition-all data-[state=active]:bg-[#004d40] data-[state=active]:text-white data-[state=active]:shadow-md hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed bg-white shadow-sm" 
              disabled={!verificarAcessoAba("relatorio")}
            >
              <FileText className="w-5 h-5" />
              <span className="hidden sm:inline font-medium uppercase">Relatório</span>
            </TabsTrigger>
            <TabsTrigger 
              value="peso" 
              className="flex items-center justify-center gap-2 px-4 py-3 rounded-lg transition-all data-[state=active]:bg-[#004d40] data-[state=active]:text-white data-[state=active]:shadow-md hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed bg-white shadow-sm" 
              disabled={!verificarAcessoAba("peso")}
            >
              <Scale className="w-5 h-5" />
              <span className="hidden sm:inline font-medium uppercase">Peso</span>
            </TabsTrigger>
            <TabsTrigger 
              value="assinatura" 
              className="flex items-center justify-center gap-2 px-4 py-3 rounded-lg transition-all data-[state=active]:bg-[#004d40] data-[state=active]:text-white data-[state=active]:shadow-md hover:bg-gray-100 bg-white shadow-sm"
            >
              <CreditCard className="w-5 h-5" />
              <span className="hidden sm:inline font-medium uppercase">Assinar</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="cadastro" className="space-y-6 mt-20 md:mt-6">
            <Card className="shadow-xl border-0">
              <CardHeader className="bg-[#004d40] text-white rounded-t-lg">
                <CardTitle className="text-2xl">Cadastro Nutricional</CardTitle>
                <CardDescription className="text-[#e0f2f1]">
                  Preencha seus dados para calcular suas metas nutricionais
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="nome">Nome Completo</Label>
                  <Input
                    id="nome"
                    placeholder="Digite seu nome"
                    value={formData.nome}
                    onChange={(e) => setFormData({...formData, nome: e.target.value})}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="idade">Idade</Label>
                    <Input
                      id="idade"
                      type="number"
                      placeholder="Ex: 25"
                      value={formData.idade}
                      onChange={(e) => setFormData({...formData, idade: e.target.value})}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="sexo">Sexo</Label>
                    <Select value={formData.sexo} onValueChange={(value) => setFormData({...formData, sexo: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="masculino">Masculino</SelectItem>
                        <SelectItem value="feminino">Feminino</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="peso">Peso (kg)</Label>
                    <Input
                      id="peso"
                      type="number"
                      step="0.1"
                      placeholder="Ex: 70.5"
                      value={formData.peso}
                      onChange={(e) => setFormData({...formData, peso: e.target.value})}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="altura">Altura (m ou cm)</Label>
                    <Input
                      id="altura"
                      type="number"
                      step="0.01"
                      placeholder="Ex: 1.75 ou 175"
                      value={formData.altura}
                      onChange={(e) => setFormData({...formData, altura: e.target.value})}
                    />
                    <p className="text-xs text-gray-500">Aceita metros (1.75) ou centímetros (175)</p>
                  </div>
                </div>

                <div className="space-y-3 p-4 bg-orange-50 rounded-lg border-2 border-orange-200">
                  <Label className="text-base font-semibold text-gray-800">🚫 Restrições Alimentares</Label>
                  <p className="text-sm text-gray-600">Selecione suas restrições para gerar um plano alimentar personalizado</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {[
                      { id: "sem-restricoes", label: "Sem Restrições" },
                      { id: "lactose", label: "Intolerante à Lactose" },
                      { id: "gluten", label: "Intolerante ao Glúten" },
                      { id: "vegano", label: "Vegano" },
                      { id: "vegetariano", label: "Vegetariano" }
                    ].map((restricao) => (
                      <div key={restricao.id} className="flex items-center space-x-2 bg-white p-3 rounded-lg border border-gray-200">
                        <Checkbox
                          id={restricao.id}
                          checked={formData.restricoes.includes(restricao.id)}
                          onCheckedChange={() => toggleRestricao(restricao.id)}
                        />
                        <label
                          htmlFor={restricao.id}
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                        >
                          {restricao.label}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-3 p-4 bg-purple-50 rounded-lg border-2 border-purple-200">
                  <Label htmlFor="meta" className="text-base font-semibold text-gray-800">🎯 Minha Meta</Label>
                  <p className="text-sm text-gray-600">Selecione seu objetivo principal</p>
                  <Select value={formData.meta} onValueChange={(value) => setFormData({...formData, meta: value})}>
                    <SelectTrigger className="bg-white">
                      <SelectValue placeholder="Escolha sua meta" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="perda">🔥 Perda de Peso</SelectItem>
                      <SelectItem value="ganho">💪 Ganho de Massa Magra</SelectItem>
                      <SelectItem value="manter">⚖️ Manter Resultados</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Button 
                  onClick={calcularDadosNutricionais}
                  className="w-full bg-[#004d40] hover:bg-[#00695c] text-white font-semibold py-6 text-lg"
                  disabled={!formData.nome || !formData.idade || !formData.sexo || !formData.peso || !formData.altura || !formData.meta}
                >
                  Calcular Metas Nutricionais
                </Button>

                {userData && (
                  <div className="mt-6 p-6 bg-[#e0f2f1] rounded-lg border-2 border-[#004d40]">
                    <h3 className="text-xl font-bold text-gray-800 mb-4">📊 Suas Metas Calculadas</h3>
                    
                    <div className="mb-4 p-4 bg-purple-100 rounded-lg border-2 border-purple-300">
                      <p className="text-sm text-gray-600 mb-1">🎯 Sua Meta</p>
                      <p className="text-2xl font-bold text-purple-700">{getMetaTexto(userData.meta)}</p>
                    </div>

                    {userData.restricoes.length > 0 && (
                      <div className="mb-4 p-4 bg-orange-100 rounded-lg border-2 border-orange-300">
                        <p className="text-sm text-gray-600 mb-2">🚫 Suas Restrições</p>
                        <div className="flex flex-wrap gap-2">
                          {userData.restricoes.map((restricao) => (
                            <Badge key={restricao} variant="secondary" className="bg-orange-200 text-orange-800">
                              {restricao === "sem-restricoes" && "Sem Restrições"}
                              {restricao === "lactose" && "Sem Lactose"}
                              {restricao === "gluten" && "Sem Glúten"}
                              {restricao === "vegano" && "Vegano"}
                              {restricao === "vegetariano" && "Vegetariano"}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="bg-white p-4 rounded-lg shadow">
                        <p className="text-sm text-gray-600">IMC</p>
                        <p className="text-3xl font-bold text-[#004d40]">{userData.imc.toFixed(1)}</p>
                        <p className={`text-sm font-semibold ${getIMCCategoria(userData.imc).cor}`}>
                          {getIMCCategoria(userData.imc).texto}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">Altura: {userData.altura.toFixed(2)}m</p>
                        <div className="mt-2 pt-2 border-t border-gray-200">
                          <p className="text-xs text-gray-600 font-semibold">💚 Peso Ideal:</p>
                          <p className="text-sm font-bold text-[#004d40]">
                            {userData.pesoIdeal.min} kg - {userData.pesoIdeal.max} kg
                          </p>
                        </div>
                      </div>
                      <div className="bg-white p-4 rounded-lg shadow">
                        <p className="text-sm text-gray-600">Água Diária</p>
                        <p className="text-3xl font-bold text-blue-600">{userData.aguaDiaria.toFixed(1)}L</p>
                        <p className="text-sm text-gray-500">Hidratação ideal</p>
                      </div>
                      <div className="bg-white p-4 rounded-lg shadow">
                        <p className="text-sm text-gray-600">Proteínas Diárias</p>
                        <p className="text-3xl font-bold text-orange-600">{userData.proteinasDiarias.toFixed(0)}g</p>
                        <p className="text-sm text-gray-500">
                          {userData.meta === "ganho" && "Para hipertrofia"}
                          {userData.meta === "perda" && "Para preservar massa"}
                          {userData.meta === "manter" && "Para manutenção"}
                        </p>
                      </div>
                      <div className="bg-white p-4 rounded-lg shadow">
                        <p className="text-sm text-gray-600">Calorias Diárias</p>
                        <p className="text-3xl font-bold text-red-600">{userData.caloriasMaximas}</p>
                        <p className="text-sm text-gray-500">
                          {userData.meta === "ganho" && "Superávit para ganho"}
                          {userData.meta === "perda" && "Déficit para perda"}
                          {userData.meta === "manter" && "Manutenção"}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {userData && (
              <Card className="shadow-xl border-0 border-l-4 border-l-blue-500">
                <CardHeader className="bg-gradient-to-r from-blue-50 to-cyan-50">
                  <CardTitle className="text-xl flex items-center gap-2">
                    <Watch className="w-6 h-6 text-blue-600" />
                    Monitor de Atividade Física
                  </CardTitle>
                  <CardDescription>
                    Conecte seu dispositivo para acompanhar calorias gastas e atividades
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-6">
                  {!userData.monitorConectado ? (
                    <div className="text-center py-8 space-y-4">
                      <div className="w-20 h-20 mx-auto bg-blue-100 rounded-full flex items-center justify-center">
                        <Watch className="w-10 h-10 text-blue-600" />
                      </div>
                      <p className="text-gray-600">Conecte seu monitor de atividade física para rastrear suas calorias gastas</p>
                      <Button 
                        onClick={conectarMonitor}
                        className="bg-blue-600 hover:bg-blue-700 text-white"
                      >
                        Conectar Monitor
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="flex items-center gap-2 text-green-600 font-semibold">
                        <div className="w-3 h-3 bg-green-600 rounded-full animate-pulse"></div>
                        Monitor Conectado
                      </div>
                      <p className="text-sm text-gray-600">Seus dados de atividade física estão sendo sincronizados automaticamente</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="contagem" className="mt-20 md:mt-6">
            <Card className="shadow-xl border-0">
              <CardHeader className="bg-[#004d40] text-white rounded-t-lg">
                <CardTitle className="text-2xl">📸 Contagem de Calorias</CardTitle>
                <CardDescription className="text-[#e0f2f1]">
                  Fotografe seus alimentos e acompanhe sua ingestão diária
                </CardDescription>
              </CardHeader>
              <CardContent className="p-4 md:p-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card className="bg-gradient-to-br from-red-50 to-orange-50 border-red-200">
                    <CardContent className="p-4">
                      <p className="text-sm text-gray-600 mb-1">Calorias Hoje</p>
                      <p className="text-3xl font-bold text-red-600">{totais.totalCalorias}</p>
                      <Progress 
                        value={(totais.totalCalorias / (userData?.caloriasMaximas || 2000)) * 100} 
                        className="mt-2"
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        Meta: {userData?.caloriasMaximas || 0} kcal
                      </p>
                    </CardContent>
                  </Card>

                  <Card className="bg-gradient-to-br from-orange-50 to-yellow-50 border-orange-200">
                    <CardContent className="p-4">
                      <p className="text-sm text-gray-600 mb-1">Proteínas Hoje</p>
                      <p className="text-3xl font-bold text-orange-600">{totais.totalProteinas}g</p>
                      <Progress 
                        value={(totais.totalProteinas / (userData?.proteinasDiarias || 100)) * 100} 
                        className="mt-2"
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        Meta: {userData?.proteinasDiarias.toFixed(0) || 0}g
                      </p>
                    </CardContent>
                  </Card>

                  <Card className="bg-gradient-to-br from-blue-50 to-cyan-50 border-blue-200">
                    <CardContent className="p-4">
                      <p className="text-sm text-gray-600 mb-1">Água Hoje</p>
                      <p className="text-3xl font-bold text-blue-600">{(aguaConsumida / 1000).toFixed(1)}L</p>
                      <Progress 
                        value={(aguaConsumida / ((userData?.aguaDiaria || 0) * 1000)) * 100} 
                        className="mt-2"
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        Meta: {userData?.aguaDiaria.toFixed(1) || 0}L
                      </p>
                      <div className="flex gap-2 mt-3">
                        <Button 
                          size="sm" 
                          variant="outline" 
                          onClick={() => adicionarAgua(250)}
                          className="flex-1 text-xs"
                        >
                          +250ml
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline" 
                          onClick={() => adicionarAgua(500)}
                          className="flex-1 text-xs"
                        >
                          +500ml
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <div className="bg-gray-50 p-4 md:p-6 rounded-lg border-2 border-dashed border-gray-300">
                  <h3 className="font-bold text-gray-800 mb-4">📷 Adicionar Nova Refeição</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-center w-full">
                      <label className="flex flex-col items-center justify-center w-full h-48 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-white hover:bg-gray-50">
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                          <Camera className="w-12 h-12 text-gray-400 mb-3" />
                          <p className="mb-2 text-sm text-gray-500">
                            <span className="font-semibold">Clique para fotografar</span> ou arraste a imagem
                          </p>
                          <p className="text-xs text-gray-500">PNG, JPG ou JPEG</p>
                        </div>
                        <input type="file" className="hidden" accept="image/*" />
                      </label>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-2">
                      <Button 
                        onClick={() => adicionarRefeicao(false)}
                        className="flex-1 bg-[#004d40] hover:bg-[#00695c] text-sm"
                      >
                        Visualizar Refeição
                      </Button>
                      <Button 
                        onClick={() => adicionarRefeicao(false)}
                        className="flex-1 bg-orange-600 hover:bg-orange-700 text-sm"
                      >
                        Adicionar ao Dia
                      </Button>
                    </div>

                    <Button 
                      onClick={() => adicionarRefeicao(true)}
                      className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-sm"
                    >
                      ⭐ Última Refeição (Fechar Dia)
                    </Button>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="font-bold text-gray-800">📋 Refeições de Hoje</h3>
                  {refeicoes.length === 0 ? (
                    <p className="text-center text-gray-500 py-8">Nenhuma refeição registrada ainda</p>
                  ) : (
                    refeicoes.map((refeicao) => (
                      <Card key={refeicao.id} className={refeicao.ultimaRefeicao ? "border-2 border-purple-500 bg-purple-50" : ""}>
                        <CardContent className="p-4">
                          <div className="flex gap-4">
                            <img 
                              src={refeicao.foto} 
                              alt="Refeição" 
                              className="w-24 h-24 rounded-lg object-cover flex-shrink-0"
                            />
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-2 flex-wrap">
                                <Badge variant="secondary">{refeicao.hora}</Badge>
                                {refeicao.ultimaRefeicao && (
                                  <Badge className="bg-purple-600 text-white">Última Refeição</Badge>
                                )}
                              </div>
                              <div className="grid grid-cols-2 gap-2">
                                <div>
                                  <p className="text-sm text-gray-600">Calorias</p>
                                  <p className="text-xl font-bold text-red-600">{refeicao.calorias} kcal</p>
                                </div>
                                <div>
                                  <p className="text-sm text-gray-600">Proteínas</p>
                                  <p className="text-xl font-bold text-orange-600">{refeicao.proteinas}g</p>
                                </div>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))
                  )}
                </div>

                {refeicoes.some(r => r.ultimaRefeicao) && (
                  <Card className="bg-gradient-to-r from-purple-600 to-pink-600 text-white">
                    <CardContent className="p-6">
                      <h3 className="text-2xl font-bold mb-4">🎯 Resumo do Dia</h3>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <p className="text-purple-100 text-sm">Calorias</p>
                          <p className="text-3xl font-bold">{totais.totalCalorias}</p>
                          <p className="text-sm">
                            {totais.totalCalorias <= (userData?.caloriasMaximas || 0) 
                              ? "✅ Dentro da meta!" 
                              : `⚠️ ${totais.totalCalorias - (userData?.caloriasMaximas || 0)} acima`}
                          </p>
                        </div>
                        <div>
                          <p className="text-purple-100 text-sm">Proteínas</p>
                          <p className="text-3xl font-bold">{totais.totalProteinas}g</p>
                          <p className="text-sm">
                            {totais.totalProteinas >= (userData?.proteinasDiarias || 0) 
                              ? "✅ Meta atingida!" 
                              : `⚠️ Faltam ${(userData?.proteinasDiarias || 0) - totais.totalProteinas}g`}
                          </p>
                        </div>
                        <div>
                          <p className="text-purple-100 text-sm">Status Geral</p>
                          <p className="text-3xl font-bold">
                            {totais.totalCalorias <= (userData?.caloriasMaximas || 0) && 
                             totais.totalProteinas >= (userData?.proteinasDiarias || 0) 
                              ? "🎉" 
                              : "💪"}
                          </p>
                          <p className="text-sm">
                            {totais.totalCalorias <= (userData?.caloriasMaximas || 0) && 
                             totais.totalProteinas >= (userData?.proteinasDiarias || 0) 
                              ? "Dia perfeito!" 
                              : "Continue firme!"}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="plano" className="mt-20 md:mt-6">
            <Card className="shadow-xl border-0">
              <CardHeader className="bg-[#004d40] text-white rounded-t-lg">
                <CardTitle className="text-2xl">🍽️ Plano Alimentar Semanal</CardTitle>
                <CardDescription className="text-[#e0f2f1]">
                  Plano personalizado baseado no seu IMC, meta e restrições alimentares
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6 space-y-6">
                <div className="bg-[#e0f2f1] p-6 rounded-lg border-2 border-[#004d40]">
                  <h3 className="text-xl font-bold text-gray-800 mb-2">📋 Seu Plano Personalizado</h3>
                  <p className="text-gray-700 mb-4">
                    Com base no seu IMC de <strong>{userData?.imc.toFixed(1)}</strong> ({getIMCCategoria(userData?.imc || 0).texto}),
                    criamos um plano alimentar focado em <strong>{getMetaTexto(userData?.meta || "")}</strong>.
                  </p>
                  
                  {userData?.restricoes && userData.restricoes.length > 0 && (
                    <div className="mb-4 p-3 bg-orange-100 rounded-lg border border-orange-300">
                      <p className="text-sm font-semibold text-gray-700 mb-2">🚫 Restrições consideradas:</p>
                      <div className="flex flex-wrap gap-2">
                        {userData.restricoes.map((restricao) => (
                          <Badge key={restricao} className="bg-orange-200 text-orange-800">
                            {restricao === "sem-restricoes" && "Sem Restrições"}
                            {restricao === "lactose" && "Sem Lactose"}
                            {restricao === "gluten" && "Sem Glúten"}
                            {restricao === "vegano" && "Vegano"}
                            {restricao === "vegetariano" && "Vegetariano"}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <div className="bg-white p-3 rounded-lg">
                      <p className="text-sm text-gray-600">Meta Diária</p>
                      <p className="text-xl font-bold text-[#004d40]">{userData?.caloriasMaximas} kcal</p>
                    </div>
                    <div className="bg-white p-3 rounded-lg">
                      <p className="text-sm text-gray-600">Proteínas</p>
                      <p className="text-xl font-bold text-orange-600">{userData?.proteinasDiarias.toFixed(0)}g</p>
                    </div>
                    <div className="bg-white p-3 rounded-lg">
                      <p className="text-sm text-gray-600">Hidratação</p>
                      <p className="text-xl font-bold text-blue-600">{userData?.aguaDiaria.toFixed(1)}L</p>
                    </div>
                  </div>
                </div>

                {planoAlimentar.length > 0 ? (
                  <div className="space-y-4">
                    <h3 className="text-xl font-bold text-gray-800">📅 Cardápio da Semana</h3>
                    {planoAlimentar.map((dia, index) => (
                      <Card key={index} className="border-l-4 border-l-[#004d40]">
                        <CardHeader className="bg-gray-50">
                          <CardTitle className="text-lg text-[#004d40]">{dia.dia}</CardTitle>
                        </CardHeader>
                        <CardContent className="p-4 space-y-4">
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            <div className="bg-yellow-50 p-3 rounded-lg border border-yellow-200">
                              <p className="text-xs font-semibold text-gray-600 mb-1">☀️ Café da Manhã</p>
                              <p className="font-bold text-gray-800">{dia.refeicoes.cafeDaManha.nome}</p>
                              <p className="text-xs text-gray-600 mt-1">{dia.refeicoes.cafeDaManha.descricao}</p>
                              <div className="flex gap-3 mt-2">
                                <Badge variant="secondary" className="text-xs">{dia.refeicoes.cafeDaManha.calorias} kcal</Badge>
                                <Badge variant="secondary" className="text-xs">{dia.refeicoes.cafeDaManha.proteinas}g prot</Badge>
                              </div>
                            </div>

                            <div className="bg-green-50 p-3 rounded-lg border border-green-200">
                              <p className="text-xs font-semibold text-gray-600 mb-1">🥤 Lanche 1</p>
                              <p className="font-bold text-gray-800">{dia.refeicoes.lanche1.nome}</p>
                              <p className="text-xs text-gray-600 mt-1">{dia.refeicoes.lanche1.descricao}</p>
                              <div className="flex gap-3 mt-2">
                                <Badge variant="secondary" className="text-xs">{dia.refeicoes.lanche1.calorias} kcal</Badge>
                                <Badge variant="secondary" className="text-xs">{dia.refeicoes.lanche1.proteinas}g prot</Badge>
                              </div>
                            </div>

                            <div className="bg-orange-50 p-3 rounded-lg border border-orange-200">
                              <p className="text-xs font-semibold text-gray-600 mb-1">🍽️ Almoço</p>
                              <p className="font-bold text-gray-800">{dia.refeicoes.almoco.nome}</p>
                              <p className="text-xs text-gray-600 mt-1">{dia.refeicoes.almoco.descricao}</p>
                              <div className="flex gap-3 mt-2">
                                <Badge variant="secondary" className="text-xs">{dia.refeicoes.almoco.calorias} kcal</Badge>
                                <Badge variant="secondary" className="text-xs">{dia.refeicoes.almoco.proteinas}g prot</Badge>
                              </div>
                            </div>

                            <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
                              <p className="text-xs font-semibold text-gray-600 mb-1">🍎 Lanche 2</p>
                              <p className="font-bold text-gray-800">{dia.refeicoes.lanche2.nome}</p>
                              <p className="text-xs text-gray-600 mt-1">{dia.refeicoes.lanche2.descricao}</p>
                              <div className="flex gap-3 mt-2">
                                <Badge variant="secondary" className="text-xs">{dia.refeicoes.lanche2.calorias} kcal</Badge>
                                <Badge variant="secondary" className="text-xs">{dia.refeicoes.lanche2.proteinas}g prot</Badge>
                              </div>
                            </div>

                            <div className="bg-purple-50 p-3 rounded-lg border border-purple-200">
                              <p className="text-xs font-semibold text-gray-600 mb-1">🌙 Jantar</p>
                              <p className="font-bold text-gray-800">{dia.refeicoes.jantar.nome}</p>
                              <p className="text-xs text-gray-600 mt-1">{dia.refeicoes.jantar.descricao}</p>
                              <div className="flex gap-3 mt-2">
                                <Badge variant="secondary" className="text-xs">{dia.refeicoes.jantar.calorias} kcal</Badge>
                                <Badge variant="secondary" className="text-xs">{dia.refeicoes.jantar.proteinas}g prot</Badge>
                              </div>
                            </div>

                            <div className="bg-gray-100 p-3 rounded-lg border border-gray-300 flex flex-col justify-center">
                              <p className="text-xs font-semibold text-gray-600 mb-2">📊 Total do Dia</p>
                              <p className="text-lg font-bold text-red-600">
                                {dia.refeicoes.cafeDaManha.calorias + 
                                 dia.refeicoes.lanche1.calorias + 
                                 dia.refeicoes.almoco.calorias + 
                                 dia.refeicoes.lanche2.calorias + 
                                 dia.refeicoes.jantar.calorias} kcal
                              </p>
                              <p className="text-sm font-bold text-orange-600">
                                {dia.refeicoes.cafeDaManha.proteinas + 
                                 dia.refeicoes.lanche1.proteinas + 
                                 dia.refeicoes.almoco.proteinas + 
                                 dia.refeicoes.lanche2.proteinas + 
                                 dia.refeicoes.jantar.proteinas}g proteínas
                              </p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-gray-600">Complete o cadastro nutricional para gerar seu plano alimentar personalizado.</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="relatorio" className="mt-20 md:mt-6">
            <Card className="shadow-xl border-0">
              <CardHeader className="bg-[#004d40] text-white rounded-t-lg">
                <CardTitle className="text-2xl">📊 Relatório Diário</CardTitle>
                <CardDescription className="text-[#e0f2f1]">
                  Acompanhe seu balanço calórico e progresso em direção à sua meta
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card className="bg-gradient-to-br from-red-50 to-orange-50 border-2 border-red-200">
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center gap-2">
                        🍽️ Calorias Ingeridas
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-4xl font-bold text-red-600 mb-2">{totais.totalCalorias} kcal</p>
                      <p className="text-sm text-gray-600">Meta diária: {userData?.caloriasMaximas || 0} kcal</p>
                      <Progress 
                        value={(totais.totalCalorias / (userData?.caloriasMaximas || 2000)) * 100} 
                        className="mt-3"
                      />
                      <p className="text-xs text-gray-500 mt-2">
                        {totais.totalCalorias <= (userData?.caloriasMaximas || 0) 
                          ? "✅ Dentro da meta!" 
                          : `⚠️ ${totais.totalCalorias - (userData?.caloriasMaximas || 0)} kcal acima`}
                      </p>
                    </CardContent>
                  </Card>

                  <Card className="bg-gradient-to-br from-blue-50 to-cyan-50 border-2 border-blue-200">
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center gap-2">
                        🔥 Calorias Gastas
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      {atividadeHoje ? (
                        <>
                          <p className="text-4xl font-bold text-blue-600 mb-2">{atividadeHoje.caloriasGastas} kcal</p>
                          <div className="space-y-2 text-sm text-gray-600">
                            <p>👟 Passos: {atividadeHoje.passos.toLocaleString()}</p>
                            <p>📍 Distância: {atividadeHoje.distancia} km</p>
                            <p>⏱️ Tempo ativo: {atividadeHoje.tempoAtivo} min</p>
                          </div>
                        </>
                      ) : (
                        <div className="text-center py-4">
                          <p className="text-gray-500 mb-4">Conecte seu monitor de atividade física na aba Cadastro</p>
                          <Button 
                            onClick={() => setActiveTab("cadastro")}
                            variant="outline"
                            size="sm"
                          >
                            Ir para Cadastro
                          </Button>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>

                {atividadeHoje && (
                  <Card className="bg-gradient-to-r from-purple-600 to-pink-600 text-white border-0">
                    <CardHeader>
                      <CardTitle className="text-2xl">⚖️ Balanço Calórico</CardTitle>
                      <CardDescription className="text-purple-100">
                        Análise do seu déficit/superávit calórico
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
                        <p className="text-sm text-purple-100 mb-2">Balanço do Dia</p>
                        <p className="text-5xl font-bold mb-4">
                          {deficitCalorico > 0 ? '+' : ''}{deficitCalorico} kcal
                        </p>
                        
                        {userData?.meta === "perda" && (
                          <div className="space-y-2">
                            {deficitCalorico < 0 ? (
                              <>
                                <p className="text-lg font-semibold text-green-300">✅ Déficit Calórico Alcançado!</p>
                                <p className="text-sm text-purple-100">
                                  Você está queimando mais calorias do que consumindo. Continue assim para perder peso de forma saudável!
                                </p>
                              </>
                            ) : (
                              <>
                                <p className="text-lg font-semibold text-yellow-300">⚠️ Superávit Calórico</p>
                                <p className="text-sm text-purple-100">
                                  Você consumiu mais calorias do que gastou. Para perder peso, é necessário criar um déficit calórico.
                                </p>
                              </>
                            )}
                          </div>
                        )}

                        {userData?.meta === "ganho" && (
                          <div className="space-y-2">
                            {deficitCalorico > 0 ? (
                              <>
                                <p className="text-lg font-semibold text-green-300">✅ Superávit Calórico Alcançado!</p>
                                <p className="text-sm text-purple-100">
                                  Você está consumindo mais calorias do que gastando. Perfeito para ganho de massa magra!
                                </p>
                              </>
                            ) : (
                              <>
                                <p className="text-lg font-semibold text-yellow-300">⚠️ Déficit Calórico</p>
                                <p className="text-sm text-purple-100">
                                  Para ganhar massa magra, você precisa consumir mais calorias do que gasta.
                                </p>
                              </>
                            )}
                          </div>
                        )}

                        {userData?.meta === "manter" && (
                          <div className="space-y-2">
                            {Math.abs(deficitCalorico) < 200 ? (
                              <>
                                <p className="text-lg font-semibold text-green-300">✅ Balanço Equilibrado!</p>
                                <p className="text-sm text-purple-100">
                                  Você está mantendo um equilíbrio saudável entre consumo e gasto calórico.
                                </p>
                              </>
                            ) : (
                              <>
                                <p className="text-lg font-semibold text-yellow-300">⚠️ Desequilíbrio Calórico</p>
                                <p className="text-sm text-purple-100">
                                  Para manter seu peso, tente equilibrar melhor suas calorias consumidas e gastas.
                                </p>
                              </>
                            )}
                          </div>
                        )}
                      </div>

                      <div className="grid grid-cols-3 gap-4 text-center">
                        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3">
                          <p className="text-xs text-purple-100">Ingeridas</p>
                          <p className="text-xl font-bold">{totais.totalCalorias}</p>
                        </div>
                        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3">
                          <p className="text-xs text-purple-100">Gastas</p>
                          <p className="text-xl font-bold">{atividadeHoje.caloriasGastas}</p>
                        </div>
                        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3">
                          <p className="text-xs text-purple-100">Balanço</p>
                          <p className="text-xl font-bold">{deficitCalorico > 0 ? '+' : ''}{deficitCalorico}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {!atividadeHoje && (
                  <Card className="border-2 border-dashed border-gray-300">
                    <CardContent className="p-8 text-center">
                      <Watch className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                      <p className="text-gray-600 mb-2">Conecte seu monitor de atividade física</p>
                      <p className="text-sm text-gray-500 mb-4">
                        Para visualizar o balanço calórico completo e saber se está em déficit ou superávit, conecte seu dispositivo na aba Cadastro
                      </p>
                      <Button 
                        onClick={() => setActiveTab("cadastro")}
                        className="bg-[#004d40] hover:bg-[#00695c]"
                      >
                        Conectar Agora
                      </Button>
                    </CardContent>
                  </Card>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="peso" className="mt-20 md:mt-6">
            <Card className="shadow-xl border-0">
              <CardHeader className="bg-[#004d40] text-white rounded-t-lg">
                <CardTitle className="text-2xl">⚖️ Acompanhamento de Peso</CardTitle>
                <CardDescription className="text-[#e0f2f1]">
                  Registre seu peso a cada 15 dias para monitorar o progresso
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6 space-y-6">
                <Card className="bg-[#e0f2f1] border-[#004d40]">
                  <CardContent className="p-6">
                    <h3 className="text-lg font-bold text-gray-800 mb-4">📝 Registrar Peso Atual</h3>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="novoPeso">Peso Atual (kg)</Label>
                        <Input
                          id="novoPeso"
                          type="number"
                          step="0.1"
                          placeholder="Ex: 68.5"
                          value={userData?.peso || ""}
                          onChange={(e) => {
                            if (userData) {
                              setUserData({...userData, peso: parseFloat(e.target.value)})
                            }
                          }}
                        />
                      </div>
                      <Button 
                        onClick={registrarPeso}
                        className="w-full bg-[#004d40] hover:bg-[#00695c]"
                      >
                        Registrar Peso
                      </Button>
                      <p className="text-sm text-gray-600 text-center">
                        💡 Registre seu peso a cada 15 dias para acompanhar o progresso
                      </p>
                    </div>
                  </CardContent>
                </Card>

                <div className="space-y-4">
                  <h3 className="text-lg font-bold text-gray-800">📈 Histórico de Peso</h3>
                  {pesosRegistrados.length === 0 ? (
                    <Card>
                      <CardContent className="p-8 text-center text-gray-500">
                        <Scale className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                        <p>Nenhum registro de peso ainda</p>
                        <p className="text-sm mt-2">Registre seu peso acima para começar o acompanhamento</p>
                      </CardContent>
                    </Card>
                  ) : (
                    pesosRegistrados.map((registro, index) => {
                      const anterior = index > 0 ? pesosRegistrados[index - 1].peso : null
                      const diferenca = anterior ? registro.peso - anterior : 0
                      
                      return (
                        <Card key={index} className="border-l-4 border-l-[#004d40]">
                          <CardContent className="p-4">
                            <div className="flex items-center justify-between">
                              <div>
                                <p className="text-sm text-gray-600">{registro.data}</p>
                                <p className="text-3xl font-bold text-[#004d40]">{registro.peso} kg</p>
                              </div>
                              {anterior && (
                                <div className="text-right">
                                  <p className="text-sm text-gray-600">Variação</p>
                                  <p className={`text-2xl font-bold ${diferenca < 0 ? 'text-[#004d40]' : 'text-red-600'}`}>
                                    {diferenca > 0 ? '+' : ''}{diferenca.toFixed(1)} kg
                                  </p>
                                  <p className="text-xs text-gray-500">
                                    {diferenca < 0 ? '✅ Perdeu peso!' : '⚠️ Ganhou peso'}
                                  </p>
                                </div>
                              )}
                            </div>
                          </CardContent>
                        </Card>
                      )
                    })
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="assinatura" className="mt-20 md:mt-6">
            <Card className="shadow-xl border-0">
              <CardHeader className="bg-[#004d40] text-white rounded-t-lg">
                <CardTitle className="text-2xl">💳 Planos de Assinatura</CardTitle>
                <CardDescription className="text-[#e0f2f1]">
                  Escolha o plano ideal para você e tenha acesso completo
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6 space-y-6">
                {userData?.dataInicioTeste && userData.dataFimTeste && (
                  <Card className="bg-gradient-to-r from-blue-50 to-cyan-50 border-2 border-blue-300">
                    <CardContent className="p-6">
                      <div className="flex items-center gap-4">
                        <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
                          <span className="text-3xl">⏰</span>
                        </div>
                        <div className="flex-1">
                          <h3 className="text-xl font-bold text-gray-800 mb-2">Teste Grátis Ativo - {userData.planoAtivo === "mensal" ? "Plano Mensal" : userData.planoAtivo === "trimestral" ? "Plano Trimestral" : "Plano Anual"}</h3>
                          <p className="text-gray-700">
                            Você está no período de teste grátis de 7 dias. Após esse período, será cobrado automaticamente o valor do plano escolhido.
                          </p>
                          <p className="text-sm text-gray-600 mt-2">
                            Dias restantes: {Math.max(0, Math.ceil((userData.dataFimTeste.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)))}
                          </p>
                          <p className="text-xs text-gray-500 mt-1">
                            Cancele a qualquer momento antes do fim do período de teste para não ser cobrado.
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {userData?.planoAtivo && !userData.dataInicioTeste && (
                  <Card className="bg-gradient-to-r from-purple-50 to-pink-50 border-2 border-purple-300">
                    <CardContent className="p-6">
                      <div className="flex items-center gap-4">
                        <div className="w-16 h-16 bg-purple-500 rounded-full flex items-center justify-center flex-shrink-0">
                          <span className="text-3xl">✅</span>
                        </div>
                        <div className="flex-1">
                          <h3 className="text-xl font-bold text-gray-800 mb-2">Plano Ativo</h3>
                          <p className="text-gray-700">
                            Você está com o plano <strong>{userData.planoAtivo === "mensal" ? "Mensal" : userData.planoAtivo === "trimestral" ? "Trimestral" : "Anual"}</strong> ativo.
                          </p>
                          <p className="text-sm text-gray-600 mt-2">
                            Aproveite todas as funcionalidades sem limites!
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <Card className="border-2 border-gray-200 hover:border-[#004d40] transition-all">
                    <CardHeader>
                      <CardTitle className="text-xl">Plano Mensal</CardTitle>
                      <CardDescription>Flexibilidade mês a mês</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-4xl font-bold text-[#004d40] mb-4">
                        R$ 19,90<span className="text-sm text-gray-500">/mês</span>
                      </p>
                      <ul className="space-y-2 text-sm text-gray-600 mb-6">
                        <li>✅ Contagem de calorias ilimitada</li>
                        <li>✅ Plano alimentar personalizado</li>
                        <li>✅ Acompanhamento de peso</li>
                        <li>✅ Monitor de atividades</li>
                        <li>✅ Relatórios detalhados</li>
                        <li>🎁 7 dias de teste grátis</li>
                      </ul>
                      <Button 
                        onClick={() => iniciarTesteGratis("mensal")}
                        className="w-full bg-[#004d40] hover:bg-[#00695c]"
                        disabled={userData?.planoAtivo === "mensal"}
                      >
                        {userData?.planoAtivo === "mensal" ? "Plano Atual" : "Iniciar Teste Grátis"}
                      </Button>
                    </CardContent>
                  </Card>

                  <Card className="border-4 border-[#004d40] relative hover:shadow-xl transition-all">
                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                      <Badge className="bg-[#004d40] text-white px-4 py-1 text-sm">Mais Popular</Badge>
                    </div>
                    <CardHeader>
                      <CardTitle className="text-xl">Plano Trimestral</CardTitle>
                      <CardDescription>Economia de 33%</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-4xl font-bold text-[#004d40] mb-1">
                        R$ 39,90<span className="text-sm text-gray-500">/3 meses</span>
                      </p>
                      <p className="text-sm text-green-600 font-semibold mb-4">R$ 13,30/mês</p>
                      <ul className="space-y-2 text-sm text-gray-600 mb-6">
                        <li>✅ Tudo do Plano Mensal</li>
                        <li>✅ Economia de R$ 19,80</li>
                        <li>✅ Suporte prioritário</li>
                        <li>✅ Relatórios avançados</li>
                        <li>✅ Sem reajuste por 3 meses</li>
                        <li>🎁 7 dias de teste grátis</li>
                      </ul>
                      <Button 
                        onClick={() => iniciarTesteGratis("trimestral")}
                        className="w-full bg-[#004d40] hover:bg-[#00695c]"
                        disabled={userData?.planoAtivo === "trimestral"}
                      >
                        {userData?.planoAtivo === "trimestral" ? "Plano Atual" : "Iniciar Teste Grátis"}
                      </Button>
                    </CardContent>
                  </Card>

                  <Card className="border-2 border-gray-200 hover:border-[#004d40] transition-all">
                    <CardHeader>
                      <CardTitle className="text-xl">Plano Anual</CardTitle>
                      <CardDescription>Melhor custo-benefício</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-4xl font-bold text-[#004d40] mb-1">
                        R$ 99,90<span className="text-sm text-gray-500">/ano</span>
                      </p>
                      <p className="text-sm text-green-600 font-semibold mb-4">R$ 8,33/mês</p>
                      <ul className="space-y-2 text-sm text-gray-600 mb-6">
                        <li>✅ Tudo do Plano Trimestral</li>
                        <li>✅ Economia de R$ 138,90</li>
                        <li>✅ Consultoria nutricional</li>
                        <li>✅ Planos exclusivos</li>
                        <li>✅ Acesso vitalício a atualizações</li>
                        <li>🎁 7 dias de teste grátis</li>
                      </ul>
                      <Button 
                        onClick={() => iniciarTesteGratis("anual")}
                        className="w-full bg-[#004d40] hover:bg-[#00695c]"
                        disabled={userData?.planoAtivo === "anual"}
                      >
                        {userData?.planoAtivo === "anual" ? "Plano Atual" : "Iniciar Teste Grátis"}
                      </Button>
                    </CardContent>
                  </Card>
                </div>

                <Card className="bg-gray-50 border-gray-200">
                  <CardContent className="p-6">
                    <h3 className="text-lg font-bold text-gray-800 mb-4">ℹ️ Como Funciona o Teste Grátis</h3>
                    <ul className="space-y-2 text-sm text-gray-600">
                      <li>• <strong>7 Dias Grátis:</strong> Ao escolher um plano, você tem 7 dias de acesso completo sem custo</li>
                      <li>• <strong>Cobrança Automática:</strong> Se não cancelar até o fim dos 7 dias, será cobrado automaticamente o valor do plano escolhido</li>
                      <li>• <strong>Cancelamento:</strong> Pode cancelar a qualquer momento durante o período de teste sem ser cobrado</li>
                      <li>• <strong>Sem Plano:</strong> Acesso apenas ao Cadastro Nutricional</li>
                      <li>• <strong>Com Plano:</strong> Acesso completo a todas as funcionalidades</li>
                      <li>• <strong>Pagamento Seguro:</strong> Processado de forma segura via Stripe</li>
                    </ul>
                  </CardContent>
                </Card>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
