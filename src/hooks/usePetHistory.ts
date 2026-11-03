import { useQuery } from "@tanstack/react-query";

import {
  getPetHistory,
  PetHistoryResponse,
} from "../services/historyService";

export function usePetHistory(
  petId: number | null,
  enabled = true
) {
  const historyQuery = useQuery({
    queryKey: [
      "pet-history",
      petId,
    ],

    queryFn: () =>
      getPetHistory(petId!),

    enabled:
      enabled &&
      petId !== null,
  });

  return {
    history:
      historyQuery.data ??
      null,

    historyLoading:
      historyQuery.isLoading,

    historyError:
      historyQuery.isError,

    historyErrorObject:
      historyQuery.error,

    refetchHistory:
      historyQuery.refetch,
  };
}