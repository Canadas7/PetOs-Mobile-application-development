import { useEffect, useMemo, useState } from "react";

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

import { getPets } from "../services/petService";

import {
  createRoutine,
  deleteRoutine,
  getRoutinesByPet,
  RoutineResponse,
  RoutineType,
  updateRoutine,
} from "../services/routineService";

import { getPetHistory } from "../services/historyService";

import { useAuth } from "../contexts/AuthContext";

type ScreenTab = "CARE" | "HISTORY";

const routineOptions: {
  label: string;
  value: RoutineType;
  icon: keyof typeof Ionicons.glyphMap;
}[] = [
  {
    label: "Passeio",
    value: "WALK",
    icon: "walk-outline",
  },
  {
    label: "Alimentação",
    value: "FEEDING",
    icon: "restaurant-outline",
  },
  {
    label: "Medicamento",
    value: "MEDICATION",
    icon: "medical-outline",
  },
  {
    label: "Banho",
    value: "BATHING",
    icon: "water-outline",
  },
  {
    label: "Higiene",
    value: "GROOMING",
    icon: "sparkles-outline",
  },
  {
    label: "Veterinário",
    value: "VET_VISIT",
    icon: "medkit-outline",
  },
  {
    label: "Treinamento",
    value: "TRAINING",
    icon: "school-outline",
  },
  {
    label: "Outro",
    value: "OTHER",
    icon: "ellipsis-horizontal-outline",
  },
];

function getToday() {
  const today = new Date();

  const year = today.getFullYear();
  const month = String(
    today.getMonth() + 1
  ).padStart(2, "0");

  const day = String(
    today.getDate()
  ).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

export default function HistoryScreen({
  navigation,
}: any) {
  const { session } = useAuth();

  const queryClient = useQueryClient();

  const [tab, setTab] =
    useState<ScreenTab>("CARE");

  const [selectedPetId, setSelectedPetId] =
    useState<number | null>(null);

  const [editingRoutine, setEditingRoutine] =
    useState<RoutineResponse | null>(null);

  const [routineType, setRoutineType] =
    useState<RoutineType>("WALK");

  const [description, setDescription] =
    useState("");

  const [recordDate, setRecordDate] =
    useState(getToday());

  const [formError, setFormError] =
    useState("");

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
    enabled: session?.role === "TUTOR",
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
    data: routines = [],
    isLoading: routinesLoading,
    isError: routinesError,
    refetch: refetchRoutines,
  } = useQuery({
    queryKey: [
      "routines",
      selectedPetId,
    ],

    queryFn: () =>
      getRoutinesByPet(selectedPetId!),

    enabled:
      session?.role === "TUTOR" &&
      selectedPetId !== null,
  });

  const {
    data: history,
    isLoading: historyLoading,
    isError: historyError,
    refetch: refetchHistory,
  } = useQuery({
    queryKey: [
      "pet-history",
      selectedPetId,
    ],

    queryFn: () =>
      getPetHistory(selectedPetId!),

    enabled:
      session?.role === "TUTOR" &&
      selectedPetId !== null &&
      tab === "HISTORY",
  });

  const createMutation = useMutation({
    mutationFn: createRoutine,

    onSuccess: async () => {
      await refreshData();

      clearForm();

      Alert.alert(
        "Cuidado registrado",
        "O cuidado foi salvo no histórico do pet."
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
        type: RoutineType;
        description?: string;
        recordDate: string;
      };
    }) => updateRoutine(id, data),

    onSuccess: async () => {
      await refreshData();

      clearForm();

      Alert.alert(
        "Cuidado atualizado",
        "As informações foram atualizadas."
      );
    },

    onError: (error: Error) => {
      setFormError(error.message);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteRoutine,

    onSuccess: async () => {
      await refreshData();
    },

    onError: (error: Error) => {
      Alert.alert(
        "Erro ao excluir",
        error.message
      );
    },
  });

  async function refreshData() {
    await queryClient.invalidateQueries({
      queryKey: [
        "routines",
        selectedPetId,
      ],
    });

    await queryClient.invalidateQueries({
      queryKey: [
        "pet-history",
        selectedPetId,
      ],
    });
  }

  function clearForm() {
    setEditingRoutine(null);
    setRoutineType("WALK");
    setDescription("");
    setRecordDate(getToday());
    setFormError("");
  }

  function startEditing(
    routine: RoutineResponse
  ) {
    setEditingRoutine(routine);
    setRoutineType(routine.type);
    setDescription(
      routine.description || ""
    );
    setRecordDate(routine.recordDate);
    setFormError("");
  }

  function validateDate(date: string) {
    const pattern =
      /^\d{4}-\d{2}-\d{2}$/;

    if (!pattern.test(date)) {
      return false;
    }

    const parsed = new Date(
      `${date}T00:00:00`
    );

    if (
      Number.isNaN(parsed.getTime())
    ) {
      return false;
    }

    const today = new Date();

    today.setHours(23, 59, 59, 999);

    return parsed <= today;
  }

  function handleSave() {
    setFormError("");

    if (!selectedPetId) {
      setFormError(
        "Selecione um pet."
      );
      return;
    }

    if (!recordDate) {
      setFormError(
        "Informe a data do cuidado."
      );
      return;
    }

    if (!validateDate(recordDate)) {
      setFormError(
        "Informe uma data válida no formato AAAA-MM-DD. A data não pode estar no futuro."
      );

      return;
    }

    if (description.length > 500) {
      setFormError(
        "A descrição deve possuir no máximo 500 caracteres."
      );

      return;
    }

    const data = {
      petId: selectedPetId,
      type: routineType,

      description:
        description.trim()
          ? description.trim()
          : undefined,

      recordDate,
    };

    if (editingRoutine) {
      updateMutation.mutate({
        id: editingRoutine.id,
        data,
      });

      return;
    }

    createMutation.mutate(data);
  }

  function handleDelete(
    routine: RoutineResponse
  ) {
    Alert.alert(
      "Excluir cuidado",
      "Deseja realmente remover este registro?",
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
              routine.id
            ),
        },
      ]
    );
  }

  function getRoutineLabel(
    type: RoutineType
  ) {
    return (
      routineOptions.find(
        (option) =>
          option.value === type
      )?.label || "Cuidado"
    );
  }

  function getRoutineIcon(
    type: RoutineType
  ) {
    return (
      routineOptions.find(
        (option) =>
          option.value === type
      )?.icon || "heart-outline"
    );
  }

  function formatDate(date: string) {
    const dateOnly =
      date.split("T")[0];

    const [year, month, day] =
      dateOnly.split("-");

    return `${day}/${month}/${year}`;
  }

  const timeline = useMemo(() => {
    if (!history) {
      return [];
    }

    const items: {
      id: string;
      type:
        | "VACCINE"
        | "ROUTINE"
        | "ALERT";
      title: string;
      description: string;
      date: string;
    }[] = [];

    history.vaccines.forEach(
      (vaccine) => {
        items.push({
          id: `vaccine-${vaccine.id}`,
          type: "VACCINE",
          title: `Vacina ${vaccine.name}`,
          description:
            vaccine.status,
          date:
            vaccine.applicationDate ||
            vaccine.dueDate ||
            "",
        });
      }
    );

    history.routines.forEach(
      (routine) => {
        items.push({
          id: `routine-${routine.id}`,
          type: "ROUTINE",
          title: getRoutineLabel(
            routine.type
          ),
          description:
            routine.description ||
            "Cuidado registrado",
          date: routine.recordDate,
        });
      }
    );

    history.alerts.forEach(
      (alert) => {
        items.push({
          id: `alert-${alert.id}`,
          type: "ALERT",
          title:
            "Aviso da clínica veterinária",
          description:
            alert.message,
          date:
            alert.dueDate ||
            alert.createdAt,
        });
      }
    );

    return items.sort(
      (a, b) =>
        new Date(b.date).getTime() -
        new Date(a.date).getTime()
    );
  }, [history]);

  if (session?.role !== "TUTOR") {
    return (
      <View style={styles.restricted}>
        <Ionicons
          name="lock-closed-outline"
          size={56}
          color={colors.teal}
        />

        <Text style={styles.restrictedTitle}>
          Área do Tutor
        </Text>

        <Text style={styles.restrictedText}>
          Os cuidados são registrados pelo tutor responsável pelo pet.
        </Text>
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
          Cuidados
        </Text>

        <Text style={styles.subtitle}>
          Registre a rotina e acompanhe o histórico de saúde dos seus pets.
        </Text>

        <View style={styles.tabs}>
          <TouchableOpacity
            style={[
              styles.tab,
              tab === "CARE" &&
                styles.tabSelected,
            ]}
            onPress={() =>
              setTab("CARE")
            }
          >
            <Ionicons
              name="heart-outline"
              size={18}
              color={
                tab === "CARE"
                  ? colors.primary
                  : colors.white
              }
            />

            <Text
              style={[
                styles.tabText,
                tab === "CARE" &&
                  styles.tabTextSelected,
              ]}
            >
              Cuidados
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.tab,
              tab === "HISTORY" &&
                styles.tabSelected,
            ]}
            onPress={() =>
              setTab("HISTORY")
            }
          >
            <Ionicons
              name="time-outline"
              size={18}
              color={
                tab === "HISTORY"
                  ? colors.primary
                  : colors.white
              }
            />

            <Text
              style={[
                styles.tabText,
                tab === "HISTORY" &&
                  styles.tabTextSelected,
              ]}
            >
              Histórico
            </Text>
          </TouchableOpacity>
        </View>

        {petsLoading ? (
          <ActivityIndicator
            size="large"
            color={colors.teal}
          />
        ) : pets.length === 0 ? (
          <View style={styles.emptyCard}>
            <MaterialIcons
              name="pets"
              size={42}
              color={colors.teal}
            />

            <Text style={styles.emptyTitle}>
              Nenhum pet cadastrado
            </Text>
          </View>
        ) : (
          <>
            <Text style={styles.labelWhite}>
              Selecione o pet
            </Text>

            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={
                false
              }
              style={styles.petSelector}
            >
              {pets.map((pet) => {
                const selected =
                  pet.id ===
                  selectedPetId;

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
                    <MaterialIcons
                      name="pets"
                      size={18}
                      color={
                        selected
                          ? colors.primary
                          : colors.teal
                      }
                    />

                    <Text
                      style={
                        styles.petButtonText
                      }
                    >
                      {pet.name}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>

            {tab === "CARE" ? (
              <>
                <View
                  style={styles.formCard}
                >
                  <Text
                    style={
                      styles.formTitle
                    }
                  >
                    {editingRoutine
                      ? "Editar cuidado"
                      : "Registrar cuidado"}
                  </Text>

                  <Text
                    style={styles.label}
                  >
                    Tipo de cuidado
                  </Text>

                  <View
                    style={
                      styles.typesContainer
                    }
                  >
                    {routineOptions.map(
                      (option) => {
                        const selected =
                          routineType ===
                          option.value;

                        return (
                          <TouchableOpacity
                            key={
                              option.value
                            }
                            style={[
                              styles.typeButton,
                              selected &&
                                styles.typeButtonSelected,
                            ]}
                            onPress={() =>
                              setRoutineType(
                                option.value
                              )
                            }
                          >
                            <Ionicons
                              name={
                                option.icon
                              }
                              size={19}
                              color={
                                selected
                                  ? colors.primary
                                  : colors.teal
                              }
                            />

                            <Text
                              style={
                                styles.typeText
                              }
                            >
                              {
                                option.label
                              }
                            </Text>
                          </TouchableOpacity>
                        );
                      }
                    )}
                  </View>

                  <Text
                    style={styles.label}
                  >
                    Descrição
                  </Text>

                  <TextInput
                    style={[
                      styles.input,
                      styles.descriptionInput,
                    ]}
                    placeholder="Ex: Passeio de 30 minutos no parque"
                    placeholderTextColor={
                      colors.gray
                    }
                    multiline
                    maxLength={500}
                    value={description}
                    onChangeText={
                      setDescription
                    }
                  />

                  <Text
                    style={styles.label}
                  >
                    Data
                  </Text>

                  <TextInput
                    style={styles.input}
                    placeholder="AAAA-MM-DD"
                    placeholderTextColor={
                      colors.gray
                    }
                    value={recordDate}
                    onChangeText={
                      setRecordDate
                    }
                  />

                  {formError ? (
                    <Text
                      style={
                        styles.formError
                      }
                    >
                      {formError}
                    </Text>
                  ) : null}

                  <TouchableOpacity
                    style={
                      styles.saveButton
                    }
                    onPress={handleSave}
                    disabled={
                      createMutation.isPending ||
                      updateMutation.isPending
                    }
                  >
                    {createMutation.isPending ||
                    updateMutation.isPending ? (
                      <ActivityIndicator
                        color={
                          colors.primary
                        }
                      />
                    ) : (
                      <Text
                        style={
                          styles.saveButtonText
                        }
                      >
                        {editingRoutine
                          ? "Salvar alterações"
                          : "Registrar cuidado"}
                      </Text>
                    )}
                  </TouchableOpacity>

                  {editingRoutine && (
                    <TouchableOpacity
                      style={
                        styles.cancelButton
                      }
                      onPress={clearForm}
                    >
                      <Text
                        style={
                          styles.cancelText
                        }
                      >
                        Cancelar edição
                      </Text>
                    </TouchableOpacity>
                  )}
                </View>

                <Text
                  style={
                    styles.sectionTitle
                  }
                >
                  Cuidados registrados
                </Text>

                {routinesLoading ? (
                  <ActivityIndicator
                    color={colors.teal}
                  />
                ) : routinesError ? (
                  <TouchableOpacity
                    onPress={() =>
                      refetchRoutines()
                    }
                  >
                    <Text
                      style={
                        styles.errorText
                      }
                    >
                      Erro ao carregar. Toque para tentar novamente.
                    </Text>
                  </TouchableOpacity>
                ) : routines.length ===
                  0 ? (
                  <View
                    style={
                      styles.emptyCard
                    }
                  >
                    <Ionicons
                      name="heart-outline"
                      size={38}
                      color={colors.teal}
                    />

                    <Text
                      style={
                        styles.emptyTitle
                      }
                    >
                      Nenhum cuidado registrado
                    </Text>
                  </View>
                ) : (
                  routines.map(
                    (routine) => (
                      <View
                        key={routine.id}
                        style={
                          styles.routineCard
                        }
                      >
                        <View
                          style={
                            styles.routineIcon
                          }
                        >
                          <Ionicons
                            name={
                              getRoutineIcon(
                                routine.type
                              )
                            }
                            size={23}
                            color={
                              colors.white
                            }
                          />
                        </View>

                        <View
                          style={
                            styles.routineContent
                          }
                        >
                          <Text
                            style={
                              styles.routineTitle
                            }
                          >
                            {getRoutineLabel(
                              routine.type
                            )}
                          </Text>

                          {routine.description ? (
                            <Text
                              style={
                                styles.routineDescription
                              }
                            >
                              {
                                routine.description
                              }
                            </Text>
                          ) : null}

                          <Text
                            style={
                              styles.routineDate
                            }
                          >
                            {formatDate(
                              routine.recordDate
                            )}
                          </Text>
                        </View>

                        <TouchableOpacity
                          onPress={() =>
                            startEditing(
                              routine
                            )
                          }
                        >
                          <Ionicons
                            name="create-outline"
                            size={22}
                            color={
                              colors.teal
                            }
                          />
                        </TouchableOpacity>

                        <TouchableOpacity
                          onPress={() =>
                            handleDelete(
                              routine
                            )
                          }
                        >
                          <Ionicons
                            name="trash-outline"
                            size={22}
                            color={
                              colors.danger
                            }
                          />
                        </TouchableOpacity>
                      </View>
                    )
                  )
                )}
              </>
            ) : historyLoading ? (
              <ActivityIndicator
                size="large"
                color={colors.teal}
              />
            ) : historyError ? (
              <TouchableOpacity
                onPress={() =>
                  refetchHistory()
                }
              >
                <Text
                  style={styles.errorText}
                >
                  Não foi possível carregar o histórico.
                </Text>
              </TouchableOpacity>
            ) : timeline.length === 0 ? (
              <View
                style={styles.emptyCard}
              >
                <Ionicons
                  name="time-outline"
                  size={40}
                  color={colors.teal}
                />

                <Text
                  style={styles.emptyTitle}
                >
                  Histórico vazio
                </Text>
              </View>
            ) : (
              timeline.map((item) => (
                <View
                  key={item.id}
                  style={
                    styles.historyCard
                  }
                >
                  <View
                    style={
                      styles.historyIcon
                    }
                  >
                    <Ionicons
                      name={
                        item.type ===
                        "VACCINE"
                          ? "medical"
                          : item.type ===
                            "ALERT"
                          ? "notifications"
                          : "heart"
                      }
                      size={22}
                      color={colors.white}
                    />
                  </View>

                  <View style={{ flex: 1 }}>
                    <Text
                      style={
                        styles.historyTitle
                      }
                    >
                      {item.title}
                    </Text>

                    <Text
                      style={
                        styles.historyText
                      }
                    >
                      {item.description}
                    </Text>

                    {item.date ? (
                      <Text
                        style={
                          styles.historyDate
                        }
                      >
                        {formatDate(
                          item.date
                        )}
                      </Text>
                    ) : null}
                  </View>
                </View>
              ))
            )}
          </>
        )}
      </ScrollView>

      <BottomNavigation
        navigation={navigation}
        current="History"
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
    marginBottom: 20,
  },

  tabs: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 22,
  },

  tab: {
    flex: 1,
    borderRadius: 14,
    padding: 13,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    backgroundColor:
      "rgba(255,255,255,0.12)",
  },

  tabSelected: {
    backgroundColor: colors.teal,
  },

  tabText: {
    color: colors.white,
    fontWeight: "800",
  },

  tabTextSelected: {
    color: colors.primary,
  },

  labelWhite: {
    color: colors.white,
    fontSize: 14,
    fontWeight: "700",
    marginBottom: 10,
  },

  petSelector: {
    marginBottom: 20,
  },

  petButton: {
    backgroundColor: colors.white,
    borderRadius: 14,
    padding: 12,
    marginRight: 10,
    flexDirection: "row",
    gap: 7,
    alignItems: "center",
  },

  petButtonSelected: {
    backgroundColor: colors.teal,
  },

  petButtonText: {
    color: colors.primary,
    fontWeight: "700",
  },

  formCard: {
    backgroundColor: colors.white,
    padding: 20,
    borderRadius: 22,
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

  typesContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 18,
  },

  typeButton: {
    backgroundColor: "#F4F4F4",
    borderRadius: 12,
    paddingHorizontal: 11,
    paddingVertical: 9,
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },

  typeButtonSelected: {
    backgroundColor: colors.mint,
  },

  typeText: {
    color: colors.primary,
    fontSize: 12,
    fontWeight: "700",
  },

  input: {
    backgroundColor: "#F5F5F5",
    borderRadius: 14,
    paddingHorizontal: 15,
    paddingVertical: 13,
    color: colors.primary,
    marginBottom: 15,
  },

  descriptionInput: {
    minHeight: 90,
    textAlignVertical: "top",
  },

  formError: {
    color: "#C62828",
    marginBottom: 10,
  },

  saveButton: {
    backgroundColor: colors.teal,
    borderRadius: 15,
    padding: 15,
    alignItems: "center",
  },

  saveButtonText: {
    color: colors.primary,
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

  cancelText: {
    color: colors.primary,
    fontWeight: "700",
  },

  sectionTitle: {
    color: colors.white,
    fontSize: 20,
    fontWeight: "800",
    marginTop: 26,
    marginBottom: 14,
  },

  routineCard: {
    backgroundColor: colors.white,
    borderRadius: 18,
    padding: 16,
    marginBottom: 12,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },

  routineIcon: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: colors.teal,
    alignItems: "center",
    justifyContent: "center",
  },

  routineContent: {
    flex: 1,
  },

  routineTitle: {
    color: colors.primary,
    fontSize: 16,
    fontWeight: "800",
  },

  routineDescription: {
    color: colors.gray,
    fontSize: 13,
    marginTop: 3,
  },

  routineDate: {
    color: colors.teal,
    fontSize: 12,
    fontWeight: "700",
    marginTop: 5,
  },

  historyCard: {
    backgroundColor: colors.white,
    borderRadius: 18,
    padding: 16,
    marginBottom: 12,
    flexDirection: "row",
    gap: 12,
  },

  historyIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.teal,
    alignItems: "center",
    justifyContent: "center",
  },

  historyTitle: {
    color: colors.primary,
    fontSize: 15,
    fontWeight: "800",
  },

  historyText: {
    color: colors.gray,
    fontSize: 13,
    marginTop: 4,
  },

  historyDate: {
    color: colors.teal,
    fontSize: 12,
    fontWeight: "700",
    marginTop: 7,
  },

  emptyCard: {
    backgroundColor: colors.white,
    borderRadius: 20,
    padding: 25,
    alignItems: "center",
  },

  emptyTitle: {
    color: colors.primary,
    fontWeight: "800",
    fontSize: 17,
    marginTop: 10,
  },

  errorText: {
    color: colors.white,
    textAlign: "center",
    padding: 20,
  },

  restricted: {
    flex: 1,
    backgroundColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
    padding: 30,
  },

  restrictedTitle: {
    color: colors.white,
    fontSize: 24,
    fontWeight: "800",
    marginTop: 14,
  },

  restrictedText: {
    color: colors.mint,
    textAlign: "center",
    marginTop: 8,
  },
});