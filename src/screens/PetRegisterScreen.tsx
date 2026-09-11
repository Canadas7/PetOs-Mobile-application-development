import { useState } from "react";

import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Alert,
} from "react-native";

import { Ionicons } from "@expo/vector-icons";

import {
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

import colors from "../styles/colors";

import {
  createPet,
  Species,
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

export default function PetRegisterScreen({
  navigation,
}: any) {
  const { session } = useAuth();

  const queryClient = useQueryClient();

  const [name, setName] = useState("");
  const [species, setSpecies] =
    useState<Species>("DOG");

  const [breed, setBreed] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [weight, setWeight] = useState("");
  const [tutorPhone, setTutorPhone] = useState("");

  const [formError, setFormError] = useState("");

  const createMutation = useMutation({
    mutationFn: createPet,

    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["pets"],
      });

      Alert.alert(
        "Pet cadastrado",
        "O pet foi cadastrado com sucesso.",
        [
          {
            text: "OK",
            onPress: () =>
              navigation.navigate("PetsList"),
          },
        ]
      );
    },

    onError: (error: Error) => {
      setFormError(error.message);
    },
  });

  function validateDate(date: string) {
    const pattern = /^\d{4}-\d{2}-\d{2}$/;

    if (!pattern.test(date)) {
      return false;
    }

    const parsedDate = new Date(`${date}T00:00:00`);

    if (Number.isNaN(parsedDate.getTime())) {
      return false;
    }

    const today = new Date();

    return parsedDate < today;
  }

  function handleRegister() {
    setFormError("");

    if (session?.role !== "TUTOR") {
      setFormError(
        "Somente tutores podem cadastrar pets."
      );
      return;
    }

    if (!name.trim()) {
      setFormError("Digite o nome do pet.");
      return;
    }

    if (name.trim().length < 2) {
      setFormError(
        "O nome deve possuir pelo menos 2 caracteres."
      );
      return;
    }

    if (birthDate && !validateDate(birthDate)) {
      setFormError(
        "Informe a data no formato AAAA-MM-DD e use uma data anterior a hoje."
      );
      return;
    }

    if (weight) {
      const numericWeight = Number(
        weight.replace(",", ".")
      );

      if (
        Number.isNaN(numericWeight) ||
        numericWeight <= 0
      ) {
        setFormError(
          "Informe um peso válido e maior que zero."
        );
        return;
      }
    }

    if (tutorPhone.length > 20) {
      setFormError(
        "O telefone deve possuir no máximo 20 caracteres."
      );
      return;
    }

    if (!session?.name) {
      setFormError(
        "Não foi possível identificar o tutor."
      );
      return;
    }

    createMutation.mutate({
      name: name.trim(),
      species,

      breed: breed.trim()
        ? breed.trim()
        : undefined,

      birthDate: birthDate.trim()
        ? birthDate.trim()
        : undefined,

      weight: weight.trim()
        ? Number(weight.replace(",", "."))
        : undefined,

      tutorName: session.name,

      tutorPhone: tutorPhone.trim()
        ? tutorPhone.trim()
        : undefined,
    });
  }

  if (session?.role === "CLINICA") {
    return (
      <View style={styles.restrictedContainer}>
        <Ionicons
          name="lock-closed-outline"
          size={60}
          color={colors.teal}
        />

        <Text style={styles.restrictedTitle}>
          Cadastro indisponível
        </Text>

        <Text style={styles.restrictedText}>
          O cadastro de pets é uma funcionalidade
          exclusiva para tutores.
        </Text>

        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backButtonText}>
            Voltar
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      keyboardShouldPersistTaps="handled"
    >
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.headerBackButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons
            name="chevron-back"
            size={28}
            color={colors.white}
          />
        </TouchableOpacity>

        <View>
          <Text style={styles.title}>
            Cadastrar Pet
          </Text>

          <Text style={styles.subtitle}>
            Adicione as informações do seu pet.
          </Text>
        </View>
      </View>

      <View style={styles.card}>
        <Text style={styles.label}>
          Nome do pet *
        </Text>

        <TextInput
          style={styles.input}
          placeholder="Ex: Thor"
          placeholderTextColor={colors.gray}
          value={name}
          onChangeText={setName}
          maxLength={100}
        />

        <Text style={styles.label}>
          Espécie *
        </Text>

        <View style={styles.speciesContainer}>
          {speciesOptions.map((option) => (
            <TouchableOpacity
              key={option.value}
              style={[
                styles.speciesButton,
                species === option.value &&
                  styles.speciesButtonSelected,
              ]}
              onPress={() =>
                setSpecies(option.value)
              }
            >
              <Text
                style={[
                  styles.speciesText,
                  species === option.value &&
                    styles.speciesTextSelected,
                ]}
              >
                {option.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.label}>
          Raça
        </Text>

        <TextInput
          style={styles.input}
          placeholder="Ex: Golden Retriever"
          placeholderTextColor={colors.gray}
          value={breed}
          onChangeText={setBreed}
          maxLength={100}
        />

        <Text style={styles.label}>
          Data de nascimento
        </Text>

        <TextInput
          style={styles.input}
          placeholder="AAAA-MM-DD"
          placeholderTextColor={colors.gray}
          value={birthDate}
          onChangeText={setBirthDate}
          keyboardType="numbers-and-punctuation"
        />

        <Text style={styles.helper}>
          Exemplo: 2022-08-15
        </Text>

        <Text style={styles.label}>
          Peso (kg)
        </Text>

        <TextInput
          style={styles.input}
          placeholder="Ex: 12,5"
          placeholderTextColor={colors.gray}
          value={weight}
          onChangeText={setWeight}
          keyboardType="decimal-pad"
        />

        <Text style={styles.label}>
          Tutor responsável
        </Text>

        <View style={styles.readOnlyInput}>
          <Ionicons
            name="person-outline"
            size={20}
            color={colors.teal}
          />

          <Text style={styles.readOnlyText}>
            {session?.name}
          </Text>
        </View>

        <Text style={styles.label}>
          Telefone do tutor
        </Text>

        <TextInput
          style={styles.input}
          placeholder="Ex: (11) 99999-9999"
          placeholderTextColor={colors.gray}
          value={tutorPhone}
          onChangeText={setTutorPhone}
          keyboardType="phone-pad"
          maxLength={20}
        />

        {formError ? (
          <View style={styles.errorContainer}>
            <Ionicons
              name="alert-circle-outline"
              size={20}
              color="#C62828"
            />

            <Text style={styles.error}>
              {formError}
            </Text>
          </View>
        ) : null}

        <TouchableOpacity
          style={[
            styles.registerButton,
            createMutation.isPending &&
              styles.disabledButton,
          ]}
          onPress={handleRegister}
          disabled={createMutation.isPending}
        >
          {createMutation.isPending ? (
            <ActivityIndicator
              color={colors.primary}
            />
          ) : (
            <>
              <Ionicons
                name="paw-outline"
                size={21}
                color={colors.primary}
              />

              <Text style={styles.registerButtonText}>
                Cadastrar Pet
              </Text>
            </>
          )}
        </TouchableOpacity>
      </View>
    </ScrollView>
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
    paddingBottom: 50,
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 24,
  },

  headerBackButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 8,
  },

  title: {
    color: colors.white,
    fontSize: 28,
    fontWeight: "800",
  },

  subtitle: {
    color: colors.mint,
    fontSize: 14,
    marginTop: 4,
  },

  card: {
    backgroundColor: colors.white,
    borderRadius: 24,
    padding: 20,
  },

  label: {
    color: colors.primary,
    fontSize: 14,
    fontWeight: "700",
    marginBottom: 8,
    marginTop: 6,
  },

  input: {
    backgroundColor: "#F5F5F5",
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    color: colors.primary,
    marginBottom: 14,
  },

  helper: {
    color: colors.gray,
    fontSize: 12,
    marginTop: -8,
    marginBottom: 14,
  },

  speciesContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 16,
  },

  speciesButton: {
    paddingVertical: 10,
    paddingHorizontal: 13,
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

  readOnlyInput: {
    backgroundColor: "#F5F5F5",
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 14,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 14,
  },

  readOnlyText: {
    color: colors.primary,
    fontSize: 16,
    fontWeight: "600",
  },

  errorContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: "#FFEBEE",
    padding: 12,
    borderRadius: 12,
    marginTop: 4,
    marginBottom: 14,
  },

  error: {
    color: "#C62828",
    flex: 1,
    fontSize: 13,
  },

  registerButton: {
    backgroundColor: colors.teal,
    borderRadius: 16,
    padding: 16,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: 8,
    marginTop: 6,
  },

  registerButtonText: {
    color: colors.primary,
    fontSize: 16,
    fontWeight: "800",
  },

  disabledButton: {
    opacity: 0.6,
  },

  restrictedContainer: {
    flex: 1,
    backgroundColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
    padding: 30,
  },

  restrictedTitle: {
    color: colors.white,
    fontSize: 26,
    fontWeight: "800",
    marginTop: 18,
  },

  restrictedText: {
    color: colors.mint,
    textAlign: "center",
    fontSize: 15,
    lineHeight: 22,
    marginTop: 10,
    marginBottom: 24,
  },

  backButton: {
    backgroundColor: colors.teal,
    paddingVertical: 14,
    paddingHorizontal: 30,
    borderRadius: 14,
  },

  backButtonText: {
    color: colors.primary,
    fontSize: 15,
    fontWeight: "800",
  },
});