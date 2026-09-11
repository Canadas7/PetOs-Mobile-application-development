import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
} from "react-native";

import {
  Ionicons,
  MaterialIcons,
} from "@expo/vector-icons";

import { useQueries, useQuery } from "@tanstack/react-query";

import colors from "../styles/colors";
import BottomNavigation from "../components/BottomNavigation";

import {
  getPets,
  PetResponse,
  Species,
} from "../services/petService";

import {
  getPendingAlerts,
} from "../services/alertService";

import { useAuth } from "../contexts/AuthContext";

import {
  getVaccinesByPet,
  VaccineResponse,
} from "../services/vaccineService";

import ClinicHomeScreen from "./ClinicHomeScreen";

export default function HomeScreen({ navigation }: any) {
  const { session } = useAuth();

  const {
    data: pets = [],
    isLoading: petsLoading,
    isError: petsError,
    refetch: refetchPets,
  } = useQuery({
    queryKey: [
      "pets",
      session?.role,
      session?.email,
    ],
    queryFn: getPets,
    enabled: session?.role === "TUTOR",
  });

  const {
    data: alerts = [],
    isLoading: alertsLoading,
    refetch: refetchAlerts,
  } = useQuery({
    queryKey: [
      "alerts",
      "pending",
      session?.email,
    ],
    queryFn: getPendingAlerts,
    enabled: session?.role === "TUTOR",
    refetchOnMount: "always",
    refetchOnReconnect: true,
  });

  const vaccineQueries = useQueries({
    queries: pets.map((pet) => ({
      queryKey: [
        "vaccines",
        "tutor-home",
        pet.id,
      ],
      queryFn: () =>
        getVaccinesByPet(pet.id),
      enabled:
        session?.role === "TUTOR",
      refetchOnMount: "always" as const,
      refetchOnReconnect: true,
    })),
  });

  const allVaccines: VaccineResponse[] =
    vaccineQueries.flatMap(
      (query) => query.data ?? []
    );

  const vaccinesLoading =
    vaccineQueries.some(
      (query) => query.isLoading
    );

  const latestVaccine =
    allVaccines.length > 0
      ? [...allVaccines].sort(
          (a, b) => b.id - a.id
        )[0]
      : undefined;


  const firstPet: PetResponse | undefined = pets[0];

  const vaccineAlert = alerts.find(
    (alert) =>
      alert.type === "VACCINE_DUE" ||
      alert.type === "VACCINE_OVERDUE"
  );

  const userName = session?.name || "Tutor";

  function getSpeciesName(species: Species) {
    const names: Record<Species, string> = {
      DOG: "Cachorro",
      CAT: "Gato",
      BIRD: "Ave",
      RABBIT: "Coelho",
      FISH: "Peixe",
      REPTILE: "Réptil",
      OTHER: "Outro",
    };

    return names[species];
  }

  function formatAge(ageInMonths: number | null) {
    if (ageInMonths === null) {
      return "Idade não informada";
    }

    if (ageInMonths < 12) {
      return ageInMonths === 1
        ? "1 mês"
        : `${ageInMonths} meses`;
    }

    const years = Math.floor(ageInMonths / 12);
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

  function formatDate(date: string | null) {
    if (!date) {
      return null;
    }

    const [year, month, day] = date.split("-");

    return `${day}/${month}/${year}`;
  }

  if (session?.role === "CLINICA") {
    return (
      <ClinicHomeScreen
        navigation={navigation}
      />
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
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
            <Text style={styles.avatarText}>
              {userName.charAt(0).toUpperCase()}
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.greeting}>
          <Text style={styles.title}>
            Olá, {userName}!
          </Text>

          <Text style={styles.subtitle}>
            Acompanhe a saúde e os cuidados dos seus pets.
          </Text>
        </View>

        {petsLoading ? (
          <View style={styles.loadingCard}>
            <ActivityIndicator
              size="large"
              color={colors.teal}
            />

            <Text style={styles.loadingText}>
              Carregando seus pets...
            </Text>
          </View>
        ) : petsError ? (
          <View style={styles.errorCard}>
            <Ionicons
              name="alert-circle-outline"
              size={36}
              color={colors.teal}
            />

            <Text style={styles.errorTitle}>
              Não foi possível carregar seus pets.
            </Text>

            <TouchableOpacity
              style={styles.retryButton}
              onPress={() => refetchPets()}
            >
              <Text style={styles.retryButtonText}>
                Tentar novamente
              </Text>
            </TouchableOpacity>
          </View>
        ) : firstPet ? (
          <TouchableOpacity
            style={styles.petCard}
            onPress={() =>
              navigation.navigate("PetDetails", {
                pet: firstPet,
              })
            }
          >
            <View style={styles.petContent}>
              <Text style={styles.petLabel}>
                Meu Pet
              </Text>

              <Text style={styles.petName}>
                {firstPet.name}
              </Text>

              <View style={styles.petInfoRow}>
                <MaterialIcons
                  name="pets"
                  size={16}
                  color={colors.white}
                />

                <Text style={styles.petInfo}>
                  {getSpeciesName(firstPet.species)}
                  {firstPet.breed
                    ? ` • ${firstPet.breed}`
                    : ""}
                </Text>
              </View>

              <View style={styles.petInfoRow}>
                <Ionicons
                  name="calendar-outline"
                  size={16}
                  color={colors.white}
                />

                <Text style={styles.petInfo}>
                  {formatAge(firstPet.ageInMonths)}
                </Text>
              </View>
            </View>

            <View style={styles.petIcon}>
              <MaterialIcons
                name="pets"
                size={62}
                color={colors.white}
              />
            </View>

            <View style={styles.petArrow}>
              <Ionicons
                name="chevron-forward"
                size={22}
                color={colors.primary}
              />
            </View>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={styles.emptyPetCard}
            onPress={() =>
              navigation.navigate("PetRegister")
            }
          >
            <View style={styles.emptyPetIcon}>
              <MaterialIcons
                name="pets"
                size={32}
                color={colors.teal}
              />
            </View>

            <Text style={styles.emptyPetTitle}>
              Nenhum pet cadastrado
            </Text>

            <Text style={styles.emptyPetText}>
              Cadastre seu primeiro pet para começar.
            </Text>

            <Text style={styles.emptyPetAction}>
              + Cadastrar Pet
            </Text>
          </TouchableOpacity>
        )}

        <View style={styles.whitePanel}>
          <View style={styles.cardsArea}>
            <TouchableOpacity
              style={styles.actionCard}
              onPress={() =>
                navigation.navigate("PetsList")
              }
            >
              <View style={styles.iconCircle}>
                <MaterialIcons
                  name="pets"
                  size={31}
                  color={colors.teal}
                />
              </View>

              <Text style={styles.cardTitle}>
                Meus Pets
              </Text>

              <Text style={styles.cardSub}>
                {pets.length === 1
                  ? "1 cadastrado"
                  : `${pets.length} cadastrados`}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.actionCard}
              onPress={() =>
                navigation.navigate("PetRegister")
              }
            >
              <View style={styles.iconCircleBlue}>
                <Ionicons
                  name="add"
                  size={34}
                  color={colors.blue}
                />
              </View>

              <Text style={styles.cardTitle}>
                Cadastrar
              </Text>

              <Text style={styles.cardSub}>
                Novo pet
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.actionCard}
              onPress={() =>
                navigation.navigate("Profile")
              }
            >
              <View style={styles.iconCircle}>
                <Ionicons
                  name="person-outline"
                  size={30}
                  color={colors.teal}
                />
              </View>

              <Text style={styles.cardTitle}>
                Perfil
              </Text>

              <Text style={styles.cardSub}>
                Minha conta
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.alertHeader}>
            <View style={styles.alertTitleBox}>
              <Ionicons
                name="notifications"
                size={23}
                color={colors.teal}
              />

              <Text style={styles.alertTitle}>
                Aviso da clínica veterinária
              </Text>
            </View>
          </View>

          {alertsLoading || vaccinesLoading ? (
            <View style={styles.alertLoading}>
              <ActivityIndicator
                color={colors.teal}
              />

              <Text style={styles.alertLoadingText}>
                Verificando avisos...
              </Text>
            </View>
          ) : vaccineAlert ? (
            <View
              style={[
                styles.alertCard,
                vaccineAlert.type ===
                  "VACCINE_OVERDUE" &&
                  styles.overdueCard,
              ]}
            >
              <View
                style={[
                  styles.alertIcon,
                  vaccineAlert.type ===
                    "VACCINE_OVERDUE" &&
                    styles.overdueIcon,
                ]}
              >
                <Ionicons
                  name="medical"
                  size={24}
                  color={colors.white}
                />
              </View>

              <View style={styles.alertContent}>
                <Text style={styles.alertPet}>
                  {vaccineAlert.petName}
                </Text>

                <Text style={styles.alertMessage}>
                  {vaccineAlert.message}
                </Text>

                {vaccineAlert.dueDate && (
                  <Text style={styles.alertDate}>
                    {vaccineAlert.type ===
                    "VACCINE_OVERDUE"
                      ? "Vencimento: "
                      : "Próximo vencimento: "}
                    {formatDate(
                      vaccineAlert.dueDate
                    )}
                  </Text>
                )}
              </View>
            </View>
          ) : latestVaccine ? (
            <View style={styles.alertCard}>
              <View style={styles.alertIcon}>
                <Ionicons
                  name="medical"
                  size={24}
                  color={colors.white}
                />
              </View>

              <View style={styles.alertContent}>
                <Text style={styles.alertPet}>
                  {latestVaccine.petName}
                </Text>

                <Text style={styles.alertMessage}>
                  A clínica registrou a vacina{" "}
                  {latestVaccine.name}.
                </Text>

                {latestVaccine.applicationDate && (
                  <Text style={styles.alertDate}>
                    Aplicação:{" "}
                    {formatDate(
                      latestVaccine.applicationDate
                    )}
                  </Text>
                )}

                {latestVaccine.dueDate && (
                  <Text style={styles.alertDate}>
                    Vencimento:{" "}
                    {formatDate(
                      latestVaccine.dueDate
                    )}
                  </Text>
                )}
              </View>
            </View>
          ) : (
            <View style={styles.noAlertCard}>
              <View style={styles.noAlertIcon}>
                <Ionicons
                  name="shield-checkmark-outline"
                  size={26}
                  color={colors.teal}
                />
              </View>

              <View style={styles.alertContent}>
                <Text style={styles.noAlertTitle}>
                  Tudo em dia
                </Text>

                <Text style={styles.noAlertText}>
                  Nenhum aviso de vacinação no momento.
                </Text>
              </View>
            </View>
          )}

          <TouchableOpacity
            style={styles.refreshAlerts}
            onPress={async () => {
              await refetchAlerts();

              await Promise.all(
                vaccineQueries.map(
                  (query) => query.refetch()
                )
              );
            }}
          >
            <Ionicons
              name="refresh-outline"
              size={17}
              color={colors.teal}
            />

            <Text style={styles.refreshAlertsText}>
              Atualizar avisos
            </Text>
          </TouchableOpacity>
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

  scrollContent: {
    padding: 22,
    paddingTop: 48,
    paddingBottom: 120,
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

  avatarText: {
    color: colors.primary,
    fontWeight: "800",
  },

  greeting: {
    marginTop: 28,
    marginBottom: 18,
  },

  title: {
    color: colors.white,
    fontSize: 25,
    fontWeight: "800",
  },

  subtitle: {
    color: colors.mint,
    fontSize: 14,
    marginTop: 4,
  },

  petCard: {
    backgroundColor: colors.teal,
    borderRadius: 22,
    padding: 20,
    minHeight: 160,
    flexDirection: "row",
    alignItems: "center",
    position: "relative",
    overflow: "hidden",
  },

  petContent: {
    flex: 1,
    zIndex: 2,
    paddingRight: 8,
  },

  petLabel: {
    color: colors.white,
    fontSize: 15,
    fontWeight: "600",
  },

  petName: {
    color: colors.white,
    fontSize: 40,
    fontWeight: "800",
    marginVertical: 8,
  },

  petInfoRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginTop: 6,
  },

  petInfo: {
    color: colors.white,
    fontSize: 13,
    flexShrink: 1,
  },

  petIcon: {
    width: 106,
    height: 106,
    borderRadius: 53,
    backgroundColor: "rgba(255,255,255,0.20)",
    alignItems: "center",
    justifyContent: "center",
  },

  petArrow: {
    position: "absolute",
    right: 14,
    top: 14,
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: "rgba(255,255,255,0.70)",
    alignItems: "center",
    justifyContent: "center",
  },

  emptyPetCard: {
    backgroundColor: colors.white,
    borderRadius: 22,
    padding: 24,
  },

  emptyPetIcon: {
    width: 55,
    height: 55,
    borderRadius: 28,
    backgroundColor: colors.mint,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 15,
  },

  emptyPetTitle: {
    color: colors.primary,
    fontSize: 22,
    fontWeight: "800",
  },

  emptyPetText: {
    color: colors.gray,
    fontSize: 14,
    marginTop: 8,
  },

  emptyPetAction: {
    color: colors.teal,
    fontSize: 14,
    fontWeight: "800",
    marginTop: 16,
  },

  loadingCard: {
    backgroundColor: colors.white,
    borderRadius: 22,
    padding: 28,
    alignItems: "center",
  },

  loadingText: {
    color: colors.primary,
    fontSize: 14,
    marginTop: 12,
  },

  errorCard: {
    backgroundColor: colors.white,
    borderRadius: 22,
    padding: 24,
    alignItems: "center",
  },

  errorTitle: {
    color: colors.primary,
    fontSize: 15,
    fontWeight: "700",
    textAlign: "center",
    marginTop: 10,
  },

  retryButton: {
    backgroundColor: colors.teal,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 12,
    marginTop: 14,
  },

  retryButtonText: {
    color: colors.primary,
    fontWeight: "800",
  },

  whitePanel: {
    backgroundColor: colors.white,
    borderRadius: 28,
    padding: 16,
    marginTop: 18,
  },

  cardsArea: {
    flexDirection: "row",
    gap: 10,
  },

  actionCard: {
    flex: 1,
    backgroundColor: colors.white,
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 8,
    alignItems: "center",
    elevation: 3,
    borderWidth: 1,
    borderColor: "#EEF2F7",
  },

  iconCircle: {
    width: 62,
    height: 62,
    borderRadius: 31,
    backgroundColor: colors.mint,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
  },

  iconCircleBlue: {
    width: 62,
    height: 62,
    borderRadius: 31,
    backgroundColor: "#E8F2FF",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
  },

  cardTitle: {
    color: colors.primary,
    fontWeight: "800",
    fontSize: 14,
  },

  cardSub: {
    color: colors.gray,
    fontSize: 11,
    marginTop: 4,
    textAlign: "center",
  },

  alertHeader: {
    marginTop: 25,
    marginBottom: 12,
  },

  alertTitleBox: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },

  alertTitle: {
    color: colors.primary,
    fontSize: 18,
    fontWeight: "800",
    flexShrink: 1,
  },

  alertCard: {
    backgroundColor: colors.mint,
    borderRadius: 16,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    borderWidth: 1,
    borderColor: "#BDEFE4",
  },

  overdueCard: {
    backgroundColor: "#FFF1F1",
    borderColor: "#FFD1D1",
  },

  alertIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: colors.teal,
    alignItems: "center",
    justifyContent: "center",
  },

  overdueIcon: {
    backgroundColor: "#C62828",
  },

  alertContent: {
    flex: 1,
  },

  alertPet: {
    color: colors.primary,
    fontSize: 15,
    fontWeight: "800",
  },

  alertMessage: {
    color: colors.primary,
    fontSize: 13,
    lineHeight: 18,
    marginTop: 3,
  },

  alertDate: {
    color: colors.gray,
    fontSize: 12,
    fontWeight: "700",
    marginTop: 6,
  },

  alertLoading: {
    backgroundColor: colors.mint,
    borderRadius: 16,
    padding: 20,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },

  alertLoadingText: {
    color: colors.primary,
    fontSize: 13,
  },

  noAlertCard: {
    backgroundColor: colors.mint,
    borderRadius: 16,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },

  noAlertIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: colors.white,
    alignItems: "center",
    justifyContent: "center",
  },

  noAlertTitle: {
    color: colors.primary,
    fontSize: 15,
    fontWeight: "800",
  },

  noAlertText: {
    color: colors.gray,
    fontSize: 13,
    marginTop: 3,
    lineHeight: 18,
  },

  refreshAlerts: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 5,
    marginTop: 13,
  },

  refreshAlertsText: {
    color: colors.teal,
    fontSize: 12,
    fontWeight: "700",
  },

});