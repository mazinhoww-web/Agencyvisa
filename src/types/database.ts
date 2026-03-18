export type ProcessStatus =
  | 'pending_form'
  | 'form_completed'
  | 'consular_fee_paid'
  | 'appointment_requested'
  | 'docs_in_preparation'
  | 'docs_ready'
  | 'completed'

export type LocationType = 'casv' | 'consulate'
export type DiscountType = 'percentage' | 'fixed'
export type SenderType = 'client' | 'admin'
export type TemplateCategory = 'status_update' | 'appointment' | 'sales' | 'general' | 'existing_client'
export type LeadStatus = 'new' | 'contacted' | 'nurturing' | 'hot' | 'converted' | 'lost'
export type LeadSource = 'site' | 'instagram' | 'whatsapp' | 'referral' | 'google' | 'other'
export type EmailTemplateCategory = 'transactional' | 'status_update' | 'lead_nurturing' | 'admin_notification' | 'lead_magnet'
export type EmailLogStatus = 'sent' | 'delivered' | 'failed' | 'bounced'
export type EmailQueueStatus = 'pending' | 'sent' | 'cancelled'

export type Process = {
  id: string
  user_id: string
  package: string
  max_applicants: number
  status: ProcessStatus
  consulting_payment_id: string | null
  consulting_amount_brl: number | null
  consulting_paid_at: string | null
  consular_payment_id: string | null
  consular_amount_brl: number | null
  consular_usd_rate: number | null
  consular_paid_at: string | null
  casv_city: string | null
  casv_intended_date: string | null
  consulate_city: string | null
  consulate_intended_date: string | null
  appointment_disclaimer_accepted_at: string | null
  coupon_id: string | null
  discount_applied_brl: number | null
  created_at: string
  updated_at: string
}

export type Applicant = {
  id: string
  process_id: string
  is_primary: boolean
  label: string
  surname: string | null
  given_name: string | null
  other_names: string | null
  gender: string | null
  marital_status: string | null
  birth_date: string | null
  birth_city: string | null
  birth_state: string | null
  birth_country: string | null
  passport_type: string | null
  passport_number: string | null
  passport_country: string | null
  passport_issue_date: string | null
  passport_expiry_date: string | null
  address_street: string | null
  address_number: string | null
  address_complement: string | null
  address_neighborhood: string | null
  address_city: string | null
  address_state: string | null
  address_zip: string | null
  phone_residential: string | null
  phone_mobile: string | null
  email: string | null
  travel_purpose: string | null
  intended_arrival_date: string | null
  intended_stay_duration: string | null
  us_address: string | null
  trip_payer: string | null
  employment_data: Record<string, unknown> | null
  education_data: Record<string, unknown> | null
  family_data: Record<string, unknown> | null
  security_questions: Record<string, unknown> | null
  previous_us_travel: Record<string, unknown> | null
  social_media: Record<string, unknown> | null
  photo_url: string | null
  form_step: number
  form_completed_at: string | null
  created_at: string
  updated_at: string
}

export type Document = {
  id: string
  process_id: string
  name: string
  file_path: string
  file_size: number | null
  mime_type: string | null
  uploaded_by: string
  created_at: string
}

export type AvailableDate = {
  id: string
  location_type: LocationType
  city: string
  date: string
  is_active: boolean
  created_by: string
  created_at: string
}

export type Coupon = {
  id: string
  code: string
  discount_type: DiscountType
  discount_value: number
  influencer_name: string | null
  influencer_email: string | null
  max_uses: number | null
  uses_count: number
  total_revenue_generated: number
  is_active: boolean
  expires_at: string | null
  created_at: string
}

export type Message = {
  id: string
  process_id: string
  sender_id: string
  sender_type: SenderType
  content: string
  is_read: boolean
  created_at: string
}

export type WhatsAppTemplate = {
  id: string
  name: string
  category: TemplateCategory
  content: string
  trigger_status: string | null
  is_active: boolean
  created_at: string
}

export type WhatsAppInbound = {
  id: string
  from_phone: string
  from_name: string | null
  message: string
  is_read: boolean
  process_id: string | null
  z_api_data: Record<string, unknown> | null
  received_at: string
}

export type Lead = {
  id: string
  name: string
  email: string
  phone: string | null
  interested_package: string | null
  source: LeadSource
  status: LeadStatus
  notes: string | null
  converted_process_id: string | null
  utm_source: string | null
  utm_medium: string | null
  utm_campaign: string | null
  lead_score: number
  last_contacted_at: string | null
  created_at: string
  updated_at: string
}

export type EmailTemplate = {
  id: string
  key: string
  name: string
  category: EmailTemplateCategory
  subject: string
  body_html: string
  body_text: string | null
  variables: string[] | null
  trigger_status: string | null
  is_active: boolean
  send_delay_hours: number
  created_at: string
  updated_at: string
}

export type EmailLog = {
  id: string
  to_email: string
  to_name: string | null
  subject: string
  template_key: string | null
  process_id: string | null
  lead_id: string | null
  resend_id: string | null
  status: EmailLogStatus
  error_message: string | null
  sent_at: string
}

export type AdminNote = {
  id: string
  process_id: string
  admin_id: string
  content: string
  created_at: string
}
