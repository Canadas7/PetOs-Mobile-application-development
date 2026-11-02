import { useEffect } from "react";

import { useQuery } from "@tanstack/react-query";

import {
  getPendingAlerts,
} from "../services/alertService";

import {
  notifyPetAlert,
} from "../services/notificationService";

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

  const alerts =
    alertsQuery.data ?? [];

  useEffect(() => {
    if (
      !enabled ||
      alerts.length === 0
    ) {
      return;
    }

    async function sendNotifications() {
      await Promise.all(
        alerts.map((alert) =>
          notifyPetAlert({
            id: alert.id,
            petId: alert.petId,
            petName: alert.petName,
            message: alert.message,
          })
        )
      );
    }

    sendNotifications().catch(
      (error) => {
        console.error(
          "Erro ao gerar notificações:",
          error
        );
      }
    );
  }, [alerts, enabled]);

  return {
    alerts,

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