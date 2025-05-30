
import { supabase } from '@/integrations/supabase/client';

export interface Profile {
  id: string;
  name: string;
  email: string;
  phone?: string;
  birth_date?: string;
  address?: string;
  emergency_contact?: string;
  emergency_phone?: string;
  notifications_enabled?: boolean;
  email_notifications?: boolean;
  sms_notifications?: boolean;
  data_sharing_enabled?: boolean;
  profile_visibility?: string;
  role: 'patient' | 'clinic';
  clinic_name?: string;
  crm?: string;
  specialty?: string;
  doctor_code?: string;
  age?: number;
  condition?: string;
  created_at: string;
  updated_at: string;
}

export const profileService = {
  // Get current user profile
  async getCurrentProfile(): Promise<Profile | null> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    if (error) {
      console.error('Error fetching profile:', error);
      throw error;
    }

    return data;
  },

  // Update user profile
  async updateProfile(updates: Partial<Profile>): Promise<Profile> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const { data, error } = await supabase
      .from('profiles')
      .update({
        ...updates,
        updated_at: new Date().toISOString()
      })
      .eq('id', user.id)
      .select()
      .single();

    if (error) {
      console.error('Error updating profile:', error);
      throw error;
    }

    return data;
  },

  // Search doctors by name or code
  async searchDoctors(query: string): Promise<Profile[]> {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('role', 'clinic')
      .or(`name.ilike.%${query}%,doctor_code.ilike.%${query}%`)
      .limit(10);

    if (error) {
      console.error('Error searching doctors:', error);
      throw error;
    }

    return data || [];
  }
};
