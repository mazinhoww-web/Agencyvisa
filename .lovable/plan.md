

# Plan: Fix Build Errors + Implement Cia do Visto

## Priority 1 -- Fix Build Errors (app is completely broken)

The app cannot start due to multiple issues. These must be fixed first:

### 1.1 Critical: `rollup` package missing
The `vite` dev server fails because `rollup` is not found. This is likely caused by a corrupted dependency state. Fix by adding `rollup` as an explicit devDependency in `package.json`.

### 1.2 TypeScript errors in existing UI components
The tsconfig was likely changed to be stricter in the previous edit. The errors in `chart.tsx`, `sheet.tsx`, `input-otp.tsx`, and `sidebar.tsx` are all caused by TypeScript strict mode. Fix by reverting `tsconfig.app.json` to use `"strict": false` and ensuring `"skipLibCheck": true` is set. These are standard shadcn/ui components that work fine with the default Lovable config.

### 1.3 `@tanstack/react-query` QueryClient error
The import `QueryClient` is failing. This may also be a dependency version issue. Will verify and fix the import.

---

## Priority 2 -- Implement "Cia do Visto" App

The original repo is built with **Next.js 14 (App Router)**, which Lovable does not support. The entire app must be recreated using **React + Vite + React Router**. The repo contains:

### Modules to Build (in order)

**Phase 1 -- Landing Page (public)**
- Hero section with brand "Cia do Visto"
- 3 packages: Start+ (R$299), Pro+ (R$599), Vip+ (R$999)
- Testimonials section
- FAQ accordion
- CTA / WhatsApp contact button

**Phase 2 -- Authentication**
- Login/Register pages using Supabase Auth (Lovable Cloud)
- Password reset flow
- Protected routes for client and admin areas
- User profiles table with role-based access (admin vs client)

**Phase 3 -- Client Portal**
- Client dashboard with process timeline
- DS-160 form (multi-step wizard)
- Consular fee with USD exchange rate
- CASV/Consulate appointment scheduling
- Document upload and management

**Phase 4 -- Admin Panel**
- Admin dashboard with metrics (revenue, processes, conversion)
- Process list with filters and status management
- Process detail view with notes, status changes, financials
- Available dates management for CASV/consulates
- Settings page

**Phase 5 -- CRM & Email**
- Leads CRM with scoring and status
- Email templates CRUD
- Email sending and history
- Nurturing sequences automation

**Phase 6 -- Integrations (Edge Functions)**
- Z-API (WhatsApp) -- via Supabase Edge Functions
- Stripe (payments) -- checkout and webhooks
- Resend (email) -- transactional emails
- AwesomeAPI (USD exchange rate)

### Database Schema (Supabase Migrations)
The repo has 3 migrations covering:
- `profiles`, `processes`, `process_notes`, `process_documents`
- `available_dates`, `appointments`, `coupons`
- `leads`, `email_templates`, `email_logs`, `lead_email_queue`
- RLS policies, triggers, storage buckets

### Technical Details

- **Routing**: React Router with layout wrappers for public/client/admin areas
- **State**: React Query for server state, React context for auth
- **UI**: shadcn/ui components (already in project) + Tailwind
- **Config**: `src/config/packages.ts`, `src/config/locations.ts`, `src/config/seo.ts` adapted for SPA
- **Types**: Full TypeScript types for database schema
- **Backend**: Supabase Edge Functions for payment webhooks, WhatsApp, email

### Integration Readiness
After Phase 2, the app will be ready for you to connect:
- Supabase (via Lovable Cloud -- will set up during Phase 2)
- Z-API credentials (you'll provide the API key)
- Stripe credentials (you'll provide the publishable + secret keys)
- Resend credentials (you'll provide the API key)

---

## Recommended Approach

Given the scope, I suggest we **start with Phase 1 (fix build + landing page)** so you can see the visual foundation immediately. Then we proceed phase by phase, setting up Supabase/Lovable Cloud when we reach authentication.

