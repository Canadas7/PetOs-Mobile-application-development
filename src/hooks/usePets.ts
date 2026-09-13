import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import {
  createPet as createPetService,
  deletePet as deletePetService,
  getPets as getPetsService,
  updatePet as updatePetService,
  CreatePetData,
} from "../services/petService";

type UsePetsOptions = {
  enabled?: boolean;
  role?: string;
  email?: string;
};

export function usePets({
  enabled = true,
  role,
  email,
}: UsePetsOptions = {}) {
  const queryClient = useQueryClient();

  const petsQuery = useQuery({
    queryKey: [
      "pets",
      role,
      email,
    ],

    queryFn: getPetsService,

    enabled,
  });

  async function refreshPets() {
    await queryClient.invalidateQueries({
      queryKey: ["pets"],
    });
  }

  const createMutation = useMutation({
    mutationFn: createPetService,

    onSuccess: async () => {
      await refreshPets();
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: number;
      data: CreatePetData;
    }) =>
      updatePetService(
        id,
        data
      ),

    onSuccess: async () => {
      await refreshPets();
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deletePetService,

    onSuccess: async () => {
      await refreshPets();
    },
  });

  async function createPet(
    data: CreatePetData
  ) {
    return createMutation.mutateAsync(
      data
    );
  }

  async function updatePet(
    id: number,
    data: CreatePetData
  ) {
    return updateMutation.mutateAsync({
      id,
      data,
    });
  }

  async function deletePet(
    id: number
  ) {
    return deleteMutation.mutateAsync(
      id
    );
  }

  return {
    pets:
      petsQuery.data ?? [],

    petsLoading:
      petsQuery.isLoading,

    petsError:
      petsQuery.isError,

    petsErrorObject:
      petsQuery.error,

    petsRefetching:
      petsQuery.isRefetching,

    refetchPets:
      petsQuery.refetch,

    createPet,
    updatePet,
    deletePet,

    isCreatingPet:
      createMutation.isPending,

    isUpdatingPet:
      updateMutation.isPending,

    isDeletingPet:
      deleteMutation.isPending,
  };
}
