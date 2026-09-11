import { apiRequest } from "./api";

export type Species =
  | "DOG"
  | "CAT"
  | "BIRD"
  | "RABBIT"
  | "FISH"
  | "REPTILE"
  | "OTHER";

export type CreatePetData = {
  name: string;
  species: Species;
  breed?: string;
  birthDate?: string;
  weight?: number;
  tutorName: string;
  tutorPhone?: string;
};

export type PetResponse = {
  id: number;
  name: string;
  species: Species;
  breed: string | null;
  birthDate: string | null;
  weight: number | null;
  tutorName: string;
  tutorPhone: string | null;
  active: boolean;
  ageInMonths: number | null;
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

export async function createPet(
  data: CreatePetData
): Promise<PetResponse> {
  return apiRequest<PetResponse>("/pets", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function getPets(): Promise<PetResponse[]> {
  const response = await apiRequest<PageResponse<PetResponse>>(
    "/pets?size=100"
  );

  return response.content;
}

export async function deletePet(
  id: number
): Promise<void> {
  return apiRequest<void>(`/pets/${id}`, {
    method: "DELETE",
  });
}

export async function getPetById(
  id: number
): Promise<PetResponse> {
  return apiRequest<PetResponse>(`/pets/${id}`);
}

export async function updatePet(
  id: number,
  data: CreatePetData
): Promise<PetResponse> {
  return apiRequest<PetResponse>(`/pets/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
}