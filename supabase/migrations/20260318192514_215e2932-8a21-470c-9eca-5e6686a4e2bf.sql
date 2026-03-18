
-- ==========================================
-- ENUMS
-- ==========================================
CREATE TYPE public.app_role AS ENUM ('admin', 'client');
CREATE TYPE public.process_status AS ENUM (
  'pending_form', 'form_completed', 'consular_fee_paid',
  'appointment_requested', 'docs_in_preparation', 'docs_ready', 'completed'
);
CREATE TYPE public.location_type AS ENUM ('casv', 'consulate');
CREATE TYPE public.discount_type AS ENUM ('percentage', 'fixed');
CREATE TYPE public.sender_type AS ENUM ('client', 'admin');
CREATE TYPE public.template_category AS ENUM ('status_update', 'appointment', 'sales', 'general', 'existing_client');
CREATE TYPE public.lead_status AS ENUM ('new', 'contacted', 'nurturing', 'hot', 'converted', 'lost');
CREATE TYPE public.lead_source AS ENUM ('site', 'instagram', 'whatsapp', 'referral', 'google', 'other');
CREATE TYPE public.email_template_category AS ENUM ('transactional', 'status_update', 'lead_nurturing', 'admin_notification', 'lead_magnet');
CREATE TYPE public.email_log_status AS ENUM ('sent', 'delivered', 'failed', 'bounced');

-- ==========================================
-- UTILITY FUNCTION: updated_at trigger
-- ==========================================
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- ==========================================
-- USER_ROLES TABLE (must be created before profiles trigger references it)
-- ==========================================
CREATE TABLE public.user_roles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role public.app_role NOT NULL,
  UNIQUE (user_id, role)
);
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own roles" ON public.user_roles FOR SELECT USING (auth.uid() = user_id);

-- Security definer function to check roles (avoids RLS recursion)
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role public.app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role
  )
$$;

CREATE POLICY "Admins can view all roles" ON public.user_roles FOR SELECT USING (public.has_role(auth.uid(), 'admin'));

-- ==========================================
-- PROFILES TABLE
-- ==========================================
CREATE TABLE public.profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  email TEXT,
  phone TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own profile" ON public.profiles FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update their own profile" ON public.profiles FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Admins can view all profiles" ON public.profiles FOR SELECT USING (public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Auto-create profile + default role on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (user_id, full_name, email, avatar_url)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name'),
    NEW.email,
    NEW.raw_user_meta_data->>'avatar_url'
  );
  INSERT INTO public.user_roles (user_id, role) VALUES (NEW.id, 'client');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ==========================================
-- COUPONS TABLE (before processes for FK)
-- ==========================================
CREATE TABLE public.coupons (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  code TEXT NOT NULL UNIQUE,
  discount_type public.discount_type NOT NULL,
  discount_value NUMERIC NOT NULL,
  influencer_name TEXT,
  influencer_email TEXT,
  max_uses INTEGER,
  uses_count INTEGER NOT NULL DEFAULT 0,
  total_revenue_generated NUMERIC NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  expires_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.coupons ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can validate active coupons" ON public.coupons FOR SELECT USING (is_active = true);
CREATE POLICY "Admins can manage coupons" ON public.coupons FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- ==========================================
-- PROCESSES TABLE
-- ==========================================
CREATE TABLE public.processes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  package TEXT NOT NULL,
  max_applicants INTEGER NOT NULL DEFAULT 1,
  status public.process_status NOT NULL DEFAULT 'pending_form',
  consulting_payment_id TEXT,
  consulting_amount_brl NUMERIC,
  consulting_paid_at TIMESTAMPTZ,
  consular_payment_id TEXT,
  consular_amount_brl NUMERIC,
  consular_usd_rate NUMERIC,
  consular_paid_at TIMESTAMPTZ,
  casv_city TEXT,
  casv_intended_date DATE,
  consulate_city TEXT,
  consulate_intended_date DATE,
  appointment_disclaimer_accepted_at TIMESTAMPTZ,
  coupon_id UUID REFERENCES public.coupons(id),
  discount_applied_brl NUMERIC,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.processes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own processes" ON public.processes FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own processes" ON public.processes FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own processes" ON public.processes FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Admins can view all processes" ON public.processes FOR SELECT USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can update all processes" ON public.processes FOR UPDATE USING (public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER update_processes_updated_at
  BEFORE UPDATE ON public.processes
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ==========================================
-- APPLICANTS TABLE
-- ==========================================
CREATE TABLE public.applicants (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  process_id UUID NOT NULL REFERENCES public.processes(id) ON DELETE CASCADE,
  is_primary BOOLEAN NOT NULL DEFAULT false,
  label TEXT NOT NULL DEFAULT 'Requerente',
  surname TEXT,
  given_name TEXT,
  other_names TEXT,
  gender TEXT,
  marital_status TEXT,
  birth_date DATE,
  birth_city TEXT,
  birth_state TEXT,
  birth_country TEXT,
  passport_type TEXT,
  passport_number TEXT,
  passport_country TEXT,
  passport_issue_date DATE,
  passport_expiry_date DATE,
  address_street TEXT,
  address_number TEXT,
  address_complement TEXT,
  address_neighborhood TEXT,
  address_city TEXT,
  address_state TEXT,
  address_zip TEXT,
  phone_residential TEXT,
  phone_mobile TEXT,
  email TEXT,
  travel_purpose TEXT,
  intended_arrival_date DATE,
  intended_stay_duration TEXT,
  us_address TEXT,
  trip_payer TEXT,
  employment_data JSONB,
  education_data JSONB,
  family_data JSONB,
  security_questions JSONB,
  previous_us_travel JSONB,
  social_media JSONB,
  photo_url TEXT,
  form_step INTEGER NOT NULL DEFAULT 0,
  form_completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.applicants ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view applicants of their processes" ON public.applicants FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.processes WHERE processes.id = applicants.process_id AND processes.user_id = auth.uid())
);
CREATE POLICY "Users can insert applicants to their processes" ON public.applicants FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM public.processes WHERE processes.id = applicants.process_id AND processes.user_id = auth.uid())
);
CREATE POLICY "Users can update applicants of their processes" ON public.applicants FOR UPDATE USING (
  EXISTS (SELECT 1 FROM public.processes WHERE processes.id = applicants.process_id AND processes.user_id = auth.uid())
);
CREATE POLICY "Admins can manage all applicants" ON public.applicants FOR ALL USING (public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER update_applicants_updated_at
  BEFORE UPDATE ON public.applicants
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ==========================================
-- DOCUMENTS TABLE
-- ==========================================
CREATE TABLE public.documents (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  process_id UUID NOT NULL REFERENCES public.processes(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  file_path TEXT NOT NULL,
  file_size BIGINT,
  mime_type TEXT,
  uploaded_by UUID NOT NULL REFERENCES auth.users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.documents ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view docs of their processes" ON public.documents FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.processes WHERE processes.id = documents.process_id AND processes.user_id = auth.uid())
);
CREATE POLICY "Users can upload docs to their processes" ON public.documents FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM public.processes WHERE processes.id = documents.process_id AND processes.user_id = auth.uid())
);
CREATE POLICY "Admins can manage all documents" ON public.documents FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- ==========================================
-- AVAILABLE_DATES TABLE
-- ==========================================
CREATE TABLE public.available_dates (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  location_type public.location_type NOT NULL,
  city TEXT NOT NULL,
  date DATE NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_by UUID NOT NULL REFERENCES auth.users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.available_dates ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view active dates" ON public.available_dates FOR SELECT USING (is_active = true);
CREATE POLICY "Admins can manage dates" ON public.available_dates FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- ==========================================
-- MESSAGES TABLE
-- ==========================================
CREATE TABLE public.messages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  process_id UUID NOT NULL REFERENCES public.processes(id) ON DELETE CASCADE,
  sender_id UUID NOT NULL REFERENCES auth.users(id),
  sender_type public.sender_type NOT NULL,
  content TEXT NOT NULL,
  is_read BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view messages of their processes" ON public.messages FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.processes WHERE processes.id = messages.process_id AND processes.user_id = auth.uid())
);
CREATE POLICY "Users can send messages to their processes" ON public.messages FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM public.processes WHERE processes.id = messages.process_id AND processes.user_id = auth.uid())
  AND sender_id = auth.uid()
);
CREATE POLICY "Admins can manage all messages" ON public.messages FOR ALL USING (public.has_role(auth.uid(), 'admin'));

ALTER PUBLICATION supabase_realtime ADD TABLE public.messages;

-- ==========================================
-- LEADS TABLE
-- ==========================================
CREATE TABLE public.leads (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  interested_package TEXT,
  source public.lead_source NOT NULL DEFAULT 'site',
  status public.lead_status NOT NULL DEFAULT 'new',
  notes TEXT,
  converted_process_id UUID REFERENCES public.processes(id),
  utm_source TEXT,
  utm_medium TEXT,
  utm_campaign TEXT,
  lead_score INTEGER NOT NULL DEFAULT 0,
  last_contacted_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage leads" ON public.leads FOR ALL USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Anyone can create leads" ON public.leads FOR INSERT WITH CHECK (true);

CREATE TRIGGER update_leads_updated_at
  BEFORE UPDATE ON public.leads
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ==========================================
-- EMAIL_TEMPLATES TABLE
-- ==========================================
CREATE TABLE public.email_templates (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  key TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  category public.email_template_category NOT NULL,
  subject TEXT NOT NULL,
  body_html TEXT NOT NULL,
  body_text TEXT,
  variables TEXT[],
  trigger_status TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  send_delay_hours INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.email_templates ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage email templates" ON public.email_templates FOR ALL USING (public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER update_email_templates_updated_at
  BEFORE UPDATE ON public.email_templates
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ==========================================
-- EMAIL_LOGS TABLE
-- ==========================================
CREATE TABLE public.email_logs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  to_email TEXT NOT NULL,
  to_name TEXT,
  subject TEXT NOT NULL,
  template_key TEXT,
  process_id UUID REFERENCES public.processes(id),
  lead_id UUID REFERENCES public.leads(id),
  resend_id TEXT,
  status public.email_log_status NOT NULL DEFAULT 'sent',
  error_message TEXT,
  sent_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.email_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can view email logs" ON public.email_logs FOR SELECT USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "System can insert email logs" ON public.email_logs FOR INSERT WITH CHECK (true);

-- ==========================================
-- WHATSAPP_TEMPLATES TABLE
-- ==========================================
CREATE TABLE public.whatsapp_templates (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  category public.template_category NOT NULL,
  content TEXT NOT NULL,
  trigger_status TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.whatsapp_templates ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage whatsapp templates" ON public.whatsapp_templates FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- ==========================================
-- WHATSAPP_INBOUND TABLE
-- ==========================================
CREATE TABLE public.whatsapp_inbound (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  from_phone TEXT NOT NULL,
  from_name TEXT,
  message TEXT NOT NULL,
  is_read BOOLEAN NOT NULL DEFAULT false,
  process_id UUID REFERENCES public.processes(id),
  z_api_data JSONB,
  received_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.whatsapp_inbound ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage whatsapp inbound" ON public.whatsapp_inbound FOR ALL USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "System can insert whatsapp inbound" ON public.whatsapp_inbound FOR INSERT WITH CHECK (true);

-- ==========================================
-- ADMIN_NOTES TABLE
-- ==========================================
CREATE TABLE public.admin_notes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  process_id UUID NOT NULL REFERENCES public.processes(id) ON DELETE CASCADE,
  admin_id UUID NOT NULL REFERENCES auth.users(id),
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.admin_notes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage notes" ON public.admin_notes FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- ==========================================
-- STORAGE: Documents bucket
-- ==========================================
INSERT INTO storage.buckets (id, name, public) VALUES ('documents', 'documents', false);

CREATE POLICY "Users can view their own docs" ON storage.objects FOR SELECT USING (
  bucket_id = 'documents' AND
  EXISTS (
    SELECT 1 FROM public.processes WHERE processes.user_id = auth.uid()
      AND processes.id::text = (storage.foldername(name))[1]
  )
);

CREATE POLICY "Users can upload their own docs" ON storage.objects FOR INSERT WITH CHECK (
  bucket_id = 'documents' AND
  EXISTS (
    SELECT 1 FROM public.processes WHERE processes.user_id = auth.uid()
      AND processes.id::text = (storage.foldername(name))[1]
  )
);

CREATE POLICY "Admins can manage all storage docs" ON storage.objects FOR ALL USING (
  bucket_id = 'documents' AND public.has_role(auth.uid(), 'admin')
);
