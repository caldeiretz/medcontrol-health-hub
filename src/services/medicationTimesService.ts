
import { supabase } from '@/integrations/supabase/client';

export interface MedicationTime {
  id: string;
  medication_id: string;
  time_of_day: string;
  created_at: string;
}

export const medicationTimesService = {
  // Get medication times
  async getMedicationTimes(medicationId: string): Promise<MedicationTime[]> {
    const { data, error } = await supabase
      .from('medication_times')
      .select('*')
      .eq('medication_id', medicationId)
      .order('time_of_day');

    if (error) {
      console.error('Error fetching medication times:', error);
      throw error;
    }

    return data || [];
  },

  // Set custom medication times
  async setMedicationTimes(medicationId: string, times: string[]): Promise<void> {
    // First delete existing times
    await supabase
      .from('medication_times')
      .delete()
      .eq('medication_id', medicationId);

    // Insert new times
    if (times.length > 0) {
      const { error } = await supabase
        .from('medication_times')
        .insert(
          times.map(time => ({
            medication_id: medicationId,
            time_of_day: time
          }))
        );

      if (error) {
        console.error('Error setting medication times:', error);
        throw error;
      }
    }
  },

  // Create medication schedule with custom times
  async createScheduleWithTimes(medicationId: string, frequencyText: string, customTimes?: string[]): Promise<void> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const { error } = await supabase.rpc('create_medication_schedule_with_times', {
      med_id: medicationId,
      user_id: user.id,
      frequency_text: frequencyText,
      custom_times: customTimes || null
    });

    if (error) {
      console.error('Error creating medication schedule:', error);
      throw error;
    }
  }
};
