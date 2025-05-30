
import { supabase } from '@/integrations/supabase/client';
import { Profile } from './profileService';
import { Medication } from './medicationService';
import { Vital } from './vitalsService';

export interface SharedPatient extends Profile {
  shared_at: string;
  medications_count: number;
  vitals_count: number;
  last_activity: string;
}

export interface PatientAlert {
  id: string;
  patient_id: string;
  patient_name: string;
  type: 'missed_medication' | 'high_bp' | 'low_adherence';
  description: string;
  severity: 'low' | 'medium' | 'high';
  created_at: string;
  is_resolved: boolean;
}

export const clinicService = {
  // Get patients sharing data with current doctor
  async getSharedPatients(): Promise<SharedPatient[]> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    console.log('Fetching shared patients for doctor:', user.id);

    const { data, error } = await supabase
      .from('patient_doctor_sharing')
      .select(`
        *,
        patient:profiles!patient_id(*)
      `)
      .eq('doctor_id', user.id)
      .eq('is_active', true)
      .order('shared_at', { ascending: false });

    if (error) {
      console.error('Error fetching shared patients:', error);
      throw error;
    }

    console.log('Shared patients data:', data);

    // Get additional data for each patient
    const patientsWithStats = await Promise.all(
      (data || []).map(async (sharing) => {
        const patient = sharing.patient;
        if (!patient) return null;

        // Get medications count
        const { count: medicationsCount } = await supabase
          .from('medications')
          .select('*', { count: 'exact', head: true })
          .eq('user_id', patient.id)
          .eq('is_active', true);

        // Get vitals count
        const { count: vitalsCount } = await supabase
          .from('vitals')
          .select('*', { count: 'exact', head: true })
          .eq('user_id', patient.id);

        // Get last activity (most recent vital or medication log)
        const { data: lastVital } = await supabase
          .from('vitals')
          .select('recorded_at')
          .eq('user_id', patient.id)
          .order('recorded_at', { ascending: false })
          .limit(1);

        const { data: lastMedLog } = await supabase
          .from('medication_logs')
          .select('taken_at')
          .eq('user_id', patient.id)
          .not('taken_at', 'is', null)
          .order('taken_at', { ascending: false })
          .limit(1);

        let lastActivity = sharing.shared_at;
        if (lastVital?.[0]?.recorded_at) {
          lastActivity = lastVital[0].recorded_at;
        }
        if (lastMedLog?.[0]?.taken_at && lastMedLog[0].taken_at > lastActivity) {
          lastActivity = lastMedLog[0].taken_at;
        }

        return {
          ...patient,
          shared_at: sharing.shared_at,
          medications_count: medicationsCount || 0,
          vitals_count: vitalsCount || 0,
          last_activity: lastActivity
        } as SharedPatient;
      })
    );

    return patientsWithStats.filter(Boolean) as SharedPatient[];
  },

  // Get patient data by ID (for detailed view)
  async getPatientById(patientId: string): Promise<{
    patient: Profile;
    medications: Medication[];
    vitals: Vital[];
  }> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    console.log('Fetching patient data for:', patientId);

    // Verify sharing relationship
    const { data: sharing } = await supabase
      .from('patient_doctor_sharing')
      .select('*')
      .eq('doctor_id', user.id)
      .eq('patient_id', patientId)
      .eq('is_active', true)
      .single();

    if (!sharing) {
      throw new Error('No access to this patient data');
    }

    // Get patient profile
    const { data: patient, error: patientError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', patientId)
      .single();

    if (patientError) {
      console.error('Error fetching patient profile:', patientError);
      throw patientError;
    }

    // Get patient medications
    const { data: medications, error: medicationsError } = await supabase
      .from('medications')
      .select('*')
      .eq('user_id', patientId)
      .eq('is_active', true)
      .order('created_at', { ascending: false });

    if (medicationsError) {
      console.error('Error fetching patient medications:', medicationsError);
      throw medicationsError;
    }

    // Get patient vitals with type casting
    const { data: vitalsData, error: vitalsError } = await supabase
      .from('vitals')
      .select('*')
      .eq('user_id', patientId)
      .order('recorded_at', { ascending: false });

    if (vitalsError) {
      console.error('Error fetching patient vitals:', vitalsError);
      throw vitalsError;
    }

    // Cast vitals data to proper type
    const vitals: Vital[] = (vitalsData || []).map(vital => ({
      ...vital,
      type: vital.type as 'blood_pressure' | 'weight' | 'heart_rate' | 'glucose'
    }));

    return {
      patient,
      medications: medications || [],
      vitals
    };
  },

  // Generate alerts based on patient data
  async generateAlerts(): Promise<PatientAlert[]> {
    const patients = await this.getSharedPatients();
    const alerts: PatientAlert[] = [];

    for (const patient of patients) {
      // Check for missed medications (simplified)
      const { data: missedMeds } = await supabase
        .from('medication_logs')
        .select('*')
        .eq('user_id', patient.id)
        .eq('status', 'pending')
        .lt('scheduled_time', new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString()); // 2 hours ago

      if (missedMeds && missedMeds.length > 0) {
        alerts.push({
          id: `missed_${patient.id}`,
          patient_id: patient.id,
          patient_name: patient.name,
          type: 'missed_medication',
          description: `${missedMeds.length} medicação(ões) atrasada(s)`,
          severity: missedMeds.length > 2 ? 'high' : 'medium',
          created_at: new Date().toISOString(),
          is_resolved: false
        });
      }

      // Check for high blood pressure
      const { data: recentVitals } = await supabase
        .from('vitals')
        .select('*')
        .eq('user_id', patient.id)
        .eq('type', 'blood_pressure')
        .gte('recorded_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()) // last 24h
        .order('recorded_at', { ascending: false })
        .limit(1);

      if (recentVitals?.[0] && recentVitals[0].systolic && recentVitals[0].systolic > 140) {
        alerts.push({
          id: `bp_${patient.id}`,
          patient_id: patient.id,
          patient_name: patient.name,
          type: 'high_bp',
          description: `Pressão alta: ${recentVitals[0].systolic}/${recentVitals[0].diastolic} mmHg`,
          severity: recentVitals[0].systolic > 160 ? 'high' : 'medium',
          created_at: new Date().toISOString(),
          is_resolved: false
        });
      }
    }

    return alerts;
  }
};
