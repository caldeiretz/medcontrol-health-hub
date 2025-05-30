
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { sharingService } from '@/services/sharingService';
import { toast } from 'sonner';

export const useSharing = () => {
  const queryClient = useQueryClient();

  const { data: relationships = [], isLoading, error } = useQuery({
    queryKey: ['sharing-relationships'],
    queryFn: sharingService.getSharingRelationships,
  });

  const createSharingMutation = useMutation({
    mutationFn: sharingService.createSharing,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sharing-relationships'] });
      toast.success('Compartilhamento concedido com sucesso!');
    },
    onError: (error: any) => {
      console.error('Error creating sharing:', error);
      if (error.code === '23505') {
        toast.error('Você já compartilha dados com este médico');
      } else {
        toast.error('Erro ao conceder compartilhamento');
      }
    },
  });

  const revokeSharingMutation = useMutation({
    mutationFn: sharingService.revokeSharing,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sharing-relationships'] });
      toast.success('Compartilhamento revogado com sucesso!');
    },
    onError: (error) => {
      console.error('Error revoking sharing:', error);
      toast.error('Erro ao revogar compartilhamento');
    },
  });

  return {
    relationships,
    isLoading,
    error,
    createSharing: createSharingMutation.mutate,
    revokeSharing: revokeSharingMutation.mutate,
    isCreating: createSharingMutation.isPending,
    isRevoking: revokeSharingMutation.isPending,
  };
};
