import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { medicationService, Medication, MedicationLog } from '@/services/medicationService';
import { toast } from 'sonner';

export const useMedications = () => {
  const queryClient = useQueryClient();

  const { data: medications = [], isLoading, error } = useQuery({
    queryKey: ['medications'],
    queryFn: medicationService.getMedications,
  });

  const createMutation = useMutation({
    mutationFn: ({ medication, customTimes }: { medication: Omit<Medication, 'id' | 'user_id' | 'created_at' | 'updated_at'>; customTimes?: string[] }) =>
      medicationService.createMedication(medication, customTimes),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['medications'] });
      queryClient.invalidateQueries({ queryKey: ['medication-logs'] });
      toast.success('Medicação criada com sucesso!');
    },
    onError: (error) => {
      console.error('Error creating medication:', error);
      toast.error('Erro ao criar medicação');
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, updates, customTimes }: { id: string; updates: Partial<Medication>; customTimes?: string[] }) =>
      medicationService.updateMedication(id, updates, customTimes),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['medications'] });
      queryClient.invalidateQueries({ queryKey: ['medication-logs'] });
      toast.success('Medicação atualizada com sucesso!');
    },
    onError: (error) => {
      console.error('Error updating medication:', error);
      toast.error('Erro ao atualizar medicação');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: medicationService.deleteMedication,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['medications'] });
      queryClient.invalidateQueries({ queryKey: ['medication-logs'] });
      toast.success('Medicação excluída com sucesso!');
    },
    onError: (error) => {
      console.error('Error deleting medication:', error);
      toast.error('Erro ao excluir medicação');
    },
  });

  const getMedicationTimesQuery = (medicationId: string) => {
    return useQuery({
      queryKey: ['medication-times', medicationId],
      queryFn: () => medicationService.getMedicationTimes(medicationId),
      enabled: !!medicationId
    });
  };

  return {
    medications,
    isLoading,
    error,
    createMedication: createMutation.mutate,
    updateMedication: updateMutation.mutate,
    deleteMedication: deleteMutation.mutate,
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
    getMedicationTimes: getMedicationTimesQuery
  };
};

export const useTodayMedicationLogs = () => {
  const queryClient = useQueryClient();

  const { data: logs = [], isLoading, error } = useQuery({
    queryKey: ['medication-logs', 'today'],
    queryFn: medicationService.getTodayLogs,
    refetchInterval: 60000, // Refetch every minute
  });

  const markTakenMutation = useMutation({
    mutationFn: medicationService.markMedicationTaken,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['medication-logs'] });
      toast.success('Medicação registrada como tomada!');
    },
    onError: (error) => {
      console.error('Error marking medication as taken:', error);
      toast.error('Erro ao registrar medicação');
    },
  });

  const markSkippedMutation = useMutation({
    mutationFn: medicationService.markMedicationSkipped,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['medication-logs'] });
      toast.info('Medicação marcada como ignorada');
    },
    onError: (error) => {
      console.error('Error marking medication as skipped:', error);
      toast.error('Erro ao marcar medicação como ignorada');
    },
  });

  return {
    logs,
    isLoading,
    error,
    markTaken: markTakenMutation.mutate,
    markSkipped: markSkippedMutation.mutate,
    isMarking: markTakenMutation.isPending || markSkippedMutation.isPending,
  };
};
