

## Situação: Repositórios incompatíveis

O repositório GitHub (`mazinhoww-web/Agencyvisa`) é um projeto **Next.js** (App Router, API Routes, `next/link`, `'use client'`), enquanto o projeto Lovable é **React + Vite + React Router**. São frameworks completamente diferentes — não é possível sincronizar diretamente.

**Não dá para copiar os arquivos 1:1.** Preciso **portar** a lógica e melhorias adaptando para a arquitetura Vite/React Router + Supabase client direto.

---

## O que o repositório GitHub tem de novo/melhor

| Área | GitHub (Next.js) | Lovable (Vite) |
|------|------------------|-----------------|
| **Formulário DS-160** | 700 linhas, 8 etapas completas com persistência no Supabase | Apenas etapa 1, sem persistência |
| **Admin Dashboard** | Busca KPIs reais via `/api/admin/stats` | Hardcoded |
| **Admin Cupons** | CRUD completo com modal de criação | Tabela mock, sem CRUD |
| **Admin Leads** | Filtros, status update, envio de email por template | Tabela mock |
| **Admin Processos** | Query real + detalhe com notas/docs/financeiro | Mock data |
| **Admin WhatsApp** | Templates CRUD + envio real | Placeholder |
| **Admin Email** | Templates + envio via Resend | Placeholder |
| **Client Dashboard** | Busca processo real do usuário | Mock |
| **Client Mensagens** | Read/write real no Supabase | Mock |
| **Checkout** | PIX (AbacatePay) + Stripe + validação de cupom real | setTimeout + alert |
| **Taxa Consular** | Pagamento real com PIX | Placeholder |
| **Landing Page** | Componente unificado (LandingPageContent) | Separado em vários componentes |
| **Layouts** | Sidebar responsiva admin/client melhorada | Básico |
| **API Routes (20+)** | Next.js API routes para tudo | Edge Functions básicas |

---

## Plano de portabilidade (em fases)

Dado o volume (~15 arquivos grandes para portar), proponho dividir em fases. Cada fase é independente e funcional.

### Fase 1 — Fundação: dados reais no cliente
1. **Client Dashboard**: portar query real de `processes` + `applicants` via Supabase client direto
2. **Client Mensagens**: conectar à tabela `messages` com read/write + realtime
3. **Formulário DS-160 completo**: portar as 8 etapas com persistência na tabela `applicants`

### Fase 2 — Admin funcional
4. **Admin Dashboard**: KPIs agregados via queries Supabase (count processes, leads, receita)
5. **Admin Processos**: listar/filtrar processos reais, detalhe com notas e status update
6. **Admin Cupons**: CRUD completo com modal de criação/edição
7. **Admin Leads**: filtros, atualização de status, envio de email

### Fase 3 — Pagamentos
8. **Checkout com Stripe**: conectar à edge function `create-checkout` existente + validação de cupom real
9. **PIX via AbacatePay**: criar nova edge function portando a lógica do Next.js API route
10. **Taxa Consular pagamento**: integrar com gateway

### Fase 4 — Comunicação
11. **Admin WhatsApp**: templates CRUD + envio via edge function existente
12. **Admin Email**: templates + envio via edge function `send-email`
13. **Lead Capture funcional**: inserir leads no banco

### Fase 5 — Melhorias de UI
14. **Layouts melhorados**: sidebar responsiva para admin e client
15. **Landing page refinada**: portar melhorias visuais

---

## Abordagem técnica

- **API Routes do Next.js → Supabase client direto**: No GitHub, cada operação passa por um API route. Aqui, usaremos `supabase.from('table').select/insert/update` diretamente no frontend (protegido por RLS).
- **Operações sensíveis → Edge Functions**: Pagamentos (Stripe, AbacatePay), envio de email/WhatsApp continuam como edge functions.
- **Sem `next/link` ou `useRouter`**: Tudo adaptado para `react-router-dom` (`Link`, `useNavigate`, `useParams`).

---

## Recomendação

Começar pela **Fase 1** (cliente com dados reais) pois é o que o usuário final verá primeiro. Posso implementar uma fase por vez para manter controle de qualidade.

