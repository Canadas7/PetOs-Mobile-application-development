import {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from "react-native";

import {
  Ionicons,
  MaterialIcons,
} from "@expo/vector-icons";

import { useQuery } from "@tanstack/react-query";

import colors from "../styles/colors";
import BottomNavigation from "../components/BottomNavigation";

import { getPets } from "../services/petService";

import {
  getPetHistory,
  RoutineType,
  VaccineStatus,
} from "../services/historyService";

import { useAuth } from "../contexts/AuthContext";

type FilterType =
  | "ALL"
  | "VACCINES"
  | "ROUTINES"
  | "ALERTS";

type TimelineItem = {
  id: string;
  category: "VACCINE" | "ROUTINE" | "ALERT";
  title: string;
  description: string;
  date: string | null;
  status?: VaccineStatus;
};

export default function HistoryScreen({
  navigation,
}: any) {
  const { session } = useAuth();

  const [selectedPetId, setSelectedPetId] =
    useState<number | null>(null);

  const [filter, setFilter] =
    useState<FilterType>("ALL");

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
    data: history,
    isLoading: historyLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: [
      "pet-history",
      selectedPetId,
    ],

    queryFn: () =>
      getPetHistory(selectedPetId!),

    enabled:
      session?.role === "TUTOR" &&
      selectedPetId !== null,
  });

  function getRoutineName(type: RoutineType) {
    const names: Record<RoutineType, string> = {
      WALK: "Passeio",
      FEEDING: "Alimentação",
      MEDICATION: "Medicamento",
      BATHING: "Banho",
      GROOMING: "Higiene",
      VET_VISIT: "Consulta veterinária",
      TRAINING: "Treinamento",
      OTHER: "Outro cuidado",
    };

    return names[type];
  }

  function getVaccineStatus(
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

  function formatDate(date: string | null) {
    if (!date) {
      return "";
    }

    const dateOnly = date.split("T")[0];

    const [year, month, day] =
      dateOnly.split("-");

    return `${day}/${month}/${year}`;
  }

  const timeline = useMemo(() => {
    if (!history) {
      return [];
    }

    const items: TimelineItem[] = [];

    if (
      filter === "ALL" ||
      filter === "VACCINES"
    ) {
      history.vaccines.forEach(
        (vaccine) => {
          items.push({
            id: `vaccine-${vaccine.id}`,
            category: "VACCINE",
            title: `Vacina ${vaccine.name}`,
            description:
              getVaccineStatus(
                vaccine.status
              ),
            date:
              vaccine.applicationDate ||
              vaccine.dueDate,
            status: vaccine.status,
          });
        }
      );
    }

    if (
      filter === "ALL" ||
      filter === "ROUTINES"
    ) {
      history.routines.forEach(
        (routine) => {
          items.push({
            id: `routine-${routine.id}`,
            category: "ROUTINE",
            title: getRoutineName(
              routine.type
            ),
            description:
              routine.description ||
              "Rotina registrada",
            date: routine.recordDate,
          });
        }
      );
    }

    if (
      filter === "ALL" ||
      filter === "ALERTS"
    ) {
      history.alerts.forEach(
        (alert) => {
          items.push({
            id: `alert-${alert.id}`,
            category: "ALERT",
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
    }

    return items.sort((a, b) => {
      const dateA = a.date
        ? new Date(a.date).getTime()
        : 0;

      const dateB = b.date
        ? new Date(b.date).getTime()
        : 0;

      return dateB - dateA;
    });
  }, [history, filter]);

  function getIcon(item: TimelineItem) {
    if (item.category === "VACCINE") {
      return "medical";
    }

    if (item.category === "ALERT") {
      return "notifications";
    }

    return "calendar";
  }

  if (session?.role !== "TUTOR") {
    return (
      <View style={styles.center}>
        <Ionicons
          name="lock-closed-outline"
          size={54}
          color={colors.teal}
        />

        <Text style={styles.centerTitle}>
          Histórico do Tutor
        </Text>

        <Text style={styles.centerText}>
          Esta área é destinada ao
          acompanhamento dos pets pelo tutor.
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
      >
        <Text style={styles.title}>
          Histórico
        </Text>

        <Text style={styles.subtitle}>
          Acompanhe vacinas, rotinas e
          alertas dos seus pets.
        </Text>

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

            <Text style={styles.emptyText}>
              Cadastre um pet para começar
              a construir o histórico.
            </Text>
          </View>
        ) : (
          <>
            <Text style={styles.sectionLabel}>
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
                  pet.id === selectedPetId;

                return (
                  <TouchableOpacity
                    key={pet.id}
                    style={[
                      styles.petButton,
                      selected &&
                        styles.petButtonSelected,
                    ]}
                    onPress={() =>
                      setSelectedPetId(
                        pet.id
                      )
                    }
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

            <View style={styles.filters}>
              {[
                ["ALL", "Todos"],
                ["VACCINES", "Vacinas"],
                ["ROUTINES", "Rotinas"],
                ["ALERTS", "Alertas"],
              ].map(([value, label]) => (
                <TouchableOpacity
                  key={value}
                  style={[
                    styles.filterButton,
                    filter === value &&
                      styles.filterButtonSelected,
                  ]}
                  onPress={() =>
                    setFilter(
                      value as FilterType
                    )
                  }
                >
                  <Text
                    style={[
                      styles.filterText,
                      filter === value &&
                        styles.filterTextSelected,
                    ]}
                  >
                    {label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {historyLoading ? (
              <View style={styles.loadingBox}>
                <ActivityIndicator
                  size="large"
                  color={colors.teal}
                />

                <Text
                  style={
                    styles.loadingText
                  }
                >
                  Carregando histórico...
                </Text>
              </View>
            ) : isError ? (
              <View style={styles.emptyCard}>
                <Ionicons
                  name="alert-circle-outline"
                  size={42}
                  color={colors.teal}
                />

                <Text
                  style={styles.emptyTitle}
                >
                  Não foi possível carregar
                  o histórico
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
            ) : timeline.length === 0 ? (
              <View style={styles.emptyCard}>
                <Ionicons
                  name="time-outline"
                  size={42}
                  color={colors.teal}
                />

                <Text
                  style={styles.emptyTitle}
                >
                  Histórico vazio
                </Text>

                <Text
                  style={styles.emptyText}
                >
                  Ainda não existem registros
                  nesta categoria.
                </Text>
              </View>
            ) : (
              <View style={styles.timeline}>
                {timeline.map(
                  (item, index) => (
                    <View
                      key={item.id}
                      style={
                        styles.timelineRow
                      }
                    >
                      <View
                        style={
                          styles.timelineLeft
                        }
                      >
                        <View
                          style={
                            styles.timelineIcon
                          }
                        >
                          <Ionicons
                            name={
                              getIcon(
                                item
                              ) as any
                            }
                            size={21}
                            color={
                              colors.white
                            }
                          />
                        </View>

                        {index <
                          timeline.length -
                            1 && (
                          <View
                            style={
                              styles.timelineLine
                            }
                          />
                        )}
                      </View>

                      <View
                        style={
                          styles.eventCard
                        }
                      >
                        <Text
                          style={
                            styles.eventTitle
                          }
                        >
                          {item.title}
                        </Text>

                        <Text
                          style={
                            styles.eventDescription
                          }
                        >
                          {item.description}
                        </Text>

                        {item.date && (
                          <View
                            style={
                              styles.dateRow
                            }
                          >
                            <Ionicons
                              name="calendar-outline"
                              size={14}
                              color={
                                colors.gray
                              }
                            />

                            <Text
                              style={
                                styles.eventDate
                              }
                            >
                              {formatDate(
                                item.date
                              )}
                            </Text>
                          </View>
                        )}
                      </View>
                    </View>
                  )
                )}
              </View>
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
    marginBottom: 24,
  },

  sectionLabel: {
    color: colors.white,
    fontWeight: "700",
    fontSize: 14,
    marginBottom: 10,
  },

  petSelector: {
    marginBottom: 20,
  },

  petButton: {
    backgroundColor: colors.white,
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 11,
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

  filters: {
    flexDirection: "row",
    gap: 7,
    marginBottom: 22,
  },

  filterButton: {
    flex: 1,
    backgroundColor:
      "rgba(255,255,255,0.12)",
    borderRadius: 12,
    paddingVertical: 10,
    alignItems: "center",
  },

  filterButtonSelected: {
    backgroundColor: colors.teal,
  },

  filterText: {
    color: colors.white,
    fontSize: 11,
    fontWeight: "700",
  },

  filterTextSelected: {
    color: colors.primary,
  },

  timeline: {
    marginTop: 4,
  },

  timelineRow: {
    flexDirection: "row",
    minHeight: 105,
  },

  timelineLeft: {
    width: 44,
    alignItems: "center",
  },

  timelineIcon: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: colors.teal,
    alignItems: "center",
    justifyContent: "center",
    zIndex: 2,
  },

  timelineLine: {
    position: "absolute",
    top: 38,
    bottom: 0,
    width: 2,
    backgroundColor:
      "rgba(255,255,255,0.25)",
  },

  eventCard: {
    flex: 1,
    backgroundColor: colors.white,
    borderRadius: 18,
    padding: 16,
    marginLeft: 10,
    marginBottom: 14,
  },

  eventTitle: {
    color: colors.primary,
    fontSize: 16,
    fontWeight: "800",
  },

  eventDescription: {
    color: colors.gray,
    fontSize: 13,
    lineHeight: 18,
    marginTop: 5,
  },

  dateRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    marginTop: 9,
  },

  eventDate: {
    color: colors.gray,
    fontSize: 12,
    fontWeight: "600",
  },

  emptyCard: {
    backgroundColor: colors.white,
    borderRadius: 20,
    padding: 26,
    alignItems: "center",
    marginTop: 10,
  },

  emptyTitle: {
    color: colors.primary,
    fontSize: 18,
    fontWeight: "800",
    marginTop: 12,
    textAlign: "center",
  },

  emptyText: {
    color: colors.gray,
    textAlign: "center",
    fontSize: 13,
    lineHeight: 19,
    marginTop: 7,
  },

  loadingBox: {
    padding: 35,
    alignItems: "center",
  },

  loadingText: {
    color: colors.white,
    marginTop: 12,
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

  center: {
    flex: 1,
    backgroundColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
    padding: 30,
  },

  centerTitle: {
    color: colors.white,
    fontSize: 24,
    fontWeight: "800",
    marginTop: 15,
  },

  centerText: {
    color: colors.mint,
    textAlign: "center",
    marginTop: 8,
  },
});