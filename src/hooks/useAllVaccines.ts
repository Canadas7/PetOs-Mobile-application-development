import { useQuery } from "@tanstack/react-query";

import {
  getVaccines,
} from "../services/vaccineService";

type UseAllVaccinesOptions = {
  enabled?: boolean;
};

export function useAllVaccines({
  enabled = true,
}: UseAllVaccinesOptions = {}) {
  const vaccinesQuery = useQuery({
    queryKey: ["vaccines", "all"],
    queryFn: getVaccines,
    enabled,
    refetchOnMount: "always",
    refetchOnReconnect: true,
  });

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
  };
}
