export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      medication_logs: {
        Row: {
          created_at: string
          id: string
          medication_id: string
          notes: string | null
          scheduled_time: string
          status: string
          taken_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          medication_id: string
          notes?: string | null
          scheduled_time: string
          status?: string
          taken_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          medication_id?: string
          notes?: string | null
          scheduled_time?: string
          status?: string
          taken_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "medication_logs_medication_id_fkey"
            columns: ["medication_id"]
            isOneToOne: false
            referencedRelation: "medications"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "medication_logs_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      medication_times: {
        Row: {
          created_at: string | null
          id: string
          medication_id: string | null
          time_of_day: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          medication_id?: string | null
          time_of_day: string
        }
        Update: {
          created_at?: string | null
          id?: string
          medication_id?: string | null
          time_of_day?: string
        }
        Relationships: [
          {
            foreignKeyName: "medication_times_medication_id_fkey"
            columns: ["medication_id"]
            isOneToOne: false
            referencedRelation: "medications"
            referencedColumns: ["id"]
          },
        ]
      }
      medications: {
        Row: {
          created_at: string
          dosage: string
          end_date: string | null
          frequency: string
          id: string
          instructions: string | null
          is_active: boolean
          name: string
          start_date: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          dosage: string
          end_date?: string | null
          frequency: string
          id?: string
          instructions?: string | null
          is_active?: boolean
          name: string
          start_date?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          dosage?: string
          end_date?: string | null
          frequency?: string
          id?: string
          instructions?: string | null
          is_active?: boolean
          name?: string
          start_date?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "medications_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      patient_doctor_sharing: {
        Row: {
          created_at: string | null
          doctor_id: string | null
          id: string
          is_active: boolean | null
          patient_id: string | null
          shared_at: string | null
        }
        Insert: {
          created_at?: string | null
          doctor_id?: string | null
          id?: string
          is_active?: boolean | null
          patient_id?: string | null
          shared_at?: string | null
        }
        Update: {
          created_at?: string | null
          doctor_id?: string | null
          id?: string
          is_active?: boolean | null
          patient_id?: string | null
          shared_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "patient_doctor_sharing_doctor_id_fkey"
            columns: ["doctor_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "patient_doctor_sharing_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          address: string | null
          age: number | null
          birth_date: string | null
          clinic_name: string | null
          condition: string | null
          created_at: string
          crm: string | null
          data_sharing_enabled: boolean | null
          doctor_code: string | null
          email: string
          email_notifications: boolean | null
          emergency_contact: string | null
          emergency_phone: string | null
          id: string
          name: string
          notifications_enabled: boolean | null
          phone: string | null
          profile_visibility: string | null
          role: Database["public"]["Enums"]["user_role"]
          sms_notifications: boolean | null
          specialty: string | null
          updated_at: string
        }
        Insert: {
          address?: string | null
          age?: number | null
          birth_date?: string | null
          clinic_name?: string | null
          condition?: string | null
          created_at?: string
          crm?: string | null
          data_sharing_enabled?: boolean | null
          doctor_code?: string | null
          email: string
          email_notifications?: boolean | null
          emergency_contact?: string | null
          emergency_phone?: string | null
          id: string
          name: string
          notifications_enabled?: boolean | null
          phone?: string | null
          profile_visibility?: string | null
          role: Database["public"]["Enums"]["user_role"]
          sms_notifications?: boolean | null
          specialty?: string | null
          updated_at?: string
        }
        Update: {
          address?: string | null
          age?: number | null
          birth_date?: string | null
          clinic_name?: string | null
          condition?: string | null
          created_at?: string
          crm?: string | null
          data_sharing_enabled?: boolean | null
          doctor_code?: string | null
          email?: string
          email_notifications?: boolean | null
          emergency_contact?: string | null
          emergency_phone?: string | null
          id?: string
          name?: string
          notifications_enabled?: boolean | null
          phone?: string | null
          profile_visibility?: string | null
          role?: Database["public"]["Enums"]["user_role"]
          sms_notifications?: boolean | null
          specialty?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      vitals: {
        Row: {
          created_at: string
          diastolic: number | null
          id: string
          notes: string | null
          recorded_at: string
          systolic: number | null
          type: string
          unit: string | null
          user_id: string
          value: number | null
        }
        Insert: {
          created_at?: string
          diastolic?: number | null
          id?: string
          notes?: string | null
          recorded_at?: string
          systolic?: number | null
          type: string
          unit?: string | null
          user_id: string
          value?: number | null
        }
        Update: {
          created_at?: string
          diastolic?: number | null
          id?: string
          notes?: string | null
          recorded_at?: string
          systolic?: number | null
          type?: string
          unit?: string | null
          user_id?: string
          value?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "vitals_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      create_medication_schedule: {
        Args: {
          med_id: string
          user_id: string
          frequency_text: string
          start_date?: string
        }
        Returns: undefined
      }
      create_medication_schedule_with_times: {
        Args: {
          med_id: string
          user_id: string
          frequency_text: string
          custom_times?: string[]
          start_date?: string
        }
        Returns: undefined
      }
      generate_doctor_code: {
        Args: { crm_number: string; clinic_name: string }
        Returns: string
      }
    }
    Enums: {
      user_role: "patient" | "clinic"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      user_role: ["patient", "clinic"],
    },
  },
} as const
