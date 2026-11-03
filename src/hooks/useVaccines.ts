import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import {
  createVaccine as createVaccineService,
  deleteVaccine as deleteVaccineService,
  getVaccinesByPet,
  updateVaccine as updateVaccineService,
  VaccineData,
} from "../services/vaccineService";

export function useVaccines(
  petId: number | null
) {
  const queryClient = useQueryClient();

  const vaccinesQuery = useQuery({
    queryKey: [
      "vaccines",
      petId,
    ],

    queryFn: () =>
      getVaccinesByPet(petId!),

    enabled: petId !== null,
  });

  async function refreshVaccineData() {
    await queryClient.invalidateQueries({
      queryKey: ["vaccines"],
    });

    await queryClient.invalidateQueries({
      queryKey: ["alerts"],
    });
  }

  const createMutation = useMutation({
    mutationFn: createVaccineService,

    onSuccess: async () => {
      await refreshVaccineData();
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: number;
      data: VaccineData;
    }) =>
      updateVaccineService(
        id,
        data
      ),

    onSuccess: async () => {
      await refreshVaccineData();
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteVaccineService,

    onSuccess: async () => {
      await refreshVaccineData();
    },
  });

  async function createVaccine(
    data: VaccineData
  ) {
    return createMutation.mutateAsync(
      data
    );
  }

  async function updateVaccine(
    id: number,
    data: VaccineData
  ) {
    return updateMutation.mutateAsync({
      id,
      data,
    });
  }

  async function deleteVaccine(
    id: number
  ) {
    return deleteMutation.mutateAsync(
      id
    );
  }

  return {
    vaccines:
      vaccinesQuery.data ?? [],

    vaccinesLoading:
      vaccinesQuery.isLoading,

    vaccinesError:
      vaccinesQuery.isError,

    vaccinesErrorObject:
      vaccinesQuery.error,

    refetchVaccines:
      vaccinesQuery.refetch,

    createVaccine,
    updateVaccine,
    deleteVaccine,

    isCreating:
      createMutation.isPending,

    isUpdating:
      updateMutation.isPending,

    isDeleting:
      deleteMutation.isPending,
  };
}