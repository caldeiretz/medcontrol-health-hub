
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { profileService, Profile } from '@/services/profileService';
import { toast } from 'sonner';

export const useProfile = () => {
  const queryClient = useQueryClient();

  const { data: profile, isLoading, error } = useQuery({
    queryKey: ['profile'],
    queryFn: profileService.getCurrentProfile,
  });

  const updateMutation = useMutation({
    mutationFn: profileService.updateProfile,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profile'] });
      toast.success('Perfil atualizado com sucesso!');
    },
    onError: (error) => {
      console.error('Error updating profile:', error);
      toast.error('Erro ao atualizar perfil');
    },
  });

  const searchDoctorsMutation = useMutation({
    mutationFn: profileService.searchDoctors,
    onError: (error) => {
      console.error('Error searching doctors:', error);
      toast.error('Erro ao buscar médicos');
    },
  });

  return {
    profile,
    isLoading,
    error,
    updateProfile: updateMutation.mutate,
    isUpdating: updateMutation.isPending,
    searchDoctors: searchDoctorsMutation.mutate,
    searchResults: searchDoctorsMutation.data || [],
    isSearching: searchDoctorsMutation.isPending,
  };
};
