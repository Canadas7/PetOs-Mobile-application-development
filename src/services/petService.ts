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

export async function createPet(
  data: CreatePetData
): Promise<PetResponse> {
  return apiRequest<PetResponse>("/pets", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function getPets(): Promise<PetResponse[]> {
  return apiRequest<PetResponse[]>("/pets");
}

export async function deletePet(id: number): Promise<void> {
  return apiRequest<void>(`/pets/${id}`, {
    method: "DELETE",
  });
}