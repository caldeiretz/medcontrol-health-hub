
import { supabase } from '@/integrations/supabase/client';

export interface Medication {
  id: string;
  user_id: string;
  name: string;
  dosage: string;
  frequency: string;
  instructions: string | null;
  start_date: string;
  end_date: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface MedicationLog {
  id: string;
  user_id: string;
  medication_id: string;
  scheduled_time: string;
  taken_at: string | null;
  status: 'pending' | 'taken' | 'skipped' | 'missed';
  notes: string | null;
  created_at: string;
  medication?: Medication;
}

export const medicationService = {
  // Get all active medications for the current user
  async getMedications(): Promise<Medication[]> {
    const { data, error } = await supabase
      .from('medications')
      .select('*')
      .eq('is_active', true)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching medications:', error);
      throw error;
    }

    return data || [];
  },

  // Create a new medication
  async createMedication(medication: Omit<Medication, 'id' | 'user_id' | 'created_at' | 'updated_at'>): Promise<Medication> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const { data, error } = await supabase
      .from('medications')
      .insert([{
        ...medication,
        user_id: user.id
      }])
      .select()
      .single();

    if (error) {
      console.error('Error creating medication:', error);
      throw error;
    }

    // Create medication schedule
    try {
      await supabase.rpc('create_medication_schedule', {
        med_id: data.id,
        user_id: user.id,
        frequency_text: medication.frequency,
        start_date: medication.start_date
      });
    } catch (scheduleError) {
      console.error('Error creating medication schedule:', scheduleError);
    }

    return data;
  },

  // Update a medication
  async updateMedication(id: string, updates: Partial<Medication>): Promise<Medication> {
    const { data, error } = await supabase
      .from('medications')
      .update({
        ...updates,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating medication:', error);
      throw error;
    }

    return data;
  },

  // Delete a medication
  async deleteMedication(id: string): Promise<void> {
    const { error } = await supabase
      .from('medications')
      .update({ is_active: false })
      .eq('id', id);

    if (error) {
      console.error('Error deleting medication:', error);
      throw error;
    }
  },

  // Get medication logs for today
  async getTodayLogs(): Promise<MedicationLog[]> {
    const today = new Date();
    const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const endOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1);

    const { data, error } = await supabase
      .from('medication_logs')
      .select(`
        *,
        medication:medications(*)
      `)
      .gte('scheduled_time', startOfDay.toISOString())
      .lt('scheduled_time', endOfDay.toISOString())
      .order('scheduled_time', { ascending: true });

    if (error) {
      console.error('Error fetching today logs:', error);
      throw error;
    }

    // Type assertion to ensure proper typing
    return (data || []).map(log => ({
      ...log,
      status: log.status as MedicationLog['status']
    })) as MedicationLog[];
  },

  // Mark medication as taken
  async markMedicationTaken(logId: string): Promise<void> {
    const { error } = await supabase
      .from('medication_logs')
      .update({
        status: 'taken',
        taken_at: new Date().toISOString()
      })
      .eq('id', logId);

    if (error) {
      console.error('Error marking medication as taken:', error);
      throw error;
    }
  },

  // Mark medication as skipped
  async markMedicationSkipped(logId: string): Promise<void> {
    const { error } = await supabase
      .from('medication_logs')
      .update({
        status: 'skipped'
      })
      .eq('id', logId);

    if (error) {
      console.error('Error marking medication as skipped:', error);
      throw error;
    }
  }
};
