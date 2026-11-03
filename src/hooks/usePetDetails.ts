import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import {
  CreatePetData,
  getPetById,
  updatePet as updatePetService,
} from "../services/petService";

export function usePetDetails(
  petId: number | null
) {
  const queryClient = useQueryClient();

  const petQuery = useQuery({
    queryKey: ["pet", petId],
    queryFn: () =>
      getPetById(petId!),
    enabled: petId !== null,
  });

  const updateMutation = useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: number;
      data: CreatePetData;
    }) =>
      updatePetService(id, data),

    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: ["pets"],
        }),

        queryClient.invalidateQueries({
          queryKey: ["pet", petId],
        }),

        queryClient.invalidateQueries({
          queryKey: [
            "pet-history",
            petId,
          ],
        }),
      ]);
    },
  });

  async function updatePet(
    id: number,
    data: CreatePetData
  ) {
    return updateMutation.mutateAsync({
      id,
      data,
    });
  }

  return {
    pet:
      petQuery.data ?? null,

    petLoading:
      petQuery.isLoading,

    petError:
      petQuery.isError,

    petErrorObject:
      petQuery.error,

    refetchPet:
      petQuery.refetch,

    updatePet,

    isUpdatingPet:
      updateMutation.isPending,
  };
}
