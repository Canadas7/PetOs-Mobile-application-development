import { apiRequest } from "./api";

export type AlertType =
  | "VACCINE_DUE"
  | "VACCINE_OVERDUE"
  | "ROUTINE_REMINDER"
  | "HEALTH_CHECK"
  | "WEIGHT_CHECK"
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

export async function getPendingAlerts(): Promise<AlertResponse[]> {
  return apiRequest<AlertResponse[]>("/alerts/pending");
}