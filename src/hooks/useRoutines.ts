import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import {
  createRoutine as createRoutineService,
  deleteRoutine as deleteRoutineService,
  getRoutinesByPet,
  updateRoutine as updateRoutineService,
  RoutineData,
} from "../services/routineService";

export function useRoutines(
  petId: number | null,
  enabled = true
) {
  const queryClient = useQueryClient();

  const routinesQuery = useQuery({
    queryKey: [
      "routines",
      petId,
    ],

    queryFn: () =>
      getRoutinesByPet(petId!),

    enabled:
      enabled &&
      petId !== null,
  });

  async function refreshRoutines() {
    await queryClient.invalidateQueries({
      queryKey: ["routines"],
    });

    await queryClient.invalidateQueries({
      queryKey: ["pet-history"],
    });
  }

  const createMutation = useMutation({
    mutationFn: createRoutineService,

    onSuccess: async () => {
      await refreshRoutines();
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: number;
      data: RoutineData;
    }) =>
      updateRoutineService(
        id,
        data
      ),

    onSuccess: async () => {
      await refreshRoutines();
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteRoutineService,

    onSuccess: async () => {
      await refreshRoutines();
    },
  });

  async function createRoutine(
    data: RoutineData
  ) {
    return createMutation.mutateAsync(
      data
    );
  }

  async function updateRoutine(
    id: number,
    data: RoutineData
  ) {
    return updateMutation.mutateAsync({
      id,
      data,
    });
  }

  async function deleteRoutine(
    id: number
  ) {
    return deleteMutation.mutateAsync(
      id
    );
  }

  return {
    routines:
      routinesQuery.data ?? [],

    routinesLoading:
      routinesQuery.isLoading,

    routinesError:
      routinesQuery.isError,

    routinesErrorObject:
      routinesQuery.error,

    refetchRoutines:
      routinesQuery.refetch,

    createRoutine,
    updateRoutine,
    deleteRoutine,

    isCreatingRoutine:
      createMutation.isPending,

    isUpdatingRoutine:
      updateMutation.isPending,

    isDeletingRoutine:
      deleteMutation.isPending,
  };
}