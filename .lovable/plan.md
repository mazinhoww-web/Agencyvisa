

# Plano: Conectar todas as integrações + Google Auth

## Visão geral

Vamos configurar 5 integrações na seguinte ordem:

1. **Lovable Cloud (Supabase)** — base para tudo (banco de dados, auth, edge functions)
2. **Google Auth** — login social via Supabase Auth
3. **Stripe** — pagamentos (cartão e PIX)
4. **Resend** — emails transacionais (API Key como secret para edge functions)
5. **Z-API** — WhatsApp (Instance ID + Token como secrets para edge functions)

## Passo a passo

### 1. Ativar Lovable Cloud
- Ativar Lovable Cloud no projeto (cria instância Supabase automaticamente)
- Criar migrations para o schema do banco: `profiles`, `processes`, `applicants`, `documents`, `appointments`, `available_dates`, `coupons`, `leads`, `email_templates`, `email_logs`
- Configurar RLS policies e triggers

### 2. Autenticação com Google
- Implementar Supabase Auth real no `AuthContext.tsx` (substituir TODOs)
- Ativar Google OAuth provider no Supabase
- Criar tabela `profiles` com trigger automático no signup
- Criar tabela `user_roles` separada (segurança)
- Adicionar botão "Entrar com Google" na página de login
- Implementar rotas protegidas e redirecionamento por role

### 3. Stripe
- Usar a ferramenta de ativação do Stripe da Lovable
- Você fornecerá a Secret Key quando solicitado
- Criar produtos para os pacotes Start+, Pro+ e Vip+
- Implementar checkout e webhooks

### 4. Resend (API Key)
- Armazenar `RESEND_API_KEY` como secret do projeto
- Criar edge function para envio de emails
- Conectar com templates de email do admin

### 5. Z-API (WhatsApp)
- Armazenar `ZAPI_INSTANCE_ID` e `ZAPI_TOKEN` como secrets
- Criar edge function para envio de mensagens WhatsApp
- Conectar com inbox do admin

## Credenciais necessárias (resumo)

| Integração | O que você precisa fornecer |
|---|---|
| **Stripe** | Secret Key + Publishable Key |
| **Resend** | API Key |
| **Z-API** | Instance ID + Token |
| **Google OAuth** | Client ID + Client Secret (do Google Cloud Console) |

Para o Google OAuth, você precisa criar um projeto no [Google Cloud Console](https://console.cloud.google.com), ativar a OAuth consent screen, e criar credenciais OAuth 2.0. Eu vou guiá-lo quando chegarmos nessa etapa.

## Ordem de execução

Vamos começar ativando o Lovable Cloud e configurando a autenticação, pois todas as outras integrações dependem do banco de dados e das edge functions.

