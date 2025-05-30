
import { supabase } from '@/integrations/supabase/client';
import { Profile } from './profileService';

export interface SharingRelationship {
  id: string;
  patient_id: string;
  doctor_id: string;
  shared_at: string;
  is_active: boolean;
  created_at: string;
  doctor?: Profile;
}

export const sharingService = {
  // Get all sharing relationships for current user
  async getSharingRelationships(): Promise<SharingRelationship[]> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const { data, error } = await supabase
      .from('patient_doctor_sharing')
      .select(`
        *,
        doctor:profiles!doctor_id(*)
      `)
      .eq('patient_id', user.id)
      .eq('is_active', true)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching sharing relationships:', error);
      throw error;
    }

    return data || [];
  },

  // Create new sharing relationship
  async createSharing(doctorId: string): Promise<SharingRelationship> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const { data, error } = await supabase
      .from('patient_doctor_sharing')
      .insert([{
        patient_id: user.id,
        doctor_id: doctorId
      }])
      .select(`
        *,
        doctor:profiles!doctor_id(*)
      `)
      .single();

    if (error) {
      console.error('Error creating sharing relationship:', error);
      throw error;
    }

    return data;
  },

  // Revoke sharing relationship
  async revokeSharing(sharingId: string): Promise<void> {
    const { error } = await supabase
      .from('patient_doctor_sharing')
      .update({ is_active: false })
      .eq('id', sharingId);

    if (error) {
      console.error('Error revoking sharing relationship:', error);
      throw error;
    }
  }
};
