import { Pet } from "./Pet";

export type RootStackParamList = {
  Login: undefined;
  Register: undefined;
  Home: undefined;
  PetsList: undefined;
  PetRegister: undefined;

  PetDetails: {
    pet: Pet;
  };

  History: undefined;
  Vaccines: undefined;
  Profile: undefined;
};