import AsyncStorage from "@react-native-async-storage/async-storage";
import { Pet } from "../types/Pet";

const PETS_KEY = "@petos:pets";

export async function savePet(newPet: Pet) {
  const storedPets = await getPets();

  const updatedPets = [...storedPets, newPet];

  await AsyncStorage.setItem(PETS_KEY, JSON.stringify(updatedPets));
}

export async function getPets(): Promise<Pet[]> {
  const data = await AsyncStorage.getItem(PETS_KEY);

  if (!data) {
    return [];
  }

  return JSON.parse(data);
}