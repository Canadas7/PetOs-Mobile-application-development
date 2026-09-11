import { apiRequest } from "./api";

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

export type VaccineData = {
  petId: number;
  name: string;
  applicationDate?: string;
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

export async function getVaccines(): Promise<VaccineResponse[]> {
  const response =
    await apiRequest<PageResponse<VaccineResponse>>(
      "/vaccines?size=100"
    );

  return response.content;
}

export async function getVaccineById(
  id: number
): Promise<VaccineResponse> {
  return apiRequest<VaccineResponse>(
    `/vaccines/${id}`
  );
}

export async function getVaccinesByPet(
  petId: number
): Promise<VaccineResponse[]> {
  return apiRequest<VaccineResponse[]>(
    `/pets/${petId}/vaccines`
  );
}

export async function getPendingVaccinesByPet(
  petId: number
): Promise<VaccineResponse[]> {
  return apiRequest<VaccineResponse[]>(
    `/pets/${petId}/vaccines/pending`
  );
}

export async function createVaccine(
  data: VaccineData
): Promise<VaccineResponse> {
  return apiRequest<VaccineResponse>(
    "/vaccines",
    {
      method: "POST",
      body: JSON.stringify(data),
    }
  );
}

export async function updateVaccine(
  id: number,
  data: VaccineData
): Promise<VaccineResponse> {
  return apiRequest<VaccineResponse>(
    `/vaccines/${id}`,
    {
      method: "PUT",
      body: JSON.stringify(data),
    }
  );
}

export async function deleteVaccine(
  id: number
): Promise<void> {
  return apiRequest<void>(
    `/vaccines/${id}`,
    {
      method: "DELETE",
    }
  );
}