import { View, Text, StyleSheet } from "react-native";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";

import colors from "../styles/colors";
import BottomNavigation from "../components/BottomNavigation";

export default function PetDetailsScreen({ route, navigation }: any) {
  const pet = route.params?.pet;

  if (!pet) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Pet não encontrado</Text>

        <BottomNavigation navigation={navigation} current="PetsList" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Detalhes do Pet</Text>

      <View style={styles.card}>
        <View style={styles.iconBox}>
          <MaterialIcons name="pets" size={54} color={colors.teal} />
        </View>

        <Text style={styles.petName}>{pet.name}</Text>

        <View style={styles.infoRow}>
          <MaterialIcons name="pets" size={22} color={colors.teal} />
          <Text style={styles.infoText}>Espécie: {pet.species}</Text>
        </View>

        <View style={styles.infoRow}>
          <Ionicons name="paw" size={22} color={colors.teal} />
          <Text style={styles.infoText}>Raça: {pet.breed}</Text>
        </View>

        <View style={styles.infoRow}>
          <Ionicons name="calendar-outline" size={22} color={colors.teal} />
          <Text style={styles.infoText}>Idade: {pet.age}</Text>
        </View>
      </View>

      <View style={styles.historyCard}>
        <Text style={styles.sectionTitle}>Histórico de Saúde</Text>
        <Text style={styles.historyText}>• Próxima vacina: 20 Jun</Text>
        <Text style={styles.historyText}>• Consulta de rotina pendente</Text>
        <Text style={styles.historyText}>• Acompanhamento geral ativo</Text>
      </View>

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
  card: {
    backgroundColor: colors.white,
    borderRadius: 24,
    padding: 24,
    alignItems: "center",
  },
  iconBox: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: colors.mint,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  petName: {
    color: colors.primary,
    fontSize: 32,
    fontWeight: "800",
    marginBottom: 22,
  },
  infoRow: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 14,
  },
  infoText: {
    color: colors.primary,
    fontSize: 16,
    fontWeight: "600",
  },
  historyCard: {
    backgroundColor: colors.mint,
    borderRadius: 20,
    padding: 18,
    marginTop: 18,
  },
  sectionTitle: {
    color: colors.primary,
    fontSize: 18,
    fontWeight: "800",
    marginBottom: 10,
  },
  historyText: {
    color: colors.primary,
    fontSize: 14,
    marginBottom: 6,
  },
});