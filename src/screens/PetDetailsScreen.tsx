import { useEffect, useMemo, useState } from "react";

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

import colors from "../styles/colors";
import BottomNavigation from "../components/BottomNavigation";

import {
  Species,
} from "../services/petService";

import {
  VaccineStatus,
} from "../services/vaccineService";

import {
  RoutineResponse,
  RoutineType,
} from "../services/routineService";

import { useAuth } from "../contexts/AuthContext";
import { usePetDetails } from "../hooks/usePetDetails";
import { usePetHistory } from "../hooks/usePetHistory";

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

const routineLabels: Record<
  RoutineType,
  string
> = {
  WALK: "Passeio",
  FEEDING: "Alimentação",
  MEDICATION: "Medicamento",
  BATHING: "Banho",
  GROOMING: "Higiene",
  VET_VISIT: "Veterinário",
  TRAINING: "Treinamento",
  OTHER: "Outro",
};

const vaccineStatusLabels: Record<
  VaccineStatus,
  string
> = {
  PENDING: "Pendente",
  APPLIED: "Aplicada",
  EXPIRING_SOON:
    "Próxima do vencimento",
  OVERDUE: "Vencida",
};

export default function PetDetailsScreen({
  route,
  navigation,
}: any) {
  const initialPet = route.params?.pet;
  const petId =
    initialPet?.id ?? null;

  const { session } = useAuth();

  const {
    pet,
    petLoading,
    petError,
    petErrorObject,
    refetchPet,
    updatePet,
    isUpdatingPet,
  } = usePetDetails(petId);

  const {
    history,
    historyLoading,
    historyError,
    refetchHistory,
  } = usePetHistory(
    petId,
    petId !== null
  );

  const [editing, setEditing] =
    useState(false);

  const [name, setName] =
    useState("");

  const [species, setSpecies] =
    useState<Species>("DOG");

  const [breed, setBreed] =
    useState("");

  const [birthDate, setBirthDate] =
    useState("");

  const [weight, setWeight] =
    useState("");

  const [tutorPhone, setTutorPhone] =
    useState("");

  const [formError, setFormError] =
    useState("");

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

    setTutorPhone(
      pet.tutorPhone || ""
    );
  }, [pet]);

  const recentVaccines = useMemo(
    () =>
      history?.vaccines
        ?.slice()
        .sort(
          (a, b) =>
            b.id - a.id
        )
        .slice(0, 3) ?? [],
    [history]
  );

  const recentRoutines = useMemo(
    () =>
      history?.routines
        ?.slice()
        .sort(
          (a, b) =>
            b.id - a.id
        )
        .slice(0, 3) ?? [],
    [history]
  );

  const recentAlerts = useMemo(
    () =>
      history?.alerts
        ?.slice()
        .sort(
          (a, b) =>
            b.id - a.id
        )
        .slice(0, 3) ?? [],
    [history]
  );

  function getSpeciesName(
    value: Species
  ) {
    const names: Record<
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

    return names[value];
  }

  function formatAge(
    ageInMonths: number | null
  ) {
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

    const months =
      ageInMonths % 12;

    if (months === 0) {
      return years === 1
        ? "1 ano"
        : `${years} anos`;
    }

    return `${years} ${
      years === 1
        ? "ano"
        : "anos"
    } e ${months} ${
      months === 1
        ? "mês"
        : "meses"
    }`;
  }

  function formatDate(
    date: string | null | undefined
  ) {
    if (!date) {
      return "Não informada";
    }

    const dateOnly =
      date.split("T")[0];

    const [year, month, day] =
      dateOnly.split("-");

    if (!year || !month || !day) {
      return date;
    }

    return `${day}/${month}/${year}`;
  }

  function validateDate(
    date: string
  ) {
    if (!date) {
      return true;
    }

    const pattern =
      /^\d{4}-\d{2}-\d{2}$/;

    if (!pattern.test(date)) {
      return false;
    }

    const parsedDate =
      new Date(
        `${date}T00:00:00`
      );

    if (
      Number.isNaN(
        parsedDate.getTime()
      )
    ) {
      return false;
    }

    return parsedDate < new Date();
  }

  async function handleUpdate() {
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

    if (
      !validateDate(birthDate)
    ) {
      setFormError(
        "Informe a data no formato AAAA-MM-DD."
      );

      return;
    }

    if (weight.trim()) {
      const numericWeight =
        Number(
          weight.replace(",", ".")
        );

      if (
        Number.isNaN(
          numericWeight
        ) ||
        numericWeight <= 0
      ) {
        setFormError(
          "Informe um peso válido."
        );

        return;
      }
    }

    try {
      await updatePet(
        pet.id,
        {
          name: name.trim(),
          species,

          breed: breed.trim()
            ? breed.trim()
            : undefined,

          birthDate:
            birthDate.trim()
              ? birthDate.trim()
              : undefined,

          weight: weight.trim()
            ? Number(
                weight.replace(
                  ",",
                  "."
                )
              )
            : undefined,

          tutorName:
            pet.tutorName,

          tutorPhone:
            tutorPhone.trim()
              ? tutorPhone.trim()
              : undefined,
        }
      );

      setEditing(false);

      Alert.alert(
        "Pet atualizado",
        "As informações foram atualizadas com sucesso."
      );
    } catch (error) {
      setFormError(
        error instanceof Error
          ? error.message
          : "Não foi possível atualizar o pet."
      );
    }
  }

  function handleCancelEdit() {
    if (!pet) {
      return;
    }

    setName(pet.name);
    setSpecies(pet.species);
    setBreed(pet.breed || "");
    setBirthDate(
      pet.birthDate || ""
    );

    setWeight(
      pet.weight !== null
        ? String(pet.weight)
        : ""
    );

    setTutorPhone(
      pet.tutorPhone || ""
    );

    setFormError("");
    setEditing(false);
  }

  async function refreshDetails() {
    await Promise.all([
      refetchPet(),
      refetchHistory(),
    ]);
  }

  if (!petId) {
    return (
      <View
        style={
          styles.centerContainer
        }
      >
        <Text
          style={
            styles.errorTitle
          }
        >
          Pet não encontrado.
        </Text>

        <TouchableOpacity
          style={styles.mainButton}
          onPress={() =>
            navigation.navigate(
              "PetsList"
            )
          }
        >
          <Text
            style={
              styles.mainButtonText
            }
          >
            Voltar
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (petLoading) {
    return (
      <View
        style={
          styles.centerContainer
        }
      >
        <ActivityIndicator
          size="large"
          color={colors.teal}
        />

        <Text
          style={
            styles.loadingText
          }
        >
          Carregando pet...
        </Text>
      </View>
    );
  }

  if (petError || !pet) {
    return (
      <View
        style={
          styles.centerContainer
        }
      >
        <Text
          style={
            styles.errorTitle
          }
        >
          Não foi possível carregar o pet.
        </Text>

        <Text
          style={
            styles.errorText
          }
        >
          {petErrorObject
            instanceof Error
            ? petErrorObject.message
            : "Pet não encontrado."}
        </Text>

        <TouchableOpacity
          style={styles.mainButton}
          onPress={() =>
            navigation.navigate(
              "PetsList"
            )
          }
        >
          <Text
            style={
              styles.mainButtonText
            }
          >
            Voltar
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View
      style={styles.container}
    >
      <ScrollView
        showsVerticalScrollIndicator={
          false
        }
        contentContainerStyle={
          styles.content
        }
      >
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() =>
              navigation.goBack()
            }
          >
            <Ionicons
              name="chevron-back"
              size={30}
              color={colors.white}
            />
          </TouchableOpacity>

          <View style={{ flex: 1 }}>
            <Text
              style={styles.title}
            >
              Detalhes do Pet
            </Text>

            <Text
              style={
                styles.headerSubtitle
              }
            >
              Informações, saúde e cuidados
            </Text>
          </View>

          <TouchableOpacity
            onPress={
              refreshDetails
            }
          >
            <Ionicons
              name="refresh-outline"
              size={25}
              color={colors.teal}
            />
          </TouchableOpacity>
        </View>

        {!editing ? (
          <>
            <View style={styles.card}>
              <View
                style={styles.iconBox}
              >
                <MaterialIcons
                  name="pets"
                  size={54}
                  color={colors.teal}
                />
              </View>

              <Text
                style={styles.petName}
              >
                {pet.name}
              </Text>

              <View
                style={styles.infoRow}
              >
                <MaterialIcons
                  name="pets"
                  size={22}
                  color={colors.teal}
                />

                <View>
                  <Text
                    style={
                      styles.infoLabel
                    }
                  >
                    Espécie
                  </Text>

                  <Text
                    style={
                      styles.infoText
                    }
                  >
                    {getSpeciesName(
                      pet.species
                    )}
                  </Text>
                </View>
              </View>

              <View
                style={styles.infoRow}
              >
                <Ionicons
                  name="paw-outline"
                  size={22}
                  color={colors.teal}
                />

                <View>
                  <Text
                    style={
                      styles.infoLabel
                    }
                  >
                    Raça
                  </Text>

                  <Text
                    style={
                      styles.infoText
                    }
                  >
                    {pet.breed ||
                      "Não informada"}
                  </Text>
                </View>
              </View>

              <View
                style={styles.infoRow}
              >
                <Ionicons
                  name="calendar-outline"
                  size={22}
                  color={colors.teal}
                />

                <View>
                  <Text
                    style={
                      styles.infoLabel
                    }
                  >
                    Idade
                  </Text>

                  <Text
                    style={
                      styles.infoText
                    }
                  >
                    {formatAge(
                      pet.ageInMonths
                    )}
                  </Text>
                </View>
              </View>

              <View
                style={styles.infoRow}
              >
                <Ionicons
                  name="scale-outline"
                  size={22}
                  color={colors.teal}
                />

                <View>
                  <Text
                    style={
                      styles.infoLabel
                    }
                  >
                    Peso
                  </Text>

                  <Text
                    style={
                      styles.infoText
                    }
                  >
                    {pet.weight !== null
                      ? `${pet.weight} kg`
                      : "Não informado"}
                  </Text>
                </View>
              </View>

              <View
                style={styles.infoRow}
              >
                <Ionicons
                  name="person-outline"
                  size={22}
                  color={colors.teal}
                />

                <View>
                  <Text
                    style={
                      styles.infoLabel
                    }
                  >
                    Tutor
                  </Text>

                  <Text
                    style={
                      styles.infoText
                    }
                  >
                    {pet.tutorName}
                  </Text>
                </View>
              </View>

              <View
                style={styles.infoRow}
              >
                <Ionicons
                  name="call-outline"
                  size={22}
                  color={colors.teal}
                />

                <View>
                  <Text
                    style={
                      styles.infoLabel
                    }
                  >
                    Telefone
                  </Text>

                  <Text
                    style={
                      styles.infoText
                    }
                  >
                    {pet.tutorPhone ||
                      "Não informado"}
                  </Text>
                </View>
              </View>
            </View>

            {session?.role ===
              "TUTOR" && (
              <TouchableOpacity
                style={
                  styles.editButton
                }
                onPress={() =>
                  setEditing(true)
                }
              >
                <Ionicons
                  name="create-outline"
                  size={21}
                  color={
                    colors.primary
                  }
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

            <Text
              style={
                styles.sectionTitle
              }
            >
              Resumo de saúde
            </Text>

            {historyLoading ? (
              <View
                style={
                  styles.healthLoading
                }
              >
                <ActivityIndicator
                  color={colors.teal}
                />

                <Text
                  style={
                    styles.healthLoadingText
                  }
                >
                  Carregando histórico...
                </Text>
              </View>
            ) : historyError ? (
              <TouchableOpacity
                style={
                  styles.historyErrorCard
                }
                onPress={() =>
                  refetchHistory()
                }
              >
                <Ionicons
                  name="alert-circle-outline"
                  size={28}
                  color={colors.teal}
                />

                <View style={{ flex: 1 }}>
                  <Text
                    style={
                      styles.healthErrorTitle
                    }
                  >
                    Não foi possível carregar o histórico.
                  </Text>

                  <Text
                    style={
                      styles.healthErrorText
                    }
                  >
                    Toque para tentar novamente.
                  </Text>
                </View>
              </TouchableOpacity>
            ) : (
              <>
                <View
                  style={
                    styles.summaryRow
                  }
                >
                  <View
                    style={
                      styles.summaryCard
                    }
                  >
                    <Ionicons
                      name="medical-outline"
                      size={27}
                      color={colors.teal}
                    />

                    <Text
                      style={
                        styles.summaryNumber
                      }
                    >
                      {history?.vaccines
                        .length ?? 0}
                    </Text>

                    <Text
                      style={
                        styles.summaryLabel
                      }
                    >
                      Vacinas
                    </Text>
                  </View>

                  <View
                    style={
                      styles.summaryCard
                    }
                  >
                    <Ionicons
                      name="heart-outline"
                      size={27}
                      color={colors.teal}
                    />

                    <Text
                      style={
                        styles.summaryNumber
                      }
                    >
                      {history?.routines
                        .length ?? 0}
                    </Text>

                    <Text
                      style={
                        styles.summaryLabel
                      }
                    >
                      Cuidados
                    </Text>
                  </View>

                  <View
                    style={
                      styles.summaryCard
                    }
                  >
                    <Ionicons
                      name="notifications-outline"
                      size={27}
                      color={colors.teal}
                    />

                    <Text
                      style={
                        styles.summaryNumber
                      }
                    >
                      {history?.alerts
                        .length ?? 0}
                    </Text>

                    <Text
                      style={
                        styles.summaryLabel
                      }
                    >
                      Alertas
                    </Text>
                  </View>
                </View>

                <Text
                  style={
                    styles.subsectionTitle
                  }
                >
                  Vacinas recentes
                </Text>

                {recentVaccines.length ===
                0 ? (
                  <View
                    style={
                      styles.emptySectionCard
                    }
                  >
                    <Text
                      style={
                        styles.emptySectionText
                      }
                    >
                      Nenhuma vacina registrada.
                    </Text>
                  </View>
                ) : (
                  recentVaccines.map(
                    (vaccine) => (
                      <View
                        key={
                          vaccine.id
                        }
                        style={
                          styles.healthItem
                        }
                      >
                        <View
                          style={
                            styles.healthIcon
                          }
                        >
                          <Ionicons
                            name="medical"
                            size={20}
                            color={
                              colors.white
                            }
                          />
                        </View>

                        <View
                          style={{
                            flex: 1,
                          }}
                        >
                          <Text
                            style={
                              styles.healthItemTitle
                            }
                          >
                            {
                              vaccine.name
                            }
                          </Text>

                          <Text
                            style={
                              styles.healthItemText
                            }
                          >
                            {
                              vaccineStatusLabels[
                                vaccine
                                  .status
                              ]
                            }
                          </Text>

                          <Text
                            style={
                              styles.healthItemDate
                            }
                          >
                            {vaccine.applicationDate
                              ? `Aplicação: ${formatDate(
                                  vaccine.applicationDate
                                )}`
                              : vaccine.dueDate
                              ? `Vencimento: ${formatDate(
                                  vaccine.dueDate
                                )}`
                              : "Data não informada"}
                          </Text>
                        </View>
                      </View>
                    )
                  )
                )}

                <Text
                  style={
                    styles.subsectionTitle
                  }
                >
                  Cuidados recentes
                </Text>

                {recentRoutines.length ===
                0 ? (
                  <View
                    style={
                      styles.emptySectionCard
                    }
                  >
                    <Text
                      style={
                        styles.emptySectionText
                      }
                    >
                      Nenhum cuidado registrado.
                    </Text>
                  </View>
                ) : (
                  recentRoutines.map(
                    (routine: RoutineResponse) => (
                      <View
                        key={
                          routine.id
                        }
                        style={
                          styles.healthItem
                        }
                      >
                        <View
                          style={
                            styles.healthIcon
                          }
                        >
                          <Ionicons
                            name="heart"
                            size={20}
                            color={
                              colors.white
                            }
                          />
                        </View>

                        <View
                          style={{
                            flex: 1,
                          }}
                        >
                          <Text
                            style={
                              styles.healthItemTitle
                            }
                          >
                            {
                              routineLabels[
                                routine
                                  .type
                              ]
                            }
                          </Text>

                          {routine.description ? (
                            <Text
                              style={
                                styles.healthItemText
                              }
                            >
                              {
                                routine.description
                              }
                            </Text>
                          ) : null}

                          <Text
                            style={
                              styles.healthItemDate
                            }
                          >
                            {formatDate(
                              routine.recordDate
                            )}
                          </Text>
                        </View>
                      </View>
                    )
                  )
                )}

                <Text
                  style={
                    styles.subsectionTitle
                  }
                >
                  Alertas
                </Text>

                {recentAlerts.length ===
                0 ? (
                  <View
                    style={
                      styles.emptySectionCard
                    }
                  >
                    <Text
                      style={
                        styles.emptySectionText
                      }
                    >
                      Nenhum alerta registrado.
                    </Text>
                  </View>
                ) : (
                  recentAlerts.map(
                    (alert) => (
                      <View
                        key={alert.id}
                        style={
                          styles.healthItem
                        }
                      >
                        <View
                          style={[
                            styles.healthIcon,
                            styles.alertHealthIcon,
                          ]}
                        >
                          <Ionicons
                            name="notifications"
                            size={20}
                            color={
                              colors.white
                            }
                          />
                        </View>

                        <View
                          style={{
                            flex: 1,
                          }}
                        >
                          <Text
                            style={
                              styles.healthItemTitle
                            }
                          >
                            Aviso da clínica
                          </Text>

                          <Text
                            style={
                              styles.healthItemText
                            }
                          >
                            {
                              alert.message
                            }
                          </Text>

                          <Text
                            style={
                              styles.healthItemDate
                            }
                          >
                            {formatDate(
                              alert.dueDate ||
                                alert.createdAt
                            )}
                          </Text>
                        </View>
                      </View>
                    )
                  )
                )}
              </>
            )}

            {session?.role ===
              "CLINICA" && (
              <View
                style={
                  styles.clinicCard
                }
              >
                <Ionicons
                  name="medkit-outline"
                  size={25}
                  color={colors.teal}
                />

                <View
                  style={
                    styles.clinicContent
                  }
                >
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
                    Consulte os dados, vacinas,
                    cuidados e alertas deste pet.
                    O cadastro e a edição de
                    vacinas continuam disponíveis
                    na área de Vacinas.
                  </Text>

                  <TouchableOpacity
                    style={
                      styles.clinicVaccineButton
                    }
                    onPress={() =>
                      navigation.navigate(
                        "Vaccines"
                      )
                    }
                  >
                    <Text
                      style={
                        styles.clinicVaccineButtonText
                      }
                    >
                      Gerenciar vacinas
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
          </>
        ) : (
          <View style={styles.card}>
            <Text
              style={
                styles.editTitle
              }
            >
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
              onChangeText={
                setBirthDate
              }
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
              onChangeText={
                setTutorPhone
              }
              placeholder="Telefone"
              keyboardType="phone-pad"
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
              style={[
                styles.saveButton,

                isUpdatingPet &&
                  styles.disabledButton,
              ]}
              onPress={handleUpdate}
              disabled={isUpdatingPet}
            >
              {isUpdatingPet ? (
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
                  Salvar alterações
                </Text>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              style={
                styles.cancelButton
              }
              onPress={
                handleCancelEdit
              }
              disabled={isUpdatingPet}
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

  headerSubtitle: {
    color: colors.mint,
    fontSize: 12,
    marginTop: 2,
  },

  title: {
    color: colors.white,
    fontSize: 28,
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

  sectionTitle: {
    color: colors.white,
    fontSize: 21,
    fontWeight: "800",
    marginTop: 28,
    marginBottom: 14,
  },

  healthLoading: {
    backgroundColor: colors.white,
    borderRadius: 18,
    padding: 20,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },

  healthLoadingText: {
    color: colors.primary,
    fontSize: 13,
  },

  historyErrorCard: {
    backgroundColor: colors.white,
    borderRadius: 18,
    padding: 18,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },

  healthErrorTitle: {
    color: colors.primary,
    fontSize: 14,
    fontWeight: "800",
  },

  healthErrorText: {
    color: colors.gray,
    fontSize: 12,
    marginTop: 3,
  },

  summaryRow: {
    flexDirection: "row",
    gap: 10,
  },

  summaryCard: {
    flex: 1,
    backgroundColor: colors.white,
    borderRadius: 18,
    paddingVertical: 16,
    paddingHorizontal: 8,
    alignItems: "center",
  },

  summaryNumber: {
    color: colors.primary,
    fontSize: 24,
    fontWeight: "800",
    marginTop: 7,
  },

  summaryLabel: {
    color: colors.gray,
    fontSize: 11,
    fontWeight: "700",
    marginTop: 2,
  },

  subsectionTitle: {
    color: colors.white,
    fontSize: 16,
    fontWeight: "800",
    marginTop: 22,
    marginBottom: 10,
  },

  healthItem: {
    backgroundColor: colors.white,
    borderRadius: 17,
    padding: 14,
    flexDirection: "row",
    gap: 11,
    marginBottom: 9,
  },

  healthIcon: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: colors.teal,
    alignItems: "center",
    justifyContent: "center",
  },

  alertHealthIcon: {
    backgroundColor: "#C62828",
  },

  healthItemTitle: {
    color: colors.primary,
    fontSize: 14,
    fontWeight: "800",
  },

  healthItemText: {
    color: colors.gray,
    fontSize: 12,
    lineHeight: 17,
    marginTop: 3,
  },

  healthItemDate: {
    color: colors.teal,
    fontSize: 11,
    fontWeight: "700",
    marginTop: 5,
  },

  emptySectionCard: {
    backgroundColor: colors.white,
    borderRadius: 17,
    padding: 16,
  },

  emptySectionText: {
    color: colors.gray,
    fontSize: 13,
    textAlign: "center",
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
    marginTop: 22,
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

  clinicVaccineButton: {
    alignSelf: "flex-start",
    backgroundColor: colors.teal,
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 14,
    marginTop: 12,
  },

  clinicVaccineButtonText: {
    color: colors.primary,
    fontSize: 12,
    fontWeight: "800",
  },
});
