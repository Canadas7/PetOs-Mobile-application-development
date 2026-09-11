import { apiRequest } from "./api";

export type RoutineType =
  | "WALK"
  | "FEEDING"
  | "MEDICATION"
  | "BATHING"
  | "GROOMING"
  | "VET_VISIT"
  | "TRAINING"
  | "OTHER";

export type RoutineData = {
  petId: number;
  type: RoutineType;
  description?: string;
  recordDate: string;
};

export type RoutineResponse = {
  id: number;
  petId: number;
  petName: string;
  type: RoutineType;
  description: string | null;
  recordDate: string;
};

export async function getRoutinesByPet(
  petId: number
): Promise<RoutineResponse[]> {
  return apiRequest<RoutineResponse[]>(
    `/pets/${petId}/routines`
  );
}

export async function createRoutine(
  data: RoutineData
): Promise<RoutineResponse> {
  return apiRequest<RoutineResponse>(
    "/routines",
    {
      method: "POST",
      body: JSON.stringify(data),
    }
  );
}

export async function updateRoutine(
  id: number,
  data: RoutineData
): Promise<RoutineResponse> {
  return apiRequest<RoutineResponse>(
    `/routines/${id}`,
    {
      method: "PUT",
      body: JSON.stringify(data),
    }
  );
}

export async function deleteRoutine(
  id: number
): Promise<void> {
  return apiRequest<void>(
    `/routines/${id}`,
    {
      method: "DELETE",
    }
  );
}