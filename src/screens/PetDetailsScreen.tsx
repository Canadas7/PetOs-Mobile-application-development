import { useEffect, useState } from "react";

import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  ActivityIndicator,
  Alert,
} from "react-native";

import {
  Ionicons,
  MaterialIcons,
} from "@expo/vector-icons";

import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import colors from "../styles/colors";
import BottomNavigation from "../components/BottomNavigation";

import {
  CreatePetData,
  getPetById,
  Species,
  updatePet,
} from "../services/petService";

import { useAuth } from "../contexts/AuthContext";

const speciesOptions: {
  label: string;
  value: Species;
}[] = [
  { label: "Cachorro", value: "DOG" },
  { label: "Gato", value: "CAT" },
  { label: "Ave", value: "BIRD" },
  { label: "Coelho", value: "RABBIT" },
  { label: "Peixe", value: "FISH" },
  { label: "Réptil", value: "REPTILE" },
  { label: "Outro", value: "OTHER" },
];

export default function PetDetailsScreen({
  route,
  navigation,
}: any) {
  const initialPet = route.params?.pet;

  const { session } = useAuth();
  const queryClient = useQueryClient();

  const petId = initialPet?.id;

  const [editing, setEditing] = useState(false);

  const [name, setName] = useState("");
  const [species, setSpecies] =
    useState<Species>("DOG");
  const [breed, setBreed] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [weight, setWeight] = useState("");
  const [tutorPhone, setTutorPhone] = useState("");
  const [formError, setFormError] = useState("");

  const {
    data: pet,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["pet", petId],
    queryFn: () => getPetById(petId),
    enabled: !!petId,
  });

  useEffect(() => {
    if (!pet) {
      return;
    }

    setName(pet.name);
    setSpecies(pet.species);
    setBreed(pet.breed || "");
    setBirthDate(pet.birthDate || "");
    setWeight(
      pet.weight !== null
        ? String(pet.weight)
        : ""
    );
    setTutorPhone(pet.tutorPhone || "");
  }, [pet]);

  const updateMutation = useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: number;
      data: CreatePetData;
    }) => updatePet(id, data),

    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["pets"],
      });

      await queryClient.invalidateQueries({
        queryKey: ["pet", petId],
      });

      setEditing(false);

      Alert.alert(
        "Pet atualizado",
        "As informações foram atualizadas com sucesso."
      );
    },

    onError: (error: Error) => {
      setFormError(error.message);
    },
  });

  function getSpeciesName(value: Species) {
    const names: Record<Species, string> = {
      DOG: "Cachorro",
      CAT: "Gato",
      BIRD: "Ave",
      RABBIT: "Coelho",
      FISH: "Peixe",
      REPTILE: "Réptil",
      OTHER: "Outro",
    };

    return names[value];
  }

  function formatAge(ageInMonths: number | null) {
    if (ageInMonths === null) {
      return "Não informada";
    }

    if (ageInMonths < 12) {
      return ageInMonths === 1
        ? "1 mês"
        : `${ageInMonths} meses`;
    }

    const years = Math.floor(
      ageInMonths / 12
    );

    const months = ageInMonths % 12;

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

  function validateDate(date: string) {
    if (!date) {
      return true;
    }

    const pattern = /^\d{4}-\d{2}-\d{2}$/;

    if (!pattern.test(date)) {
      return false;
    }

    const parsedDate = new Date(
      `${date}T00:00:00`
    );

    if (Number.isNaN(parsedDate.getTime())) {
      return false;
    }

    return parsedDate < new Date();
  }

  function handleUpdate() {
    setFormError("");

    if (!pet) {
      return;
    }

    if (!name.trim()) {
      setFormError(
        "Digite o nome do pet."
      );
      return;
    }

    if (!validateDate(birthDate)) {
      setFormError(
        "Informe a data no formato AAAA-MM-DD."
      );
      return;
    }

    if (weight.trim()) {
      const numericWeight = Number(
        weight.replace(",", ".")
      );

      if (
        Number.isNaN(numericWeight) ||
        numericWeight <= 0
      ) {
        setFormError(
          "Informe um peso válido."
        );
        return;
      }
    }

    updateMutation.mutate({
      id: pet.id,

      data: {
        name: name.trim(),
        species,

        breed: breed.trim()
          ? breed.trim()
          : undefined,

        birthDate: birthDate.trim()
          ? birthDate.trim()
          : undefined,

        weight: weight.trim()
          ? Number(
              weight.replace(",", ".")
            )
          : undefined,

        tutorName: pet.tutorName,

        tutorPhone: tutorPhone.trim()
          ? tutorPhone.trim()
          : undefined,
      },
    });
  }

  function handleCancelEdit() {
    if (!pet) {
      return;
    }

    setName(pet.name);
    setSpecies(pet.species);
    setBreed(pet.breed || "");
    setBirthDate(pet.birthDate || "");
    setWeight(
      pet.weight !== null
        ? String(pet.weight)
        : ""
    );
    setTutorPhone(pet.tutorPhone || "");

    setFormError("");
    setEditing(false);
  }

  if (!petId) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorTitle}>
          Pet não encontrado.
        </Text>

        <TouchableOpacity
          style={styles.mainButton}
          onPress={() =>
            navigation.navigate("PetsList")
          }
        >
          <Text style={styles.mainButtonText}>
            Voltar
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (isLoading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator
          size="large"
          color={colors.teal}
        />

        <Text style={styles.loadingText}>
          Carregando pet...
        </Text>
      </View>
    );
  }

  if (isError || !pet) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorTitle}>
          Não foi possível carregar o pet.
        </Text>

        <Text style={styles.errorText}>
          {error instanceof Error
            ? error.message
            : "Pet não encontrado."}
        </Text>

        <TouchableOpacity
          style={styles.mainButton}
          onPress={() =>
            navigation.navigate("PetsList")
          }
        >
          <Text style={styles.mainButtonText}>
            Voltar
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
          >
            <Ionicons
              name="chevron-back"
              size={30}
              color={colors.white}
            />
          </TouchableOpacity>

          <Text style={styles.title}>
            Detalhes do Pet
          </Text>
        </View>

        {!editing ? (
          <>
            <View style={styles.card}>
              <View style={styles.iconBox}>
                <MaterialIcons
                  name="pets"
                  size={54}
                  color={colors.teal}
                />
              </View>

              <Text style={styles.petName}>
                {pet.name}
              </Text>

              <View style={styles.infoRow}>
                <MaterialIcons
                  name="pets"
                  size={22}
                  color={colors.teal}
                />

                <View>
                  <Text style={styles.infoLabel}>
                    Espécie
                  </Text>

                  <Text style={styles.infoText}>
                    {getSpeciesName(
                      pet.species
                    )}
                  </Text>
                </View>
              </View>

              <View style={styles.infoRow}>
                <Ionicons
                  name="paw-outline"
                  size={22}
                  color={colors.teal}
                />

                <View>
                  <Text style={styles.infoLabel}>
                    Raça
                  </Text>

                  <Text style={styles.infoText}>
                    {pet.breed ||
                      "Não informada"}
                  </Text>
                </View>
              </View>

              <View style={styles.infoRow}>
                <Ionicons
                  name="calendar-outline"
                  size={22}
                  color={colors.teal}
                />

                <View>
                  <Text style={styles.infoLabel}>
                    Idade
                  </Text>

                  <Text style={styles.infoText}>
                    {formatAge(
                      pet.ageInMonths
                    )}
                  </Text>
                </View>
              </View>

              <View style={styles.infoRow}>
                <Ionicons
                  name="scale-outline"
                  size={22}
                  color={colors.teal}
                />

                <View>
                  <Text style={styles.infoLabel}>
                    Peso
                  </Text>

                  <Text style={styles.infoText}>
                    {pet.weight !== null
                      ? `${pet.weight} kg`
                      : "Não informado"}
                  </Text>
                </View>
              </View>

              <View style={styles.infoRow}>
                <Ionicons
                  name="person-outline"
                  size={22}
                  color={colors.teal}
                />

                <View>
                  <Text style={styles.infoLabel}>
                    Tutor
                  </Text>

                  <Text style={styles.infoText}>
                    {pet.tutorName}
                  </Text>
                </View>
              </View>

              <View style={styles.infoRow}>
                <Ionicons
                  name="call-outline"
                  size={22}
                  color={colors.teal}
                />

                <View>
                  <Text style={styles.infoLabel}>
                    Telefone
                  </Text>

                  <Text style={styles.infoText}>
                    {pet.tutorPhone ||
                      "Não informado"}
                  </Text>
                </View>
              </View>
            </View>

            {session?.role === "TUTOR" && (
              <TouchableOpacity
                style={styles.editButton}
                onPress={() =>
                  setEditing(true)
                }
              >
                <Ionicons
                  name="create-outline"
                  size={21}
                  color={colors.primary}
                />

                <Text
                  style={
                    styles.editButtonText
                  }
                >
                  Editar informações
                </Text>
              </TouchableOpacity>
            )}

            {session?.role === "CLINICA" && (
              <View style={styles.clinicCard}>
                <Ionicons
                  name="medkit-outline"
                  size={25}
                  color={colors.teal}
                />

                <View style={styles.clinicContent}>
                  <Text
                    style={
                      styles.clinicTitle
                    }
                  >
                    Visualização da clínica
                  </Text>

                  <Text
                    style={
                      styles.clinicText
                    }
                  >
                    Você pode consultar os
                    dados deste pet. O
                    gerenciamento de vacinas
                    será disponibilizado nesta
                    área.
                  </Text>
                </View>
              </View>
            )}
          </>
        ) : (
          <View style={styles.card}>
            <Text style={styles.editTitle}>
              Editar Pet
            </Text>

            <Text style={styles.label}>
              Nome
            </Text>

            <TextInput
              style={styles.input}
              value={name}
              onChangeText={setName}
              placeholder="Nome do pet"
            />

            <Text style={styles.label}>
              Espécie
            </Text>

            <View
              style={
                styles.speciesContainer
              }
            >
              {speciesOptions.map(
                (option) => (
                  <TouchableOpacity
                    key={option.value}
                    style={[
                      styles.speciesButton,

                      species ===
                        option.value &&
                        styles.speciesButtonSelected,
                    ]}
                    onPress={() =>
                      setSpecies(
                        option.value
                      )
                    }
                  >
                    <Text
                      style={[
                        styles.speciesText,

                        species ===
                          option.value &&
                          styles.speciesTextSelected,
                      ]}
                    >
                      {option.label}
                    </Text>
                  </TouchableOpacity>
                )
              )}
            </View>

            <Text style={styles.label}>
              Raça
            </Text>

            <TextInput
              style={styles.input}
              value={breed}
              onChangeText={setBreed}
              placeholder="Raça"
            />

            <Text style={styles.label}>
              Data de nascimento
            </Text>

            <TextInput
              style={styles.input}
              value={birthDate}
              onChangeText={setBirthDate}
              placeholder="AAAA-MM-DD"
              keyboardType="numbers-and-punctuation"
            />

            <Text style={styles.label}>
              Peso (kg)
            </Text>

            <TextInput
              style={styles.input}
              value={weight}
              onChangeText={setWeight}
              placeholder="Ex: 12,5"
              keyboardType="decimal-pad"
            />

            <Text style={styles.label}>
              Telefone do tutor
            </Text>

            <TextInput
              style={styles.input}
              value={tutorPhone}
              onChangeText={setTutorPhone}
              placeholder="Telefone"
              keyboardType="phone-pad"
            />

            {formError ? (
              <Text style={styles.formError}>
                {formError}
              </Text>
            ) : null}

            <TouchableOpacity
              style={[
                styles.saveButton,

                updateMutation.isPending &&
                  styles.disabledButton,
              ]}
              onPress={handleUpdate}
              disabled={
                updateMutation.isPending
              }
            >
              {updateMutation.isPending ? (
                <ActivityIndicator
                  color={colors.primary}
                />
              ) : (
                <Text
                  style={
                    styles.saveButtonText
                  }
                >
                  Salvar alterações
                </Text>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.cancelButton}
              onPress={handleCancelEdit}
              disabled={
                updateMutation.isPending
              }
            >
              <Text
                style={
                  styles.cancelButtonText
                }
              >
                Cancelar
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>

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
  },

  content: {
    padding: 24,
    paddingTop: 50,
    paddingBottom: 120,
  },

  centerContainer: {
    flex: 1,
    backgroundColor: colors.primary,
    padding: 24,
    alignItems: "center",
    justifyContent: "center",
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 24,
  },

  title: {
    color: colors.white,
    fontSize: 30,
    fontWeight: "800",
  },

  card: {
    backgroundColor: colors.white,
    borderRadius: 24,
    padding: 24,
  },

  iconBox: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: colors.mint,
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center",
    marginBottom: 16,
  },

  petName: {
    color: colors.primary,
    fontSize: 32,
    fontWeight: "800",
    marginBottom: 22,
    textAlign: "center",
  },

  infoRow: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 17,
  },

  infoLabel: {
    color: colors.gray,
    fontSize: 12,
    marginBottom: 2,
  },

  infoText: {
    color: colors.primary,
    fontSize: 16,
    fontWeight: "600",
  },

  editButton: {
    backgroundColor: colors.teal,
    padding: 16,
    borderRadius: 16,
    marginTop: 18,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: 8,
  },

  editButtonText: {
    color: colors.primary,
    fontSize: 16,
    fontWeight: "800",
  },

  editTitle: {
    color: colors.primary,
    fontSize: 23,
    fontWeight: "800",
    marginBottom: 20,
  },

  label: {
    color: colors.primary,
    fontSize: 14,
    fontWeight: "700",
    marginBottom: 7,
  },

  input: {
    backgroundColor: "#F5F5F5",
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 14,
    color: colors.primary,
    fontSize: 16,
    marginBottom: 15,
  },

  speciesContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 16,
  },

  speciesButton: {
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 12,
    backgroundColor: "#F3F3F3",
    borderWidth: 1,
    borderColor: "#E5E5E5",
  },

  speciesButtonSelected: {
    backgroundColor: colors.teal,
    borderColor: colors.teal,
  },

  speciesText: {
    color: colors.primary,
    fontWeight: "600",
    fontSize: 13,
  },

  speciesTextSelected: {
    color: colors.white,
  },

  saveButton: {
    backgroundColor: colors.teal,
    borderRadius: 16,
    padding: 16,
    alignItems: "center",
    marginTop: 8,
  },

  saveButtonText: {
    color: colors.primary,
    fontSize: 16,
    fontWeight: "800",
  },

  cancelButton: {
    borderWidth: 1,
    borderColor: colors.gray,
    borderRadius: 16,
    padding: 15,
    alignItems: "center",
    marginTop: 10,
  },

  cancelButtonText: {
    color: colors.primary,
    fontWeight: "700",
  },

  disabledButton: {
    opacity: 0.6,
  },

  formError: {
    color: "#C62828",
    marginBottom: 8,
  },

  loadingText: {
    color: colors.white,
    marginTop: 14,
  },

  errorTitle: {
    color: colors.white,
    fontSize: 20,
    fontWeight: "800",
    textAlign: "center",
  },

  errorText: {
    color: colors.mint,
    textAlign: "center",
    marginTop: 10,
  },

  mainButton: {
    backgroundColor: colors.teal,
    borderRadius: 14,
    paddingVertical: 14,
    paddingHorizontal: 30,
    marginTop: 20,
  },

  mainButtonText: {
    color: colors.primary,
    fontWeight: "800",
  },

  clinicCard: {
    backgroundColor: colors.mint,
    borderRadius: 20,
    padding: 18,
    marginTop: 18,
    flexDirection: "row",
    gap: 12,
  },

  clinicContent: {
    flex: 1,
  },

  clinicTitle: {
    color: colors.primary,
    fontSize: 16,
    fontWeight: "800",
  },

  clinicText: {
    color: colors.primary,
    fontSize: 13,
    lineHeight: 19,
    marginTop: 4,
  },
});