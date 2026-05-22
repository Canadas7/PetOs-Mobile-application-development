import BottomNavigation from "../components/BottomNavigation";
import { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
} from "react-native";

import colors from "../styles/colors";

import { getPets, deletePet } from "../storage/petStorage";
import { Pet } from "../types/Pet";

export default function PetsListScreen({ navigation }: any) {
  const [pets, setPets] = useState<Pet[]>([]);

  useEffect(() => {
    loadPets();
  }, []);

  async function loadPets() {
    const storedPets = await getPets();
    setPets(storedPets);
  }

  async function handleDeletePet(id: string) {
    await deletePet(id);
    loadPets();
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Meus Pets</Text>

      {pets.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>Nenhum pet cadastrado ainda.</Text>

          <TouchableOpacity
            style={styles.button}
            onPress={() => navigation.navigate("PetRegister")}
          >
            <Text style={styles.buttonText}>Cadastrar Pet</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={pets}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.petCard}>
              <TouchableOpacity
                onPress={() =>
                  navigation.navigate("PetDetails", {
                    pet: item,
                  })
                }
              >
                <Text style={styles.petName}>{item.name}</Text>

                <Text style={styles.petInfo}>
                  {item.species} • {item.breed}
                </Text>

                <Text style={styles.petAge}>{item.age}</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.deleteButton}
                onPress={() => handleDeletePet(item.id)}
              >
                <Text style={styles.deleteButtonText}>Excluir</Text>
              </TouchableOpacity>
            </View>
          )}
        />
      )}

      <BottomNavigation navigation={navigation} current="PetsList" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.primary,
    padding: 24,
    paddingTop: 50,
  },
  title: {
    color: colors.white,
    fontSize: 30,
    fontWeight: "800",
    marginBottom: 24,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyText: {
    color: colors.white,
    fontSize: 16,
    marginBottom: 20,
  },
  button: {
    backgroundColor: colors.teal,
    padding: 16,
    borderRadius: 16,
    width: "100%",
    alignItems: "center",
  },
  buttonText: {
    color: colors.primary,
    fontWeight: "800",
    fontSize: 16,
  },
  petCard: {
    backgroundColor: colors.white,
    borderRadius: 18,
    padding: 18,
    marginBottom: 14,
  },
  petName: {
    color: colors.primary,
    fontSize: 22,
    fontWeight: "800",
  },
  petInfo: {
    color: colors.gray,
    marginTop: 6,
    fontSize: 14,
  },
  petAge: {
    color: colors.teal,
    marginTop: 10,
    fontWeight: "700",
  },
  deleteButton: {
    backgroundColor: colors.danger,
    padding: 10,
    borderRadius: 12,
    marginTop: 14,
    alignItems: "center",
  },
  deleteButtonText: {
    color: colors.white,
    fontWeight: "800",
  },
});