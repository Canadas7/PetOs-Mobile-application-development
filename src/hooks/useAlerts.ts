import { useQuery } from "@tanstack/react-query";

import {
  getPendingAlerts,
} from "../services/alertService";

type UseAlertsOptions = {
  enabled?: boolean;
  email?: string;
};

export function useAlerts({
  enabled = true,
  email,
}: UseAlertsOptions = {}) {
  const alertsQuery = useQuery({
    queryKey: [
      "alerts",
      "pending",
      email,
    ],

    queryFn: getPendingAlerts,

    enabled,

    refetchOnMount: "always",

    refetchOnReconnect: true,
  });

  return {
    alerts:
      alertsQuery.data ?? [],

    alertsLoading:
      alertsQuery.isLoading,

    alertsError:
      alertsQuery.isError,

    alertsErrorObject:
      alertsQuery.error,

    refetchAlerts:
      alertsQuery.refetch,
  };
}