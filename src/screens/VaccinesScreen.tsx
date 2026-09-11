import { useEffect, useState } from "react";

import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  TextInput,
  ActivityIndicator,
  Alert,
} from "react-native";

import { Ionicons } from "@expo/vector-icons";

import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import colors from "../styles/colors";

import BottomNavigation from "../components/BottomNavigation";

import { getPets } from "../services/petService";

import {
  createVaccine,
  deleteVaccine,
  getVaccinesByPet,
  updateVaccine,
  VaccineResponse,
  VaccineStatus,
} from "../services/vaccineService";

import { useAuth } from "../contexts/AuthContext";

export default function VaccinesScreen({
  navigation,
}: any) {
  const { session } = useAuth();

  const queryClient = useQueryClient();

  const [selectedPetId, setSelectedPetId] =
    useState<number | null>(null);

  const [editingVaccine, setEditingVaccine] =
    useState<VaccineResponse | null>(null);

  const [name, setName] = useState("");
  const [applicationDate, setApplicationDate] =
    useState("");
  const [dueDate, setDueDate] = useState("");

  const [formError, setFormError] = useState("");

  const {
    data: pets = [],
    isLoading: petsLoading,
  } = useQuery({
    queryKey: [
      "pets",
      session?.role,
      session?.email,
    ],
    queryFn: getPets,
    enabled: session?.role === "CLINICA",
  });

  useEffect(() => {
    if (
      pets.length > 0 &&
      selectedPetId === null
    ) {
      setSelectedPetId(pets[0].id);
    }
  }, [pets, selectedPetId]);

  const {
    data: vaccines = [],
    isLoading: vaccinesLoading,
    isError: vaccinesError,
    refetch,
  } = useQuery({
    queryKey: [
      "vaccines",
      selectedPetId,
    ],

    queryFn: () =>
      getVaccinesByPet(selectedPetId!),

    enabled:
      session?.role === "CLINICA" &&
      selectedPetId !== null,
  });

  const createMutation = useMutation({
    mutationFn: createVaccine,

    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: [
          "vaccines",
          selectedPetId,
        ],
      });

      await queryClient.invalidateQueries({
        queryKey: ["alerts"],
      });

      clearForm();

      Alert.alert(
        "Vacina cadastrada",
        "A vacina foi registrada com sucesso."
      );
    },

    onError: (error: Error) => {
      setFormError(error.message);
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: number;
      data: {
        petId: number;
        name: string;
        applicationDate?: string;
        dueDate?: string;
      };
    }) => updateVaccine(id, data),

    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: [
          "vaccines",
          selectedPetId,
        ],
      });

      await queryClient.invalidateQueries({
        queryKey: ["alerts"],
      });

      clearForm();

      Alert.alert(
        "Vacina atualizada",
        "As informações foram atualizadas."
      );
    },

    onError: (error: Error) => {
      setFormError(error.message);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteVaccine,

    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: [
          "vaccines",
          selectedPetId,
        ],
      });

      await queryClient.invalidateQueries({
        queryKey: ["alerts"],
      });
    },

    onError: (error: Error) => {
      Alert.alert(
        "Erro ao excluir",
        error.message
      );
    },
  });

  function clearForm() {
    setName("");
    setApplicationDate("");
    setDueDate("");
    setEditingVaccine(null);
    setFormError("");
  }

  function startEditing(
    vaccine: VaccineResponse
  ) {
    setEditingVaccine(vaccine);

    setName(vaccine.name);

    setApplicationDate(
      vaccine.applicationDate || ""
    );

    setDueDate(
      vaccine.dueDate || ""
    );

    setFormError("");
  }

  function validateDate(date: string) {
    if (!date) {
      return true;
    }

    return /^\d{4}-\d{2}-\d{2}$/.test(
      date
    );
  }

  function handleSave() {
    setFormError("");

    if (session?.role !== "CLINICA") {
      return;
    }

    if (!selectedPetId) {
      setFormError(
        "Selecione um pet."
      );
      return;
    }

    if (!name.trim()) {
      setFormError(
        "Digite o nome da vacina."
      );
      return;
    }

    if (
      applicationDate &&
      !validateDate(applicationDate)
    ) {
      setFormError(
        "Use AAAA-MM-DD na data de aplicação."
      );
      return;
    }

    if (
      dueDate &&
      !validateDate(dueDate)
    ) {
      setFormError(
        "Use AAAA-MM-DD no vencimento."
      );
      return;
    }

    if (
      applicationDate &&
      dueDate &&
      new Date(dueDate) <
        new Date(applicationDate)
    ) {
      setFormError(
        "O vencimento não pode ser anterior à aplicação."
      );
      return;
    }

    const data = {
      petId: selectedPetId,
      name: name.trim(),

      applicationDate:
        applicationDate.trim()
          ? applicationDate.trim()
          : undefined,

      dueDate: dueDate.trim()
        ? dueDate.trim()
        : undefined,
    };

    if (editingVaccine) {
      updateMutation.mutate({
        id: editingVaccine.id,
        data,
      });

      return;
    }

    createMutation.mutate(data);
  }

  function handleDelete(
    vaccine: VaccineResponse
  ) {
    Alert.alert(
      "Excluir vacina",
      `Deseja excluir ${vaccine.name}?`,
      [
        {
          text: "Cancelar",
          style: "cancel",
        },
        {
          text: "Excluir",
          style: "destructive",

          onPress: () =>
            deleteMutation.mutate(
              vaccine.id
            ),
        },
      ]
    );
  }

  function getStatusLabel(
    status: VaccineStatus
  ) {
    const labels: Record<
      VaccineStatus,
      string
    > = {
      PENDING: "Pendente",
      APPLIED: "Aplicada",
      EXPIRING_SOON:
        "Próxima do vencimento",
      OVERDUE: "Vencida",
    };

    return labels[status];
  }

  function formatDate(
    date: string | null
  ) {
    if (!date) {
      return "Não informada";
    }

    const [year, month, day] =
      date.split("-");

    return `${day}/${month}/${year}`;
  }

  if (session?.role !== "CLINICA") {
    return (
      <View style={styles.restricted}>
        <Ionicons
          name="lock-closed-outline"
          size={58}
          color={colors.teal}
        />

        <Text
          style={styles.restrictedTitle}
        >
          Área da Clínica
        </Text>

        <Text
          style={styles.restrictedText}
        >
          O gerenciamento de vacinas é
          exclusivo para clínicas
          veterinárias.
        </Text>

        <BottomNavigation
          navigation={navigation}
          current="Vaccines"
        />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={
          styles.content
        }
        keyboardShouldPersistTaps="handled"
      >
        <Text style={styles.title}>
          Vacinas
        </Text>

        <Text style={styles.subtitle}>
          Gerencie a vacinação dos pets
          cadastrados.
        </Text>

        <Text style={styles.sectionTitle}>
          Selecione o pet
        </Text>

        {petsLoading ? (
          <ActivityIndicator
            color={colors.teal}
          />
        ) : (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={
              false
            }
            style={styles.petSelector}
          >
            {pets.map((pet) => {
              const selected =
                selectedPetId === pet.id;

              return (
                <TouchableOpacity
                  key={pet.id}
                  style={[
                    styles.petButton,
                    selected &&
                      styles.petButtonSelected,
                  ]}
                  onPress={() => {
                    setSelectedPetId(
                      pet.id
                    );

                    clearForm();
                  }}
                >
                  <Ionicons
                    name="paw-outline"
                    size={18}
                    color={
                      selected
                        ? colors.primary
                        : colors.teal
                    }
                  />

                  <Text
                    style={[
                      styles.petButtonText,
                      selected &&
                        styles.petButtonTextSelected,
                    ]}
                  >
                    {pet.name}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        )}

        {selectedPetId && (
          <>
            <View style={styles.formCard}>
              <Text style={styles.formTitle}>
                {editingVaccine
                  ? "Editar vacina"
                  : "Registrar vacina"}
              </Text>

              <Text style={styles.label}>
                Nome da vacina *
              </Text>

              <TextInput
                style={styles.input}
                placeholder="Ex: V10"
                placeholderTextColor={
                  colors.gray
                }
                value={name}
                onChangeText={setName}
              />

              <Text style={styles.label}>
                Data de aplicação
              </Text>

              <TextInput
                style={styles.input}
                placeholder="AAAA-MM-DD"
                placeholderTextColor={
                  colors.gray
                }
                value={applicationDate}
                onChangeText={
                  setApplicationDate
                }
                keyboardType="numbers-and-punctuation"
              />

              <Text style={styles.label}>
                Data de vencimento
              </Text>

              <TextInput
                style={styles.input}
                placeholder="AAAA-MM-DD"
                placeholderTextColor={
                  colors.gray
                }
                value={dueDate}
                onChangeText={setDueDate}
                keyboardType="numbers-and-punctuation"
              />

              {formError ? (
                <Text
                  style={styles.formError}
                >
                  {formError}
                </Text>
              ) : null}

              <TouchableOpacity
                style={[
                  styles.saveButton,
                  (createMutation.isPending ||
                    updateMutation.isPending) &&
                    styles.disabledButton,
                ]}
                onPress={handleSave}
                disabled={
                  createMutation.isPending ||
                  updateMutation.isPending
                }
              >
                {createMutation.isPending ||
                updateMutation.isPending ? (
                  <ActivityIndicator
                    color={colors.primary}
                  />
                ) : (
                  <Text
                    style={
                      styles.saveButtonText
                    }
                  >
                    {editingVaccine
                      ? "Salvar alterações"
                      : "Registrar vacina"}
                  </Text>
                )}
              </TouchableOpacity>

              {editingVaccine && (
                <TouchableOpacity
                  style={styles.cancelButton}
                  onPress={clearForm}
                >
                  <Text
                    style={
                      styles.cancelButtonText
                    }
                  >
                    Cancelar edição
                  </Text>
                </TouchableOpacity>
              )}
            </View>

            <Text
              style={
                styles.vaccinesTitle
              }
            >
              Vacinas registradas
            </Text>

            {vaccinesLoading ? (
              <View style={styles.loading}>
                <ActivityIndicator
                  size="large"
                  color={colors.teal}
                />

                <Text
                  style={
                    styles.loadingText
                  }
                >
                  Carregando vacinas...
                </Text>
              </View>
            ) : vaccinesError ? (
              <View style={styles.emptyCard}>
                <Ionicons
                  name="alert-circle-outline"
                  size={40}
                  color={colors.teal}
                />

                <Text
                  style={
                    styles.emptyTitle
                  }
                >
                  Não foi possível carregar
                  as vacinas.
                </Text>

                <TouchableOpacity
                  style={styles.retryButton}
                  onPress={() =>
                    refetch()
                  }
                >
                  <Text
                    style={
                      styles.retryText
                    }
                  >
                    Tentar novamente
                  </Text>
                </TouchableOpacity>
              </View>
            ) : vaccines.length === 0 ? (
              <View style={styles.emptyCard}>
                <Ionicons
                  name="medical-outline"
                  size={42}
                  color={colors.teal}
                />

                <Text
                  style={
                    styles.emptyTitle
                  }
                >
                  Nenhuma vacina registrada
                </Text>

                <Text
                  style={
                    styles.emptyText
                  }
                >
                  Utilize o formulário acima
                  para registrar a primeira
                  vacina deste pet.
                </Text>
              </View>
            ) : (
              vaccines.map((vaccine) => (
                <View
                  key={vaccine.id}
                  style={styles.vaccineCard}
                >
                  <View
                    style={
                      styles.vaccineHeader
                    }
                  >
                    <View
                      style={
                        styles.vaccineIcon
                      }
                    >
                      <Ionicons
                        name="medical"
                        size={24}
                        color={colors.white}
                      />
                    </View>

                    <View
                      style={
                        styles.vaccineMain
                      }
                    >
                      <Text
                        style={
                          styles.vaccineName
                        }
                      >
                        {vaccine.name}
                      </Text>

                      <Text
                        style={
                          styles.vaccineStatus
                        }
                      >
                        {getStatusLabel(
                          vaccine.status
                        )}
                      </Text>
                    </View>
                  </View>

                  <View
                    style={
                      styles.dateSection
                    }
                  >
                    <View>
                      <Text
                        style={
                          styles.dateLabel
                        }
                      >
                        Aplicação
                      </Text>

                      <Text
                        style={
                          styles.dateValue
                        }
                      >
                        {formatDate(
                          vaccine.applicationDate
                        )}
                      </Text>
                    </View>

                    <View>
                      <Text
                        style={
                          styles.dateLabel
                        }
                      >
                        Vencimento
                      </Text>

                      <Text
                        style={
                          styles.dateValue
                        }
                      >
                        {formatDate(
                          vaccine.dueDate
                        )}
                      </Text>
                    </View>
                  </View>

                  <View
                    style={
                      styles.actions
                    }
                  >
                    <TouchableOpacity
                      style={
                        styles.editButton
                      }
                      onPress={() =>
                        startEditing(
                          vaccine
                        )
                      }
                    >
                      <Ionicons
                        name="create-outline"
                        size={18}
                        color={
                          colors.primary
                        }
                      />

                      <Text
                        style={
                          styles.editButtonText
                        }
                      >
                        Editar
                      </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={
                        styles.deleteButton
                      }
                      onPress={() =>
                        handleDelete(
                          vaccine
                        )
                      }
                    >
                      <Ionicons
                        name="trash-outline"
                        size={18}
                        color={colors.white}
                      />

                      <Text
                        style={
                          styles.deleteButtonText
                        }
                      >
                        Excluir
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              ))
            )}
          </>
        )}
      </ScrollView>

      <BottomNavigation
        navigation={navigation}
        current="Vaccines"
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

  sectionTitle: {
    color: colors.white,
    fontSize: 14,
    fontWeight: "700",
    marginBottom: 10,
  },

  petSelector: {
    marginBottom: 22,
  },

  petButton: {
    backgroundColor: colors.white,
    borderRadius: 14,
    paddingVertical: 11,
    paddingHorizontal: 14,
    marginRight: 10,
    flexDirection: "row",
    alignItems: "center",
    gap: 7,
  },

  petButtonSelected: {
    backgroundColor: colors.teal,
  },

  petButtonText: {
    color: colors.primary,
    fontWeight: "700",
  },

  petButtonTextSelected: {
    color: colors.primary,
  },

  formCard: {
    backgroundColor: colors.white,
    borderRadius: 22,
    padding: 20,
  },

  formTitle: {
    color: colors.primary,
    fontSize: 21,
    fontWeight: "800",
    marginBottom: 18,
  },

  label: {
    color: colors.primary,
    fontSize: 13,
    fontWeight: "700",
    marginBottom: 7,
  },

  input: {
    backgroundColor: "#F5F5F5",
    borderRadius: 14,
    paddingHorizontal: 15,
    paddingVertical: 13,
    color: colors.primary,
    fontSize: 15,
    marginBottom: 14,
  },

  formError: {
    color: "#C62828",
    fontSize: 13,
    marginBottom: 10,
  },

  saveButton: {
    backgroundColor: colors.teal,
    borderRadius: 15,
    padding: 15,
    alignItems: "center",
    marginTop: 4,
  },

  saveButtonText: {
    color: colors.primary,
    fontSize: 15,
    fontWeight: "800",
  },

  cancelButton: {
    borderWidth: 1,
    borderColor: colors.gray,
    borderRadius: 15,
    padding: 13,
    alignItems: "center",
    marginTop: 9,
  },

  cancelButtonText: {
    color: colors.primary,
    fontWeight: "700",
  },

  disabledButton: {
    opacity: 0.6,
  },

  vaccinesTitle: {
    color: colors.white,
    fontSize: 20,
    fontWeight: "800",
    marginTop: 28,
    marginBottom: 14,
  },

  vaccineCard: {
    backgroundColor: colors.white,
    borderRadius: 20,
    padding: 18,
    marginBottom: 14,
  },

  vaccineHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },

  vaccineIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.teal,
    alignItems: "center",
    justifyContent: "center",
  },

  vaccineMain: {
    flex: 1,
  },

  vaccineName: {
    color: colors.primary,
    fontSize: 18,
    fontWeight: "800",
  },

  vaccineStatus: {
    color: colors.teal,
    fontSize: 13,
    fontWeight: "700",
    marginTop: 3,
  },

  dateSection: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "#F7F7F7",
    borderRadius: 13,
    padding: 13,
    marginTop: 16,
  },

  dateLabel: {
    color: colors.gray,
    fontSize: 11,
  },

  dateValue: {
    color: colors.primary,
    fontSize: 13,
    fontWeight: "700",
    marginTop: 3,
  },

  actions: {
    flexDirection: "row",
    gap: 10,
    marginTop: 14,
  },

  editButton: {
    flex: 1,
    backgroundColor: colors.mint,
    borderRadius: 12,
    padding: 11,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 5,
  },

  editButtonText: {
    color: colors.primary,
    fontWeight: "800",
  },

  deleteButton: {
    flex: 1,
    backgroundColor: colors.danger,
    borderRadius: 12,
    padding: 11,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 5,
  },

  deleteButtonText: {
    color: colors.white,
    fontWeight: "800",
  },

  emptyCard: {
    backgroundColor: colors.white,
    borderRadius: 20,
    padding: 26,
    alignItems: "center",
  },

  emptyTitle: {
    color: colors.primary,
    fontSize: 17,
    fontWeight: "800",
    marginTop: 10,
    textAlign: "center",
  },

  emptyText: {
    color: colors.gray,
    textAlign: "center",
    marginTop: 7,
    lineHeight: 19,
  },

  loading: {
    padding: 30,
    alignItems: "center",
  },

  loadingText: {
    color: colors.white,
    marginTop: 10,
  },

  retryButton: {
    backgroundColor: colors.teal,
    paddingVertical: 11,
    paddingHorizontal: 20,
    borderRadius: 12,
    marginTop: 14,
  },

  retryText: {
    color: colors.primary,
    fontWeight: "800",
  },

  restricted: {
    flex: 1,
    backgroundColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
    padding: 30,
    paddingBottom: 110,
  },

  restrictedTitle: {
    color: colors.white,
    fontSize: 25,
    fontWeight: "800",
    marginTop: 14,
  },

  restrictedText: {
    color: colors.mint,
    textAlign: "center",
    marginTop: 8,
    lineHeight: 20,
  },
});