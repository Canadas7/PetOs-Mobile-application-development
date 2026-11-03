import BottomNavigation from "../components/BottomNavigation";

import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from "react-native";

import colors from "../styles/colors";

import {
  PetResponse,
  Species,
} from "../services/petService";

import { useAuth } from "../contexts/AuthContext";
import { usePets } from "../hooks/usePets";

export default function PetsListScreen({
  navigation,
}: any) {
  const { session } = useAuth();

  const {
    pets,
    petsLoading,
    petsError,
    petsErrorObject,
    petsRefetching,
    refetchPets,
    deletePet,
    isDeletingPet,
  } = usePets({
    enabled: !!session,
    role: session?.role,
    email: session?.email,
  });

  function handleDeletePet(
    pet: PetResponse
  ) {
    if (session?.role !== "TUTOR") {
      return;
    }

    Alert.alert(
      "Excluir pet",
      `Deseja realmente excluir ${pet.name}?`,
      [
        {
          text: "Cancelar",
          style: "cancel",
        },
        {
          text: "Excluir",
          style: "destructive",

          onPress: async () => {
            try {
              await deletePet(pet.id);
            } catch (error) {
              Alert.alert(
                "Erro ao excluir",
                error instanceof Error
                  ? error.message
                  : "Não foi possível excluir o pet."
              );
            }
          },
        },
      ]
    );
  }

  function getSpeciesName(
    species: Species
  ) {
    const speciesNames: Record<
      Species,
      string
    > = {
      DOG: "Cachorro",
      CAT: "Gato",
      BIRD: "Ave",
      RABBIT: "Coelho",
      FISH: "Peixe",
      REPTILE: "Réptil",
      OTHER: "Outro",
    };

    return speciesNames[species];
  }

  function formatAge(
    ageInMonths: number | null
  ) {
    if (ageInMonths === null) {
      return "Idade não informada";
    }

    if (ageInMonths < 12) {
      return ageInMonths === 1
        ? "1 mês"
        : `${ageInMonths} meses`;
    }

    const years = Math.floor(
      ageInMonths / 12
    );

    const months =
      ageInMonths % 12;

    if (months === 0) {
      return years === 1
        ? "1 ano"
        : `${years} anos`;
    }

    return `${years} ${
      years === 1 ? "ano" : "anos"
    } e ${months} ${
      months === 1 ? "mês" : "meses"
    }`;
  }

  if (petsLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator
          size="large"
          color={colors.teal}
        />

        <Text style={styles.loadingText}>
          Carregando pets...
        </Text>
      </View>
    );
  }

  if (petsError) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.errorTitle}>
          Não foi possível carregar os pets.
        </Text>

        <Text style={styles.errorText}>
          {petsErrorObject instanceof Error
            ? petsErrorObject.message
            : "Ocorreu um erro inesperado."}
        </Text>

        <TouchableOpacity
          style={styles.button}
          onPress={() => refetchPets()}
        >
          <Text style={styles.buttonText}>
            Tentar novamente
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        {session?.role === "CLINICA"
          ? "Pets Cadastrados"
          : "Meus Pets"}
      </Text>

      <Text style={styles.subtitle}>
        {session?.role === "CLINICA"
          ? "Consulte os pets disponíveis no sistema."
          : "Acompanhe e gerencie seus pets."}
      </Text>

      {pets.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>
            Nenhum pet cadastrado ainda.
          </Text>

          {session?.role === "TUTOR" && (
            <TouchableOpacity
              style={styles.button}
              onPress={() =>
                navigation.navigate(
                  "PetRegister"
                )
              }
            >
              <Text style={styles.buttonText}>
                Cadastrar Pet
              </Text>
            </TouchableOpacity>
          )}
        </View>
      ) : (
        <FlatList
          data={pets}
          keyExtractor={(item) =>
            item.id.toString()
          }
          showsVerticalScrollIndicator={false}
          refreshing={petsRefetching}
          onRefresh={refetchPets}
          contentContainerStyle={
            styles.listContent
          }
          renderItem={({ item }) => (
            <View style={styles.petCard}>
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() =>
                  navigation.navigate(
                    "PetDetails",
                    {
                      pet: item,
                    }
                  )
                }
              >
                <Text style={styles.petName}>
                  {item.name}
                </Text>

                <Text style={styles.petInfo}>
                  {getSpeciesName(
                    item.species
                  )}
                  {item.breed
                    ? ` • ${item.breed}`
                    : ""}
                </Text>

                <Text style={styles.petAge}>
                  {formatAge(
                    item.ageInMonths
                  )}
                </Text>

                {session?.role ===
                  "CLINICA" && (
                  <Text style={styles.tutor}>
                    Tutor: {item.tutorName}
                  </Text>
                )}
              </TouchableOpacity>

              {session?.role ===
                "TUTOR" && (
                <TouchableOpacity
                  style={[
                    styles.deleteButton,
                    isDeletingPet &&
                      styles.disabledButton,
                  ]}
                  disabled={
                    isDeletingPet
                  }
                  onPress={() =>
                    handleDeletePet(item)
                  }
                >
                  <Text
                    style={
                      styles.deleteButtonText
                    }
                  >
                    Excluir
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          )}
        />
      )}

      {session?.role === "TUTOR" &&
        pets.length > 0 && (
          <TouchableOpacity
            style={styles.addButton}
            onPress={() =>
              navigation.navigate(
                "PetRegister"
              )
            }
          >
            <Text
              style={styles.addButtonText}
            >
              + Cadastrar novo pet
            </Text>
          </TouchableOpacity>
        )}

      <BottomNavigation
        navigation={navigation}
        current="PetsList"
      />
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

  loadingContainer: {
    flex: 1,
    backgroundColor: colors.primary,
    padding: 24,
    alignItems: "center",
    justifyContent: "center",
  },

  loadingText: {
    color: colors.white,
    fontSize: 15,
    marginTop: 14,
  },

  title: {
    color: colors.white,
    fontSize: 30,
    fontWeight: "800",
  },

  subtitle: {
    color: colors.mint,
    fontSize: 14,
    marginTop: 6,
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
    textAlign: "center",
  },

  button: {
    backgroundColor: colors.teal,
    padding: 16,
    borderRadius: 16,
    width: "100%",
    alignItems: "center",
    marginTop: 10,
  },

  buttonText: {
    color: colors.primary,
    fontWeight: "800",
    fontSize: 16,
  },

  listContent: {
    paddingBottom: 110,
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

  tutor: {
    color: colors.gray,
    marginTop: 8,
    fontSize: 13,
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

  disabledButton: {
    opacity: 0.6,
  },

  addButton: {
    backgroundColor: colors.teal,
    borderRadius: 16,
    padding: 14,
    alignItems: "center",
    marginBottom: 90,
  },

  addButtonText: {
    color: colors.primary,
    fontWeight: "800",
    fontSize: 15,
  },

  errorTitle: {
    color: colors.white,
    fontSize: 20,
    fontWeight: "800",
    textAlign: "center",
  },

  errorText: {
    color: colors.mint,
    fontSize: 14,
    textAlign: "center",
    marginTop: 10,
    marginBottom: 12,
  },
});