import { useQueries } from "@tanstack/react-query";

import {
  getVaccinesByPet,
  VaccineResponse,
} from "../services/vaccineService";

import {
  PetResponse,
} from "../services/petService";

export function useTutorVaccines(
  pets: PetResponse[],
  enabled = true
) {
  const vaccineQueries = useQueries({
    queries: pets.map((pet) => ({
      queryKey: [
        "vaccines",
        "tutor-home",
        pet.id,
      ],

      queryFn: () =>
        getVaccinesByPet(pet.id),

      enabled,
      refetchOnMount: "always" as const,
      refetchOnReconnect: true,
    })),
  });

  const vaccines: VaccineResponse[] =
    vaccineQueries.flatMap(
      (query) => query.data ?? []
    );

  const latestVaccine =
    vaccines.length > 0
      ? [...vaccines].sort(
          (a, b) => b.id - a.id
        )[0]
      : undefined;

  const vaccinesLoading =
    vaccineQueries.some(
      (query) => query.isLoading
    );

  const vaccinesError =
    vaccineQueries.some(
      (query) => query.isError
    );

  async function refetchVaccines() {
    await Promise.all(
      vaccineQueries.map(
        (query) => query.refetch()
      )
    );
  }

  return {
    vaccines,
    latestVaccine,
    vaccinesLoading,
    vaccinesError,
    refetchVaccines,
  };
}