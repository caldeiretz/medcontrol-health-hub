
import { supabase } from '@/integrations/supabase/client';

export interface Vital {
  id: string;
  user_id: string;
  type: 'blood_pressure' | 'weight' | 'heart_rate' | 'glucose';
  systolic?: number;
  diastolic?: number;
  value?: number;
  unit?: string;
  notes?: string;
  recorded_at: string;
  created_at: string;
}

export const vitalsService = {
  // Get all vitals for the current user
  async getVitals(limit?: number): Promise<Vital[]> {
    let query = supabase
      .from('vitals')
      .select('*')
      .order('recorded_at', { ascending: false });

    if (limit) {
      query = query.limit(limit);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching vitals:', error);
      throw error;
    }

    // Type assertion to ensure proper typing
    return (data || []).map(vital => ({
      ...vital,
      type: vital.type as Vital['type']
    })) as Vital[];
  },

  // Create a new vital
  async createVital(vital: Omit<Vital, 'id' | 'user_id' | 'created_at'>): Promise<Vital> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const { data, error } = await supabase
      .from('vitals')
      .insert([{
        ...vital,
        user_id: user.id
      }])
      .select()
      .single();

    if (error) {
      console.error('Error creating vital:', error);
      throw error;
    }

    // Type assertion to ensure proper typing
    return {
      ...data,
      type: data.type as Vital['type']
    } as Vital;
  },

  // Update a vital
  async updateVital(id: string, updates: Partial<Vital>): Promise<Vital> {
    const { data, error } = await supabase
      .from('vitals')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating vital:', error);
      throw error;
    }

    // Type assertion to ensure proper typing
    return {
      ...data,
      type: data.type as Vital['type']
    } as Vital;
  },

  // Delete a vital
  async deleteVital(id: string): Promise<void> {
    const { error } = await supabase
      .from('vitals')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting vital:', error);
      throw error;
    }
  }
};
