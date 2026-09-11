import { apiRequest } from "./api";
import { PetResponse } from "./petService";
import { AlertResponse } from "./alertService";

export type VaccineStatus =
  | "PENDING"
  | "APPLIED"
  | "EXPIRING_SOON"
  | "OVERDUE";

export type VaccineResponse = {
  id: number;
  petId: number;
  petName: string;
  name: string;
  applicationDate: string | null;
  dueDate: string | null;
  status: VaccineStatus;
  expiringSoon: boolean;
};

export type RoutineType =
  | "WALK"
  | "FEEDING"
  | "MEDICATION"
  | "BATHING"
  | "GROOMING"
  | "VET_VISIT"
  | "TRAINING"
  | "OTHER";

export type RoutineResponse = {
  id: number;
  petId: number;
  petName: string;
  type: RoutineType;
  description: string;
  recordDate: string;
};

export type PetHistoryResponse = {
  pet: PetResponse;
  vaccines: VaccineResponse[];
  routines: RoutineResponse[];
  alerts: AlertResponse[];
};

export async function getPetHistory(
  petId: number
): Promise<PetHistoryResponse> {
  return apiRequest<PetHistoryResponse>(
    `/pets/${petId}/history`
  );
}