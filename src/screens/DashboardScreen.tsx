import { useEffect, useState } from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";

import colors from "../styles/colors";
import BottomNavigation from "../components/BottomNavigation";
import { getPets } from "../storage/petStorage";
import { Pet } from "../types/Pet";

export default function DashboardScreen({ navigation }: any) {
  const [pets, setPets] = useState<Pet[]>([]);

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      loadPets();
    });

    return unsubscribe;
  }, [navigation]);

  async function loadPets() {
    const storedPets = await getPets();
    setPets(storedPets);
  }

  const totalPets = pets.length;
  const firstPet = pets[0];

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>Dashboard</Text>

        <Text style={styles.subtitle}>
          Acompanhe os dados cadastrados no app.
        </Text>

        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <Ionicons name="paw" size={34} color={colors.teal} />
            <Text style={styles.statNumber}>{totalPets}</Text>
            <Text style={styles.statText}>Pets cadastrados</Text>
          </View>

          <View style={styles.statCard}>
            <MaterialIcons name="pets" size={34} color={colors.teal} />
            <Text style={styles.statNumber}>
              {firstPet ? firstPet.species : "-"}
            </Text>
            <Text style={styles.statText}>Espécie principal</Text>
          </View>
        </View>

        <View style={styles.largeCard}>
          <View style={styles.cardHeader}>
            <Ionicons name="information-circle" size={30} color={colors.teal} />
            <Text style={styles.cardTitle}>Pet em destaque</Text>
          </View>

          {firstPet ? (
            <Text style={styles.cardDescription}>
              Nome: {firstPet.name}{"\n"}
              Espécie: {firstPet.species}{"\n"}
              Raça: {firstPet.breed}{"\n"}
              Idade: {firstPet.age}
            </Text>
          ) : (
            <Text style={styles.cardDescription}>
              Nenhum pet cadastrado ainda.
            </Text>
          )}
        </View>

        <View style={styles.largeCard}>
          <View style={styles.cardHeader}>
            <Ionicons name="list" size={30} color={colors.teal} />
            <Text style={styles.cardTitle}>Resumo dos Pets</Text>
          </View>

          {pets.length > 0 ? (
            pets.map((pet) => (
              <Text key={pet.id} style={styles.cardDescription}>
                • {pet.name} - {pet.species} - {pet.age}
              </Text>
            ))
          ) : (
            <Text style={styles.cardDescription}>
              Cadastre um pet para ver o resumo.
            </Text>
          )}
        </View>

        <View style={styles.alertCard}>
          <Ionicons name="alert-circle" size={34} color={colors.white} />

          <View style={{ flex: 1 }}>
            <Text style={styles.alertTitle}>Status</Text>

            <Text style={styles.alertText}>
              {totalPets > 0
                ? "Você já possui pets cadastrados no PetOS."
                : "Nenhum pet cadastrado no momento."}
            </Text>
          </View>
        </View>
      </ScrollView>

      <BottomNavigation navigation={navigation} current="Dashboard" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.primary,
    paddingTop: 50,
    paddingHorizontal: 22,
  },
  title: {
    color: colors.white,
    fontSize: 34,
    fontWeight: "800",
  },
  subtitle: {
    color: colors.mint,
    fontSize: 15,
    marginTop: 8,
    marginBottom: 24,
  },
  statsContainer: {
    flexDirection: "row",
    gap: 14,
    marginBottom: 18,
  },
  statCard: {
    flex: 1,
    backgroundColor: colors.white,
    borderRadius: 22,
    padding: 22,
    alignItems: "center",
  },
  statNumber: {
    color: colors.primary,
    fontSize: 24,
    fontWeight: "800",
    marginTop: 12,
    textAlign: "center",
  },
  statText: {
    color: colors.gray,
    fontSize: 13,
    textAlign: "center",
    marginTop: 6,
  },
  largeCard: {
    backgroundColor: colors.white,
    borderRadius: 24,
    padding: 22,
    marginBottom: 18,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 14,
  },
  cardTitle: {
    color: colors.primary,
    fontSize: 20,
    fontWeight: "800",
  },
  cardDescription: {
    color: colors.primary,
    fontSize: 15,
    lineHeight: 24,
  },
  alertCard: {
    backgroundColor: colors.teal,
    borderRadius: 22,
    padding: 20,
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    marginBottom: 120,
  },
  alertTitle: {
    color: colors.white,
    fontSize: 18,
    fontWeight: "800",
  },
  alertText: {
    color: colors.white,
    fontSize: 14,
    marginTop: 4,
  },
});