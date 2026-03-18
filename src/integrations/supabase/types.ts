export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.4"
  }
  public: {
    Tables: {
      admin_notes: {
        Row: {
          admin_id: string
          content: string
          created_at: string
          id: string
          process_id: string
        }
        Insert: {
          admin_id: string
          content: string
          created_at?: string
          id?: string
          process_id: string
        }
        Update: {
          admin_id?: string
          content?: string
          created_at?: string
          id?: string
          process_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "admin_notes_process_id_fkey"
            columns: ["process_id"]
            isOneToOne: false
            referencedRelation: "processes"
            referencedColumns: ["id"]
          },
        ]
      }
      applicants: {
        Row: {
          address_city: string | null
          address_complement: string | null
          address_neighborhood: string | null
          address_number: string | null
          address_state: string | null
          address_street: string | null
          address_zip: string | null
          birth_city: string | null
          birth_country: string | null
          birth_date: string | null
          birth_state: string | null
          created_at: string
          education_data: Json | null
          email: string | null
          employment_data: Json | null
          family_data: Json | null
          form_completed_at: string | null
          form_step: number
          gender: string | null
          given_name: string | null
          id: string
          intended_arrival_date: string | null
          intended_stay_duration: string | null
          is_primary: boolean
          label: string
          marital_status: string | null
          other_names: string | null
          passport_country: string | null
          passport_expiry_date: string | null
          passport_issue_date: string | null
          passport_number: string | null
          passport_type: string | null
          phone_mobile: string | null
          phone_residential: string | null
          photo_url: string | null
          previous_us_travel: Json | null
          process_id: string
          security_questions: Json | null
          social_media: Json | null
          surname: string | null
          travel_purpose: string | null
          trip_payer: string | null
          updated_at: string
          us_address: string | null
        }
        Insert: {
          address_city?: string | null
          address_complement?: string | null
          address_neighborhood?: string | null
          address_number?: string | null
          address_state?: string | null
          address_street?: string | null
          address_zip?: string | null
          birth_city?: string | null
          birth_country?: string | null
          birth_date?: string | null
          birth_state?: string | null
          created_at?: string
          education_data?: Json | null
          email?: string | null
          employment_data?: Json | null
          family_data?: Json | null
          form_completed_at?: string | null
          form_step?: number
          gender?: string | null
          given_name?: string | null
          id?: string
          intended_arrival_date?: string | null
          intended_stay_duration?: string | null
          is_primary?: boolean
          label?: string
          marital_status?: string | null
          other_names?: string | null
          passport_country?: string | null
          passport_expiry_date?: string | null
          passport_issue_date?: string | null
          passport_number?: string | null
          passport_type?: string | null
          phone_mobile?: string | null
          phone_residential?: string | null
          photo_url?: string | null
          previous_us_travel?: Json | null
          process_id: string
          security_questions?: Json | null
          social_media?: Json | null
          surname?: string | null
          travel_purpose?: string | null
          trip_payer?: string | null
          updated_at?: string
          us_address?: string | null
        }
        Update: {
          address_city?: string | null
          address_complement?: string | null
          address_neighborhood?: string | null
          address_number?: string | null
          address_state?: string | null
          address_street?: string | null
          address_zip?: string | null
          birth_city?: string | null
          birth_country?: string | null
          birth_date?: string | null
          birth_state?: string | null
          created_at?: string
          education_data?: Json | null
          email?: string | null
          employment_data?: Json | null
          family_data?: Json | null
          form_completed_at?: string | null
          form_step?: number
          gender?: string | null
          given_name?: string | null
          id?: string
          intended_arrival_date?: string | null
          intended_stay_duration?: string | null
          is_primary?: boolean
          label?: string
          marital_status?: string | null
          other_names?: string | null
          passport_country?: string | null
          passport_expiry_date?: string | null
          passport_issue_date?: string | null
          passport_number?: string | null
          passport_type?: string | null
          phone_mobile?: string | null
          phone_residential?: string | null
          photo_url?: string | null
          previous_us_travel?: Json | null
          process_id?: string
          security_questions?: Json | null
          social_media?: Json | null
          surname?: string | null
          travel_purpose?: string | null
          trip_payer?: string | null
          updated_at?: string
          us_address?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "applicants_process_id_fkey"
            columns: ["process_id"]
            isOneToOne: false
            referencedRelation: "processes"
            referencedColumns: ["id"]
          },
        ]
      }
      available_dates: {
        Row: {
          city: string
          created_at: string
          created_by: string
          date: string
          id: string
          is_active: boolean
          location_type: Database["public"]["Enums"]["location_type"]
        }
        Insert: {
          city: string
          created_at?: string
          created_by: string
          date: string
          id?: string
          is_active?: boolean
          location_type: Database["public"]["Enums"]["location_type"]
        }
        Update: {
          city?: string
          created_at?: string
          created_by?: string
          date?: string
          id?: string
          is_active?: boolean
          location_type?: Database["public"]["Enums"]["location_type"]
        }
        Relationships: []
      }
      coupons: {
        Row: {
          code: string
          created_at: string
          discount_type: Database["public"]["Enums"]["discount_type"]
          discount_value: number
          expires_at: string | null
          id: string
          influencer_email: string | null
          influencer_name: string | null
          is_active: boolean
          max_uses: number | null
          total_revenue_generated: number
          uses_count: number
        }
        Insert: {
          code: string
          created_at?: string
          discount_type: Database["public"]["Enums"]["discount_type"]
          discount_value: number
          expires_at?: string | null
          id?: string
          influencer_email?: string | null
          influencer_name?: string | null
          is_active?: boolean
          max_uses?: number | null
          total_revenue_generated?: number
          uses_count?: number
        }
        Update: {
          code?: string
          created_at?: string
          discount_type?: Database["public"]["Enums"]["discount_type"]
          discount_value?: number
          expires_at?: string | null
          id?: string
          influencer_email?: string | null
          influencer_name?: string | null
          is_active?: boolean
          max_uses?: number | null
          total_revenue_generated?: number
          uses_count?: number
        }
        Relationships: []
      }
      documents: {
        Row: {
          created_at: string
          file_path: string
          file_size: number | null
          id: string
          mime_type: string | null
          name: string
          process_id: string
          uploaded_by: string
        }
        Insert: {
          created_at?: string
          file_path: string
          file_size?: number | null
          id?: string
          mime_type?: string | null
          name: string
          process_id: string
          uploaded_by: string
        }
        Update: {
          created_at?: string
          file_path?: string
          file_size?: number | null
          id?: string
          mime_type?: string | null
          name?: string
          process_id?: string
          uploaded_by?: string
        }
        Relationships: [
          {
            foreignKeyName: "documents_process_id_fkey"
            columns: ["process_id"]
            isOneToOne: false
            referencedRelation: "processes"
            referencedColumns: ["id"]
          },
        ]
      }
      email_logs: {
        Row: {
          error_message: string | null
          id: string
          lead_id: string | null
          process_id: string | null
          resend_id: string | null
          sent_at: string
          status: Database["public"]["Enums"]["email_log_status"]
          subject: string
          template_key: string | null
          to_email: string
          to_name: string | null
        }
        Insert: {
          error_message?: string | null
          id?: string
          lead_id?: string | null
          process_id?: string | null
          resend_id?: string | null
          sent_at?: string
          status?: Database["public"]["Enums"]["email_log_status"]
          subject: string
          template_key?: string | null
          to_email: string
          to_name?: string | null
        }
        Update: {
          error_message?: string | null
          id?: string
          lead_id?: string | null
          process_id?: string | null
          resend_id?: string | null
          sent_at?: string
          status?: Database["public"]["Enums"]["email_log_status"]
          subject?: string
          template_key?: string | null
          to_email?: string
          to_name?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "email_logs_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "leads"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "email_logs_process_id_fkey"
            columns: ["process_id"]
            isOneToOne: false
            referencedRelation: "processes"
            referencedColumns: ["id"]
          },
        ]
      }
      email_templates: {
        Row: {
          body_html: string
          body_text: string | null
          category: Database["public"]["Enums"]["email_template_category"]
          created_at: string
          id: string
          is_active: boolean
          key: string
          name: string
          send_delay_hours: number
          subject: string
          trigger_status: string | null
          updated_at: string
          variables: string[] | null
        }
        Insert: {
          body_html: string
          body_text?: string | null
          category: Database["public"]["Enums"]["email_template_category"]
          created_at?: string
          id?: string
          is_active?: boolean
          key: string
          name: string
          send_delay_hours?: number
          subject: string
          trigger_status?: string | null
          updated_at?: string
          variables?: string[] | null
        }
        Update: {
          body_html?: string
          body_text?: string | null
          category?: Database["public"]["Enums"]["email_template_category"]
          created_at?: string
          id?: string
          is_active?: boolean
          key?: string
          name?: string
          send_delay_hours?: number
          subject?: string
          trigger_status?: string | null
          updated_at?: string
          variables?: string[] | null
        }
        Relationships: []
      }
      leads: {
        Row: {
          converted_process_id: string | null
          created_at: string
          email: string
          id: string
          interested_package: string | null
          last_contacted_at: string | null
          lead_score: number
          name: string
          notes: string | null
          phone: string | null
          source: Database["public"]["Enums"]["lead_source"]
          status: Database["public"]["Enums"]["lead_status"]
          updated_at: string
          utm_campaign: string | null
          utm_medium: string | null
          utm_source: string | null
        }
        Insert: {
          converted_process_id?: string | null
          created_at?: string
          email: string
          id?: string
          interested_package?: string | null
          last_contacted_at?: string | null
          lead_score?: number
          name: string
          notes?: string | null
          phone?: string | null
          source?: Database["public"]["Enums"]["lead_source"]
          status?: Database["public"]["Enums"]["lead_status"]
          updated_at?: string
          utm_campaign?: string | null
          utm_medium?: string | null
          utm_source?: string | null
        }
        Update: {
          converted_process_id?: string | null
          created_at?: string
          email?: string
          id?: string
          interested_package?: string | null
          last_contacted_at?: string | null
          lead_score?: number
          name?: string
          notes?: string | null
          phone?: string | null
          source?: Database["public"]["Enums"]["lead_source"]
          status?: Database["public"]["Enums"]["lead_status"]
          updated_at?: string
          utm_campaign?: string | null
          utm_medium?: string | null
          utm_source?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "leads_converted_process_id_fkey"
            columns: ["converted_process_id"]
            isOneToOne: false
            referencedRelation: "processes"
            referencedColumns: ["id"]
          },
        ]
      }
      messages: {
        Row: {
          content: string
          created_at: string
          id: string
          is_read: boolean
          process_id: string
          sender_id: string
          sender_type: Database["public"]["Enums"]["sender_type"]
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          is_read?: boolean
          process_id: string
          sender_id: string
          sender_type: Database["public"]["Enums"]["sender_type"]
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          is_read?: boolean
          process_id?: string
          sender_id?: string
          sender_type?: Database["public"]["Enums"]["sender_type"]
        }
        Relationships: [
          {
            foreignKeyName: "messages_process_id_fkey"
            columns: ["process_id"]
            isOneToOne: false
            referencedRelation: "processes"
            referencedColumns: ["id"]
          },
        ]
      }
      processes: {
        Row: {
          appointment_disclaimer_accepted_at: string | null
          casv_city: string | null
          casv_intended_date: string | null
          consular_amount_brl: number | null
          consular_paid_at: string | null
          consular_payment_id: string | null
          consular_usd_rate: number | null
          consulate_city: string | null
          consulate_intended_date: string | null
          consulting_amount_brl: number | null
          consulting_paid_at: string | null
          consulting_payment_id: string | null
          coupon_id: string | null
          created_at: string
          discount_applied_brl: number | null
          id: string
          max_applicants: number
          package: string
          status: Database["public"]["Enums"]["process_status"]
          updated_at: string
          user_id: string
        }
        Insert: {
          appointment_disclaimer_accepted_at?: string | null
          casv_city?: string | null
          casv_intended_date?: string | null
          consular_amount_brl?: number | null
          consular_paid_at?: string | null
          consular_payment_id?: string | null
          consular_usd_rate?: number | null
          consulate_city?: string | null
          consulate_intended_date?: string | null
          consulting_amount_brl?: number | null
          consulting_paid_at?: string | null
          consulting_payment_id?: string | null
          coupon_id?: string | null
          created_at?: string
          discount_applied_brl?: number | null
          id?: string
          max_applicants?: number
          package: string
          status?: Database["public"]["Enums"]["process_status"]
          updated_at?: string
          user_id: string
        }
        Update: {
          appointment_disclaimer_accepted_at?: string | null
          casv_city?: string | null
          casv_intended_date?: string | null
          consular_amount_brl?: number | null
          consular_paid_at?: string | null
          consular_payment_id?: string | null
          consular_usd_rate?: number | null
          consulate_city?: string | null
          consulate_intended_date?: string | null
          consulting_amount_brl?: number | null
          consulting_paid_at?: string | null
          consulting_payment_id?: string | null
          coupon_id?: string | null
          created_at?: string
          discount_applied_brl?: number | null
          id?: string
          max_applicants?: number
          package?: string
          status?: Database["public"]["Enums"]["process_status"]
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "processes_coupon_id_fkey"
            columns: ["coupon_id"]
            isOneToOne: false
            referencedRelation: "coupons"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          email: string | null
          full_name: string | null
          id: string
          phone: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          email?: string | null
          full_name?: string | null
          id?: string
          phone?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          email?: string | null
          full_name?: string | null
          id?: string
          phone?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      whatsapp_inbound: {
        Row: {
          from_name: string | null
          from_phone: string
          id: string
          is_read: boolean
          message: string
          process_id: string | null
          received_at: string
          z_api_data: Json | null
        }
        Insert: {
          from_name?: string | null
          from_phone: string
          id?: string
          is_read?: boolean
          message: string
          process_id?: string | null
          received_at?: string
          z_api_data?: Json | null
        }
        Update: {
          from_name?: string | null
          from_phone?: string
          id?: string
          is_read?: boolean
          message?: string
          process_id?: string | null
          received_at?: string
          z_api_data?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "whatsapp_inbound_process_id_fkey"
            columns: ["process_id"]
            isOneToOne: false
            referencedRelation: "processes"
            referencedColumns: ["id"]
          },
        ]
      }
      whatsapp_templates: {
        Row: {
          category: Database["public"]["Enums"]["template_category"]
          content: string
          created_at: string
          id: string
          is_active: boolean
          name: string
          trigger_status: string | null
        }
        Insert: {
          category: Database["public"]["Enums"]["template_category"]
          content: string
          created_at?: string
          id?: string
          is_active?: boolean
          name: string
          trigger_status?: string | null
        }
        Update: {
          category?: Database["public"]["Enums"]["template_category"]
          content?: string
          created_at?: string
          id?: string
          is_active?: boolean
          name?: string
          trigger_status?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "client"
      discount_type: "percentage" | "fixed"
      email_log_status: "sent" | "delivered" | "failed" | "bounced"
      email_template_category:
        | "transactional"
        | "status_update"
        | "lead_nurturing"
        | "admin_notification"
        | "lead_magnet"
      lead_source:
        | "site"
        | "instagram"
        | "whatsapp"
        | "referral"
        | "google"
        | "other"
      lead_status:
        | "new"
        | "contacted"
        | "nurturing"
        | "hot"
        | "converted"
        | "lost"
      location_type: "casv" | "consulate"
      process_status:
        | "pending_form"
        | "form_completed"
        | "consular_fee_paid"
        | "appointment_requested"
        | "docs_in_preparation"
        | "docs_ready"
        | "completed"
      sender_type: "client" | "admin"
      template_category:
        | "status_update"
        | "appointment"
        | "sales"
        | "general"
        | "existing_client"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "client"],
      discount_type: ["percentage", "fixed"],
      email_log_status: ["sent", "delivered", "failed", "bounced"],
      email_template_category: [
        "transactional",
        "status_update",
        "lead_nurturing",
        "admin_notification",
        "lead_magnet",
      ],
      lead_source: [
        "site",
        "instagram",
        "whatsapp",
        "referral",
        "google",
        "other",
      ],
      lead_status: [
        "new",
        "contacted",
        "nurturing",
        "hot",
        "converted",
        "lost",
      ],
      location_type: ["casv", "consulate"],
      process_status: [
        "pending_form",
        "form_completed",
        "consular_fee_paid",
        "appointment_requested",
        "docs_in_preparation",
        "docs_ready",
        "completed",
      ],
      sender_type: ["client", "admin"],
      template_category: [
        "status_update",
        "appointment",
        "sales",
        "general",
        "existing_client",
      ],
    },
  },
} as const
