
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { vitalsService, Vital } from '@/services/vitalsService';
import { toast } from 'sonner';

export const useVitals = (limit?: number) => {
  const queryClient = useQueryClient();

  const { data: vitals = [], isLoading, error } = useQuery({
    queryKey: ['vitals', limit],
    queryFn: () => vitalsService.getVitals(limit),
  });

  const createMutation = useMutation({
    mutationFn: vitalsService.createVital,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vitals'] });
      toast.success('Sinal vital registrado com sucesso!');
    },
    onError: (error) => {
      console.error('Error creating vital:', error);
      toast.error('Erro ao registrar sinal vital');
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: Partial<Vital> }) =>
      vitalsService.updateVital(id, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vitals'] });
      toast.success('Sinal vital atualizado com sucesso!');
    },
    onError: (error) => {
      console.error('Error updating vital:', error);
      toast.error('Erro ao atualizar sinal vital');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: vitalsService.deleteVital,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vitals'] });
      toast.success('Sinal vital excluído com sucesso!');
    },
    onError: (error) => {
      console.error('Error deleting vital:', error);
      toast.error('Erro ao excluir sinal vital');
    },
  });

  return {
    vitals,
    isLoading,
    error,
    createVital: createMutation.mutate,
    updateVital: updateMutation.mutate,
    deleteVital: deleteMutation.mutate,
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
  };
};
