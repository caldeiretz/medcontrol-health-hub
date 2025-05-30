
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { clinicService, SharedPatient, PatientAlert } from '@/services/clinicService';
import { toast } from 'sonner';

export const useSharedPatients = () => {
  const { data: patients = [], isLoading, error } = useQuery({
    queryKey: ['shared-patients'],
    queryFn: clinicService.getSharedPatients,
    refetchInterval: 30000, // Refetch every 30 seconds
  });

  return {
    patients,
    isLoading,
    error
  };
};

export const usePatientDetails = (patientId: string) => {
  const { data, isLoading, error } = useQuery({
    queryKey: ['patient-details', patientId],
    queryFn: () => clinicService.getPatientById(patientId),
    enabled: !!patientId,
  });

  return {
    patient: data?.patient,
    medications: data?.medications || [],
    vitals: data?.vitals || [],
    isLoading,
    error
  };
};

export const useClinicAlerts = () => {
  const { data: alerts = [], isLoading, error } = useQuery({
    queryKey: ['clinic-alerts'],
    queryFn: clinicService.generateAlerts,
    refetchInterval: 60000, // Refetch every minute
  });

  return {
    alerts,
    isLoading,
    error
  };
};
