import { apiRequest } from "./api";

export type AlertType =
  | "VACCINE_DUE"
  | "VACCINE_OVERDUE"
  | "ROUTINE_REMINDER"
  | "HEALTH_CHECK"
  | "BIRTHDAY"
  | "OTHER";

export type AlertResponse = {
  id: number;
  petId: number;
  petName: string;
  type: AlertType;
  message: string;
  dueDate: string | null;
  sent: boolean;
  createdAt: string;
};

export type AlertData = {
  petId: number;
  type: AlertType;
  message: string;
  dueDate?: string;
};

type PageResponse<T> = {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
  first: boolean;
  last: boolean;
  empty: boolean;
};

export async function getAlerts(): Promise<AlertResponse[]> {
  const response =
    await apiRequest<PageResponse<AlertResponse>>(
      "/alerts?size=100"
    );

  return response.content;
}

export async function getAlertById(
  id: number
): Promise<AlertResponse> {
  return apiRequest<AlertResponse>(
    `/alerts/${id}`
  );
}

export async function getPendingAlerts(): Promise<AlertResponse[]> {
  return apiRequest<AlertResponse[]>(
    "/alerts/pending"
  );
}

export async function getAlertsByPet(
  petId: number
): Promise<AlertResponse[]> {
  return apiRequest<AlertResponse[]>(
    `/pets/${petId}/alerts`
  );
}

export async function getPendingAlertsByPet(
  petId: number
): Promise<AlertResponse[]> {
  return apiRequest<AlertResponse[]>(
    `/pets/${petId}/alerts/pending`
  );
}

export async function createAlert(
  data: AlertData
): Promise<AlertResponse> {
  return apiRequest<AlertResponse>(
    "/alerts",
    {
      method: "POST",
      body: JSON.stringify(data),
    }
  );
}

export async function updateAlert(
  id: number,
  data: AlertData
): Promise<AlertResponse> {
  return apiRequest<AlertResponse>(
    `/alerts/${id}`,
    {
      method: "PUT",
      body: JSON.stringify(data),
    }
  );
}

export async function markAlertAsSent(
  id: number
): Promise<AlertResponse> {
  return apiRequest<AlertResponse>(
    `/alerts/${id}/mark-sent`,
    {
      method: "PATCH",
    }
  );
}

export async function deleteAlert(
  id: number
): Promise<void> {
  return apiRequest<void>(
    `/alerts/${id}`,
    {
      method: "DELETE",
    }
  );
}
