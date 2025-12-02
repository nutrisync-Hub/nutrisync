"use client"

import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { CheckCircle, Loader2 } from 'lucide-react'
import Link from 'next/link'

export default function SuccessPage() {
  const searchParams = useSearchParams()
  const sessionId = searchParams.get('session_id')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Simular verificação da sessão
    const timer = setTimeout(() => {
      setLoading(false)
    }, 2000)

    return () => clearTimeout(timer)
  }, [sessionId])

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#e0f2f1] via-white to-[#e0f2f1] flex items-center justify-center p-4">
        <Card className="max-w-md w-full">
          <CardContent className="p-12 text-center">
            <Loader2 className="w-16 h-16 text-[#004d40] animate-spin mx-auto mb-4" />
            <p className="text-gray-600">Verificando seu pagamento...</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#e0f2f1] via-white to-[#e0f2f1] flex items-center justify-center p-4">
      <Card className="max-w-md w-full shadow-2xl">
        <CardHeader className="text-center pb-4">
          <div className="mx-auto mb-4 w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
            <CheckCircle className="w-12 h-12 text-green-600" />
          </div>
          <CardTitle className="text-3xl font-bold text-gray-900">
            Pagamento Confirmado!
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-6">
          <p className="text-gray-600 text-lg">
            Sua assinatura foi ativada com sucesso. Bem-vindo ao NutriSync!
          </p>

          <div className="bg-[#e0f2f1] p-6 rounded-lg">
            <p className="text-sm text-gray-700 mb-2">
              📧 Enviamos um email de confirmação com todos os detalhes da sua assinatura.
            </p>
            <p className="text-sm text-gray-700">
              🎉 Você já pode começar a usar todos os recursos do seu plano!
            </p>
          </div>

          <div className="space-y-3">
            <Link href="/" className="block">
              <Button className="w-full bg-[#004d40] hover:bg-[#00695c] py-6 text-lg">
                Começar a Usar
              </Button>
            </Link>
            
            <p className="text-sm text-gray-500">
              ID da Sessão: {sessionId?.slice(0, 20)}...
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
