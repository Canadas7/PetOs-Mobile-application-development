import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
} from "react-native";

import {
  Ionicons,
  MaterialIcons,
} from "@expo/vector-icons";

import colors from "../styles/colors";
import BottomNavigation from "../components/BottomNavigation";

import {
  VaccineResponse,
} from "../services/vaccineService";

import { useAuth } from "../contexts/AuthContext";

import { usePets } from "../hooks/usePets";
import { useAllVaccines } from "../hooks/useAllVaccines";

export default function ClinicHomeScreen({
  navigation,
}: any) {
  const { session } = useAuth();

  const {
    pets,
    petsLoading,
    petsError,
    refetchPets,
  } = usePets({
    enabled: session?.role === "CLINICA",
    role: session?.role,
    email: session?.email,
  });

  const {
    vaccines,
    vaccinesLoading,
    vaccinesError,
    refetchVaccines,
  } = useAllVaccines({
    enabled: session?.role === "CLINICA",
  });

  const attentionVaccines =
    vaccines.filter(
      (vaccine) =>
        vaccine.status === "OVERDUE" ||
        vaccine.status === "EXPIRING_SOON"
    );

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

  function getStatusText(
    vaccine: VaccineResponse
  ) {
    if (vaccine.status === "OVERDUE") {
      return "Vacina vencida";
    }

    if (
      vaccine.status ===
      "EXPIRING_SOON"
    ) {
      return "Próxima do vencimento";
    }

    return vaccine.status;
  }

  if (petsLoading || vaccinesLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator
          size="large"
          color={colors.teal}
        />

        <Text style={styles.loadingText}>
          Carregando painel da clínica...
        </Text>
      </View>
    );
  }

  if (petsError || vaccinesError) {
    return (
      <View style={styles.errorContainer}>
        <Ionicons
          name="cloud-offline-outline"
          size={54}
          color={colors.teal}
        />

        <Text style={styles.errorTitle}>
          Não foi possível carregar os dados
        </Text>

        <Text style={styles.errorText}>
          Verifique sua conexão e tente novamente.
        </Text>

        <TouchableOpacity
          style={styles.retryButton}
          onPress={async () => {
            await Promise.all([
              refetchPets(),
              refetchVaccines(),
            ]);
          }}
        >
          <Ionicons
            name="refresh-outline"
            size={19}
            color={colors.primary}
          />

          <Text style={styles.retryButtonText}>
            Tentar novamente
          </Text>
        </TouchableOpacity>

        <BottomNavigation
          navigation={navigation}
          current="Home"
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
      >
        <View style={styles.top}>
          <View style={styles.logoContainer}>
            <MaterialIcons
              name="pets"
              size={34}
              color={colors.teal}
            />

            <Text style={styles.logo}>
              PetOS
            </Text>
          </View>

          <TouchableOpacity
            style={styles.avatar}
            onPress={() =>
              navigation.navigate("Profile")
            }
          >
            <Ionicons
              name="medkit-outline"
              size={22}
              color={colors.primary}
            />
          </TouchableOpacity>
        </View>

        <View style={styles.greeting}>
          <Text style={styles.title}>
            Olá, {session?.name || "Clínica"}!
          </Text>

          <Text style={styles.subtitle}>
            Acompanhe os pets e gerencie a
            vacinação.
          </Text>
        </View>

        <View style={styles.summaryRow}>
          <TouchableOpacity
            style={styles.summaryCard}
            onPress={() =>
              navigation.navigate("PetsList")
            }
          >
            <View style={styles.summaryIcon}>
              <MaterialIcons
                name="pets"
                size={30}
                color={colors.teal}
              />
            </View>

            <Text style={styles.summaryNumber}>
              {pets.length}
            </Text>

            <Text style={styles.summaryLabel}>
              Pets ativos
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.summaryCard}
            onPress={() =>
              navigation.navigate("Vaccines")
            }
          >
            <View style={styles.summaryIcon}>
              <Ionicons
                name="medical-outline"
                size={30}
                color={colors.teal}
              />
            </View>

            <Text style={styles.summaryNumber}>
              {vaccines.length}
            </Text>

            <Text style={styles.summaryLabel}>
              Vacinas
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.summaryCard}
            onPress={() =>
              navigation.navigate("Vaccines")
            }
          >
            <View style={styles.warningIcon}>
              <Ionicons
                name="alert-circle-outline"
                size={30}
                color={
                  attentionVaccines.length > 0
                    ? "#C62828"
                    : colors.teal
                }
              />
            </View>

            <Text style={styles.summaryNumber}>
              {attentionVaccines.length}
            </Text>

            <Text style={styles.summaryLabel}>
              Atenção
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.quickActions}>
          <Text style={styles.sectionTitle}>
            Ações rápidas
          </Text>

          <TouchableOpacity
            style={styles.actionCard}
            onPress={() =>
              navigation.navigate("PetsList")
            }
          >
            <View style={styles.actionIcon}>
              <MaterialIcons
                name="pets"
                size={28}
                color={colors.white}
              />
            </View>

            <View style={styles.actionContent}>
              <Text style={styles.actionTitle}>
                Consultar Pets
              </Text>

              <Text style={styles.actionText}>
                Visualize os pets cadastrados
                e seus dados.
              </Text>
            </View>

            <Ionicons
              name="chevron-forward"
              size={23}
              color={colors.gray}
            />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionCard}
            onPress={() =>
              navigation.navigate("Vaccines")
            }
          >
            <View style={styles.actionIcon}>
              <Ionicons
                name="medical"
                size={27}
                color={colors.white}
              />
            </View>

            <View style={styles.actionContent}>
              <Text style={styles.actionTitle}>
                Gerenciar Vacinas
              </Text>

              <Text style={styles.actionText}>
                Cadastre, edite e acompanhe
                vacinações.
              </Text>
            </View>

            <Ionicons
              name="chevron-forward"
              size={23}
              color={colors.gray}
            />
          </TouchableOpacity>
        </View>

        <View style={styles.attentionSection}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionHeaderTitle}>
              <Ionicons
                name="notifications-outline"
                size={23}
                color={colors.teal}
              />

              <Text style={styles.sectionTitle}>
                Vacinas que precisam de atenção
              </Text>
            </View>

            <TouchableOpacity
              onPress={() =>
                navigation.navigate("Vaccines")
              }
            >
              <Text style={styles.seeAll}>
                Ver todas
              </Text>
            </TouchableOpacity>
          </View>

          {attentionVaccines.length === 0 ? (
            <View style={styles.emptyCard}>
              <Ionicons
                name="shield-checkmark-outline"
                size={32}
                color={colors.teal}
              />

              <View style={styles.emptyContent}>
                <Text style={styles.emptyTitle}>
                  Nenhuma pendência crítica
                </Text>

                <Text style={styles.emptyText}>
                  Não existem vacinas vencidas
                  ou próximas do vencimento.
                </Text>
              </View>
            </View>
          ) : (
            attentionVaccines
              .slice(0, 3)
              .map((vaccine) => (
                <TouchableOpacity
                  key={vaccine.id}
                  style={styles.vaccineCard}
                  onPress={() =>
                    navigation.navigate(
                      "Vaccines"
                    )
                  }
                >
                  <View
                    style={[
                      styles.vaccineIcon,
                      vaccine.status ===
                        "OVERDUE" &&
                        styles.overdueIcon,
                    ]}
                  >
                    <Ionicons
                      name="medical"
                      size={23}
                      color={colors.white}
                    />
                  </View>

                  <View
                    style={
                      styles.vaccineContent
                    }
                  >
                    <Text
                      style={
                        styles.vaccineName
                      }
                    >
                      {vaccine.petName}
                    </Text>

                    <Text
                      style={
                        styles.vaccineInfo
                      }
                    >
                      {vaccine.name}
                    </Text>

                    <Text
                      style={[
                        styles.vaccineStatus,
                        vaccine.status ===
                          "OVERDUE" &&
                          styles.overdueText,
                      ]}
                    >
                      {getStatusText(
                        vaccine
                      )}
                    </Text>

                    {vaccine.dueDate && (
                      <Text
                        style={
                          styles.vaccineDate
                        }
                      >
                        Vencimento:{" "}
                        {formatDate(
                          vaccine.dueDate
                        )}
                      </Text>
                    )}
                  </View>

                  <Ionicons
                    name="chevron-forward"
                    size={22}
                    color={colors.gray}
                  />
                </TouchableOpacity>
              ))
          )}
        </View>
      </ScrollView>

      <BottomNavigation
        navigation={navigation}
        current="Home"
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
    padding: 22,
    paddingTop: 48,
    paddingBottom: 120,
  },

  loadingContainer: {
    flex: 1,
    backgroundColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
  },

  loadingText: {
    color: colors.white,
    marginTop: 14,
  },

  errorContainer: {
    flex: 1,
    backgroundColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
    padding: 30,
    paddingBottom: 110,
  },

  errorTitle: {
    color: colors.white,
    fontSize: 22,
    fontWeight: "800",
    textAlign: "center",
    marginTop: 16,
  },

  errorText: {
    color: colors.mint,
    fontSize: 14,
    textAlign: "center",
    lineHeight: 20,
    marginTop: 8,
    marginBottom: 20,
  },

  retryButton: {
    backgroundColor: colors.teal,
    borderRadius: 14,
    paddingVertical: 13,
    paddingHorizontal: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 7,
  },

  retryButtonText: {
    color: colors.primary,
    fontSize: 14,
    fontWeight: "800",
  },

  top: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  logoContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },

  logo: {
    color: colors.white,
    fontSize: 28,
    fontWeight: "800",
  },

  avatar: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: colors.teal,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: colors.white,
  },

  greeting: {
    marginTop: 28,
    marginBottom: 22,
  },

  title: {
    color: colors.white,
    fontSize: 25,
    fontWeight: "800",
  },

  subtitle: {
    color: colors.mint,
    fontSize: 14,
    marginTop: 5,
  },

  summaryRow: {
    flexDirection: "row",
    gap: 10,
  },

  summaryCard: {
    flex: 1,
    backgroundColor: colors.white,
    borderRadius: 18,
    padding: 14,
    alignItems: "center",
  },

  summaryIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.mint,
    alignItems: "center",
    justifyContent: "center",
  },

  warningIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#FFF1F1",
    alignItems: "center",
    justifyContent: "center",
  },

  summaryNumber: {
    color: colors.primary,
    fontSize: 25,
    fontWeight: "800",
    marginTop: 8,
  },

  summaryLabel: {
    color: colors.gray,
    fontSize: 11,
    fontWeight: "700",
    textAlign: "center",
    marginTop: 2,
  },

  quickActions: {
    marginTop: 28,
  },

  sectionTitle: {
    color: colors.white,
    fontSize: 18,
    fontWeight: "800",
  },

  actionCard: {
    backgroundColor: colors.white,
    borderRadius: 18,
    padding: 16,
    marginTop: 12,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },

  actionIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.teal,
    alignItems: "center",
    justifyContent: "center",
  },

  actionContent: {
    flex: 1,
  },

  actionTitle: {
    color: colors.primary,
    fontSize: 15,
    fontWeight: "800",
  },

  actionText: {
    color: colors.gray,
    fontSize: 12,
    lineHeight: 17,
    marginTop: 3,
  },

  attentionSection: {
    marginTop: 28,
  },

  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },

  sectionHeaderTitle: {
    flexDirection: "row",
    alignItems: "center",
    gap: 7,
    flex: 1,
  },

  seeAll: {
    color: colors.teal,
    fontSize: 12,
    fontWeight: "800",
  },

  emptyCard: {
    backgroundColor: colors.white,
    borderRadius: 18,
    padding: 17,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },

  emptyContent: {
    flex: 1,
  },

  emptyTitle: {
    color: colors.primary,
    fontWeight: "800",
    fontSize: 14,
  },

  emptyText: {
    color: colors.gray,
    fontSize: 12,
    lineHeight: 17,
    marginTop: 3,
  },

  vaccineCard: {
    backgroundColor: colors.white,
    borderRadius: 18,
    padding: 15,
    marginBottom: 10,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },

  vaccineIcon: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: colors.teal,
    alignItems: "center",
    justifyContent: "center",
  },

  overdueIcon: {
    backgroundColor: "#C62828",
  },

  vaccineContent: {
    flex: 1,
  },

  vaccineName: {
    color: colors.primary,
    fontSize: 15,
    fontWeight: "800",
  },

  vaccineInfo: {
    color: colors.gray,
    fontSize: 12,
    marginTop: 2,
  },

  vaccineStatus: {
    color: colors.teal,
    fontSize: 12,
    fontWeight: "800",
    marginTop: 5,
  },

  overdueText: {
    color: "#C62828",
  },

  vaccineDate: {
    color: colors.gray,
    fontSize: 11,
    marginTop: 3,
  },
});