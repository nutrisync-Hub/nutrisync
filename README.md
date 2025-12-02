# 📱 NutriSync - App de Nutrição

Aplicativo mobile desenvolvido com Next.js 15 + Capacitor, pronto para publicação na App Store e Google Play.

## 🎯 Configurações do Projeto

- **Bundle ID**: `com.tainafranco.nutrisync`
- **Nome do App**: NutriSync
- **Team ID**: KNP58N4GAD
- **Versão**: 1.0.0

---

## ⚙️ Configuração de Variáveis de Ambiente

Antes de fazer o build, você precisa configurar as chaves do Stripe:

1. Crie um arquivo `.env.local` na raiz do projeto
2. Adicione suas chaves do Stripe:

```env
# Stripe Configuration (OBRIGATÓRIO para pagamentos)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_sua_chave_publica_aqui

# Supabase Configuration (opcional)
# NEXT_PUBLIC_SUPABASE_URL=
# NEXT_PUBLIC_SUPABASE_ANON_KEY=

# OpenAI Configuration (opcional)
# OPENAI_API_KEY=
```

### 🔑 Como Obter as Chaves do Stripe

1. Acesse [Stripe Dashboard](https://dashboard.stripe.com)
2. Vá em **Developers** > **API keys**
3. Copie a **Publishable key** (começa com `pk_test_` ou `pk_live_`)

⚠️ **IMPORTANTE**: 
- Use chaves de **teste** (`test`) durante desenvolvimento
- Use chaves de **produção** (`live`) apenas para publicação final
- Este projeto usa **Stripe Checkout hospedado** (não precisa de Secret Key)

📚 **Documentação completa**: Veja [STRIPE-SETUP.md](./STRIPE-SETUP.md) para instruções detalhadas

---

## 📥 Como Baixar Este Projeto

### Opção 1: Via GitHub (Recomendado)
1. Acesse o repositório no GitHub
2. Clique no botão verde **"Code"**
3. Selecione **"Download ZIP"**
4. Extraia o arquivo no seu computador

### Opção 2: Via Git Clone
```bash
git clone [URL-DO-REPOSITORIO]
cd nutrisync
```

---

## 🚀 Build e Publicação - Passo a Passo Completo

### ⚠️ Requisitos
- **Mac** com macOS 12+ (Monterey ou superior)
- **Xcode** 14+ instalado (baixe da Mac App Store)
- **Conta Apple Developer** ativa ($99/ano)
- **Node.js** 18+ instalado
- **Chaves do Stripe** configuradas no `.env.local`

### 📋 Comandos para Build iOS

Execute estes 3 comandos na ordem:

```bash
# 1. Instalar dependências
npm install

# 2. Gerar build do Next.js (cria a pasta 'out/')
npm run build

# 3. Sincronizar com iOS (atualiza a pasta ios/)
npx cap sync ios
```

### 🎯 Abrir no Xcode

```bash
# Abrir projeto no Xcode
npx cap open ios
```

### 📱 Configurar no Xcode

1. Selecione o projeto **"App"** no navegador lateral
2. Vá para **Signing & Capabilities**
3. Configure:
   - **Team**: Selecione o time com ID `KNP58N4GAD`
   - **Bundle Identifier**: Verifique se está `com.tainafranco.nutrisync`
   - Marque **"Automatically manage signing"**

### 🏗️ Gerar Archive para App Store

1. No Xcode, selecione **Any iOS Device (arm64)** como destino
2. Vá em **Product** > **Archive**
3. Aguarde a compilação (pode levar alguns minutos)
4. A janela **Organizer** abrirá automaticamente

### 📤 Enviar para App Store Connect

1. Na janela Organizer, clique em **"Distribute App"**
2. Selecione **"App Store Connect"**
3. Clique em **"Upload"**
4. Aguarde o upload completar

### ✅ Finalizar no App Store Connect

1. Acesse [App Store Connect](https://appstoreconnect.apple.com)
2. Vá em **"Meus Apps"** > **NutriSync**
3. Complete as informações:
   - Screenshots (obrigatório)
   - Descrição
   - Palavras-chave
   - Categoria
4. Submeta para revisão

---

## 🤖 Publicação no Google Play (Android)

### ⚠️ Requisitos
- **Conta Google Play Console** ($25 taxa única)
- **Android Studio** instalado
- **Java JDK** 11+ instalado

### 📋 Comandos para Build Android

```bash
# 1. Instalar dependências
npm install

# 2. Gerar build do Next.js
npm run build

# 3. Sincronizar com Android
npx cap sync android

# 4. Abrir no Android Studio
npx cap open android
```

### 🏗️ Gerar APK/AAB Assinado

1. No Android Studio, vá em **Build** > **Generate Signed Bundle / APK**
2. Selecione **Android App Bundle (AAB)**
3. Crie ou selecione uma keystore
4. Complete o processo de assinatura

### 📤 Enviar para Google Play Console

1. Acesse [Google Play Console](https://play.google.com/console)
2. Crie um novo app
3. Faça upload do arquivo AAB
4. Complete as informações e submeta para revisão

---

## 🛠️ Scripts Disponíveis

### Desenvolvimento
```bash
npm run dev          # Iniciar servidor de desenvolvimento
npm run build        # Gerar build de produção
npm run start        # Iniciar servidor de produção
```

### Capacitor
```bash
npm run cap:sync           # Sincronizar código com plataformas nativas
npm run cap:open:ios       # Abrir projeto iOS no Xcode
npm run cap:open:android   # Abrir projeto Android no Android Studio
```

---

## 📁 Estrutura do Projeto

```
nutrisync/
├── src/
│   ├── app/              # Páginas Next.js
│   ├── components/       # Componentes React
│   │   └── custom/       # Componentes customizados (Stripe)
│   └── lib/             # Utilitários e configurações
├── public/              # Arquivos estáticos
├── ios/                 # Projeto iOS nativo (gerado pelo Capacitor)
├── android/             # Projeto Android nativo (gerado pelo Capacitor)
├── out/                 # Build do Next.js (gerado por 'npm run build')
├── capacitor.config.ts  # Configuração do Capacitor
├── ExportOptions.plist  # Configuração de export iOS
├── .env.local           # Variáveis de ambiente (VOCÊ PRECISA CRIAR)
├── STRIPE-SETUP.md      # Guia completo de configuração do Stripe
└── package.json         # Dependências do projeto
```

---

## 🆘 Problemas Comuns

### Build falhando com erro do Stripe
**Causa**: Variáveis de ambiente não configuradas  
**Solução**: Crie o arquivo `.env.local` com sua Publishable Key do Stripe (veja [STRIPE-SETUP.md](./STRIPE-SETUP.md))

### "No signing certificate found"
**Solução**: Você precisa criar um certificado de distribuição iOS no [Apple Developer Portal](https://developer.apple.com/account/resources/certificates).

### "Provisioning profile doesn't match"
**Solução**: Certifique-se de que o Bundle ID no Xcode corresponde ao perfil de provisionamento.

### "Team not found"
**Solução**: Verifique se você está logado com a conta correta no Xcode (Preferences > Accounts).

### Pasta ios/ não existe
**Solução**: Execute `npx cap add ios` para criar a pasta iOS nativa.

### Erro "output directory 'out' not found"
**Solução**: Execute `npm run build` antes de `npx cap sync ios`

### Checkout do Stripe não funciona
**Solução**: Veja o guia completo em [STRIPE-SETUP.md](./STRIPE-SETUP.md) para configurar Payment Links corretamente

---

## 🔒 Segurança

⚠️ **NUNCA FAÇA COMMIT DO ARQUIVO `.env.local`**

O arquivo `.env.local` está no `.gitignore` por segurança. Suas chaves do Stripe são confidenciais e não devem ser compartilhadas.

---

## 🌐 Alternativa: PWA (Progressive Web App)

Se você **não tem acesso a um Mac**, o app pode ser configurado como PWA:

✅ **Vantagens:**
- Funciona em iOS via Safari
- Instalável na tela inicial
- Funciona offline
- Não precisa de App Store

❌ **Limitações:**
- Sem acesso a recursos nativos avançados

---

## 📞 Suporte

Para dúvidas ou problemas:
1. Consulte [STRIPE-SETUP.md](./STRIPE-SETUP.md) para configuração do Stripe
2. Verifique a [documentação do Capacitor](https://capacitorjs.com/docs)
3. Consulte a [documentação da Apple](https://developer.apple.com/documentation/)
4. Documentação do Stripe: [https://stripe.com/docs](https://stripe.com/docs)

---

## 📚 Documentação Adicional

- [STRIPE-SETUP.md](./STRIPE-SETUP.md) - Guia completo de configuração do Stripe
- [GUIA_BUILD_IOS.md](./GUIA_BUILD_IOS.md) - Guia detalhado de build iOS
- [GUIA_PUBLICACAO_APP_STORE.md](./GUIA_PUBLICACAO_APP_STORE.md) - Guia completo de publicação

---

## 📄 Licença

Este projeto é privado e proprietário.

---

**Desenvolvido com ❤️ usando Next.js 15 + Capacitor + Stripe**
