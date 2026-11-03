import {
  useEffect,
  useRef,
} from "react";

import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
} from "react-native";

import * as Notifications from "expo-notifications";

import {
  Ionicons,
  MaterialIcons,
} from "@expo/vector-icons";

import type { ThemeColors } from "../styles/colors";
import { useTheme } from "../hooks/useTheme";
import { useThemedStyles } from "../hooks/useThemedStyles";
import BottomNavigation from "../components/BottomNavigation";

import {
  PetResponse,
  Species,
} from "../services/petService";

import { useAuth } from "../contexts/AuthContext";

import { usePets } from "../hooks/usePets";
import { useAlerts } from "../hooks/useAlerts";
import { useTutorVaccines } from "../hooks/useTutorVaccines";

import ClinicHomeScreen from "./ClinicHomeScreen";

export default function HomeScreen({
  navigation,
}: any) {
  const { colors } = useTheme();
  const styles = useThemedStyles(createStyles);
  const { session } = useAuth();

  const pendingPetIdRef =
    useRef<number | null>(null);

  const handledNotificationRef =
    useRef<string | null>(null);

  const {
    pets,
    petsLoading,
    petsError,
    refetchPets,
  } = usePets({
    enabled:
      session?.role === "TUTOR",

    role: session?.role,

    email: session?.email,
  });

  const {
    alerts,
    alertsLoading,
    refetchAlerts,
  } = useAlerts({
    enabled:
      session?.role === "TUTOR",

    email: session?.email,
  });

  const {
    latestVaccine,
    vaccinesLoading,
    refetchVaccines,
  } = useTutorVaccines(
    pets,
    session?.role === "TUTOR"
  );

  useEffect(() => {
    if (
      session?.role !== "TUTOR"
    ) {
      return;
    }

    function openPetFromNotification(
      response:
        Notifications.NotificationResponse
    ) {
      const notificationId =
        response.notification.request
          .identifier;

      if (
        handledNotificationRef.current ===
        notificationId
      ) {
        return;
      }

      handledNotificationRef.current =
        notificationId;

      const data =
        response.notification.request
          .content.data;

      const petId =
        Number(data?.petId);

      if (
        !petId ||
        Number.isNaN(petId)
      ) {
        return;
      }

      const selectedPet =
        pets.find(
          (pet) =>
            pet.id === petId
        );

      if (selectedPet) {
        navigation.navigate(
          "PetDetails",
          {
            pet: selectedPet,
          }
        );

        return;
      }

      /*
       * Se a notificação abrir o app
       * antes da lista de pets terminar
       * de carregar, guardamos o ID.
       */
      pendingPetIdRef.current =
        petId;
    }

    const subscription =
      Notifications
        .addNotificationResponseReceivedListener(
          openPetFromNotification
        );

    Notifications
      .getLastNotificationResponseAsync()
      .then((response) => {
        if (response) {
          openPetFromNotification(
            response
          );
        }
      })
      .catch((error) => {
        console.error(
          "Erro ao recuperar notificação:",
          error
        );
      });

    return () => {
      subscription.remove();
    };
  }, [
    navigation,
    pets,
    session?.role,
  ]);

  /*
   * Caso o usuário abra o aplicativo
   * através de uma notificação antes
   * dos pets serem carregados.
   */
  useEffect(() => {
    const pendingPetId =
      pendingPetIdRef.current;

    if (
      !pendingPetId ||
      pets.length === 0
    ) {
      return;
    }

    const selectedPet =
      pets.find(
        (pet) =>
          pet.id === pendingPetId
      );

    if (selectedPet) {
      pendingPetIdRef.current =
        null;

      navigation.navigate(
        "PetDetails",
        {
          pet: selectedPet,
        }
      );
    }
  }, [
    pets,
    navigation,
  ]);

  const firstPet:
    | PetResponse
    | undefined =
    pets[0];

  const vaccineAlert =
    alerts.find(
      (alert) =>
        alert.type ===
          "VACCINE_DUE" ||
        alert.type ===
          "VACCINE_OVERDUE"
    );

  const userName =
    session?.name ||
    "Tutor";

  function getSpeciesName(
    species: Species
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

    return names[species];
  }

  function formatAge(
    ageInMonths:
      | number
      | null
  ) {
    if (
      ageInMonths === null
    ) {
      return "Idade não informada";
    }

    if (
      ageInMonths < 12
    ) {
      return ageInMonths === 1
        ? "1 mês"
        : `${ageInMonths} meses`;
    }

    const years =
      Math.floor(
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
    date: string | null
  ) {
    if (!date) {
      return null;
    }

    const [
      year,
      month,
      day,
    ] = date.split("-");

    return `${day}/${month}/${year}`;
  }

  if (
    session?.role ===
    "CLINICA"
  ) {
    return (
      <ClinicHomeScreen
        navigation={
          navigation
        }
      />
    );
  }

  return (
    <View
      style={
        styles.container
      }
    >
      <ScrollView
        showsVerticalScrollIndicator={
          false
        }
        contentContainerStyle={
          styles.scrollContent
        }
      >
        <View
          style={styles.top}
        >
          <View
            style={
              styles.logoContainer
            }
          >
            <MaterialIcons
              name="pets"
              size={34}
              color={colors.accentText}
            />

            <Text
              style={styles.logo}
            >
              PetOS
            </Text>
          </View>

          <TouchableOpacity
            style={
              styles.avatar
            }
            onPress={() =>
              navigation.navigate(
                "Profile"
              )
            }
          >
            <Text
              style={
                styles.avatarText
              }
            >
              {userName
                .charAt(0)
                .toUpperCase()}
            </Text>
          </TouchableOpacity>
        </View>

        <View
          style={
            styles.greeting
          }
        >
          <Text
            style={styles.title}
          >
            Olá, {userName}!
          </Text>

          <Text
            style={
              styles.subtitle
            }
          >
            Acompanhe a saúde e
            os cuidados dos seus
            pets.
          </Text>
        </View>

        {petsLoading ? (
          <View
            style={
              styles.loadingCard
            }
          >
            <ActivityIndicator
              size="large"
              color={
                colors.accentText
              }
            />

            <Text
              style={
                styles.loadingText
              }
            >
              Carregando seus
              pets...
            </Text>
          </View>
        ) : petsError ? (
          <View
            style={
              styles.errorCard
            }
          >
            <Ionicons
              name="alert-circle-outline"
              size={36}
              color={
                colors.accentText
              }
            />

            <Text
              style={
                styles.errorTitle
              }
            >
              Não foi possível
              carregar seus pets.
            </Text>

            <TouchableOpacity
              style={
                styles.retryButton
              }
              onPress={() =>
                refetchPets()
              }
            >
              <Text
                style={
                  styles.retryButtonText
                }
              >
                Tentar novamente
              </Text>
            </TouchableOpacity>
          </View>
        ) : firstPet ? (
          <TouchableOpacity
            style={
              styles.petCard
            }
            onPress={() =>
              navigation.navigate(
                "PetDetails",
                {
                  pet: firstPet,
                }
              )
            }
          >
            <View
              style={
                styles.petContent
              }
            >
              <Text
                style={
                  styles.petLabel
                }
              >
                Meu Pet
              </Text>

              <Text
                style={
                  styles.petName
                }
              >
                {firstPet.name}
              </Text>

              <View
                style={
                  styles.petInfoRow
                }
              >
                <MaterialIcons
                  name="pets"
                  size={16}
                  color={
                    colors.onAccent
                  }
                />

                <Text
                  style={
                    styles.petInfo
                  }
                >
                  {getSpeciesName(
                    firstPet.species
                  )}

                  {firstPet.breed
                    ? ` • ${firstPet.breed}`
                    : ""}
                </Text>
              </View>

              <View
                style={
                  styles.petInfoRow
                }
              >
                <Ionicons
                  name="calendar-outline"
                  size={16}
                  color={
                    colors.onAccent
                  }
                />

                <Text
                  style={
                    styles.petInfo
                  }
                >
                  {formatAge(
                    firstPet.ageInMonths
                  )}
                </Text>
              </View>
            </View>

            <View
              style={
                styles.petIcon
              }
            >
              <MaterialIcons
                name="pets"
                size={62}
                color={
                  colors.onAccent
                }
              />
            </View>

            <View
              style={
                styles.petArrow
              }
            >
              <Ionicons
                name="chevron-forward"
                size={22}
                color={
                  colors.onAccent
                }
              />
            </View>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={
              styles.emptyPetCard
            }
            onPress={() =>
              navigation.navigate(
                "PetRegister"
              )
            }
          >
            <View
              style={
                styles.emptyPetIcon
              }
            >
              <MaterialIcons
                name="pets"
                size={32}
                color={
                  colors.accentText
                }
              />
            </View>

            <Text
              style={
                styles.emptyPetTitle
              }
            >
              Nenhum pet cadastrado
            </Text>

            <Text
              style={
                styles.emptyPetText
              }
            >
              Cadastre seu primeiro
              pet para começar.
            </Text>

            <Text
              style={
                styles.emptyPetAction
              }
            >
              + Cadastrar Pet
            </Text>
          </TouchableOpacity>
        )}

        <View
          style={
            styles.whitePanel
          }
        >
          <View
            style={
              styles.cardsArea
            }
          >
            <TouchableOpacity
              style={
                styles.actionCard
              }
              onPress={() =>
                navigation.navigate(
                  "PetsList"
                )
              }
            >
              <View
                style={
                  styles.iconCircle
                }
              >
                <MaterialIcons
                  name="pets"
                  size={31}
                  color={
                    colors.accentText
                  }
                />
              </View>

              <Text
                style={
                  styles.cardTitle
                }
              >
                Meus Pets
              </Text>

              <Text
                style={
                  styles.cardSub
                }
              >
                {pets.length ===
                1
                  ? "1 cadastrado"
                  : `${pets.length} cadastrados`}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={
                styles.actionCard
              }
              onPress={() =>
                navigation.navigate(
                  "PetRegister"
                )
              }
            >
              <View
                style={
                  styles.iconCircleBlue
                }
              >
                <Ionicons
                  name="add"
                  size={34}
                  color={
                    colors.blue
                  }
                />
              </View>

              <Text
                style={
                  styles.cardTitle
                }
              >
                Cadastrar
              </Text>

              <Text
                style={
                  styles.cardSub
                }
              >
                Novo pet
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={
                styles.actionCard
              }
              onPress={() =>
                navigation.navigate(
                  "Profile"
                )
              }
            >
              <View
                style={
                  styles.iconCircle
                }
              >
                <Ionicons
                  name="person-outline"
                  size={30}
                  color={
                    colors.accentText
                  }
                />
              </View>

              <Text
                style={
                  styles.cardTitle
                }
              >
                Perfil
              </Text>

              <Text
                style={
                  styles.cardSub
                }
              >
                Minha conta
              </Text>
            </TouchableOpacity>
          </View>

          <View
            style={
              styles.alertHeader
            }
          >
            <View
              style={
                styles.alertTitleBox
              }
            >
              <Ionicons
                name="notifications"
                size={23}
                color={
                  colors.accentText
                }
              />

              <Text
                style={
                  styles.alertTitle
                }
              >
                Aviso da clínica
                veterinária
              </Text>
            </View>
          </View>

          {alertsLoading ||
          vaccinesLoading ? (
            <View
              style={
                styles.alertLoading
              }
            >
              <ActivityIndicator
                color={
                  colors.accentText
                }
              />

              <Text
                style={
                  styles.alertLoadingText
                }
              >
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
                  color={
                    vaccineAlert.type === "VACCINE_OVERDUE" ? colors.onDanger : colors.onAccent
                  }
                />
              </View>

              <View
                style={
                  styles.alertContent
                }
              >
                <Text
                  style={
                    styles.alertPet
                  }
                >
                  {
                    vaccineAlert.petName
                  }
                </Text>

                <Text
                  style={
                    styles.alertMessage
                  }
                >
                  {
                    vaccineAlert.message
                  }
                </Text>

                {vaccineAlert.dueDate && (
                  <Text
                    style={
                      styles.alertDate
                    }
                  >
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
            <View
              style={
                styles.alertCard
              }
            >
              <View
                style={
                  styles.alertIcon
                }
              >
                <Ionicons
                  name="medical"
                  size={24}
                  color={
                    colors.onAccent
                  }
                />
              </View>

              <View
                style={
                  styles.alertContent
                }
              >
                <Text
                  style={
                    styles.alertPet
                  }
                >
                  {
                    latestVaccine.petName
                  }
                </Text>

                <Text
                  style={
                    styles.alertMessage
                  }
                >
                  A clínica registrou a
                  vacina{" "}
                  {
                    latestVaccine.name
                  }
                  .
                </Text>

                {latestVaccine.applicationDate && (
                  <Text
                    style={
                      styles.alertDate
                    }
                  >
                    Aplicação:{" "}
                    {formatDate(
                      latestVaccine.applicationDate
                    )}
                  </Text>
                )}

                {latestVaccine.dueDate && (
                  <Text
                    style={
                      styles.alertDate
                    }
                  >
                    Vencimento:{" "}
                    {formatDate(
                      latestVaccine.dueDate
                    )}
                  </Text>
                )}
              </View>
            </View>
          ) : (
            <View
              style={
                styles.noAlertCard
              }
            >
              <View
                style={
                  styles.noAlertIcon
                }
              >
                <Ionicons
                  name="shield-checkmark-outline"
                  size={26}
                  color={
                    colors.accentText
                  }
                />
              </View>

              <View
                style={
                  styles.alertContent
                }
              >
                <Text
                  style={
                    styles.noAlertTitle
                  }
                >
                  Tudo em dia
                </Text>

                <Text
                  style={
                    styles.noAlertText
                  }
                >
                  Nenhum aviso de
                  vacinação no momento.
                </Text>
              </View>
            </View>
          )}

          <TouchableOpacity
            style={
              styles.refreshAlerts
            }
            onPress={async () => {
              await Promise.all([
                refetchAlerts(),
                refetchVaccines(),
              ]);
            }}
          >
            <Ionicons
              name="refresh-outline"
              size={17}
              color={
                colors.accentText
              }
            />

            <Text
              style={
                styles.refreshAlertsText
              }
            >
              Atualizar avisos
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      <BottomNavigation
        navigation={
          navigation
        }
        current="Home"
      />
    </View>
  );
}

const createStyles = (colors: ThemeColors) => StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },

    scrollContent: {
      padding: 22,
      paddingTop: 48,
      paddingBottom: 120,
    },

    top: {
      flexDirection: "row",
      justifyContent:
        "space-between",
      alignItems: "center",
    },

    logoContainer: {
      flexDirection: "row",
      alignItems: "center",
      gap: 8,
    },

    logo: {
      color: colors.text,
      fontSize: 28,
      fontWeight: "800",
    },

    avatar: {
      width: 42,
      height: 42,
      borderRadius: 21,
      backgroundColor: colors.accent,
      alignItems: "center",
      justifyContent: "center",
      borderWidth: 2,
      borderColor: colors.border,
    },

    avatarText: {
      color: colors.onAccent,
      fontWeight: "800",
    },

    greeting: {
      marginTop: 28,
      marginBottom: 18,
    },

    title: {
      color: colors.text,
      fontSize: 25,
      fontWeight: "800",
    },

    subtitle: {
      color: colors.textSecondary,
      fontSize: 14,
      marginTop: 4,
    },

    petCard: {
      backgroundColor: colors.accent,
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
      color: colors.onAccent,
      fontSize: 15,
      fontWeight: "600",
    },

    petName: {
      color: colors.onAccent,
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
      color: colors.onAccent,
      fontSize: 13,
      flexShrink: 1,
    },

    petIcon: {
      width: 106,
      height: 106,
      borderRadius: 53,
      backgroundColor: colors.accentOverlay,
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
      backgroundColor: colors.accentOverlay,
      alignItems: "center",
      justifyContent: "center",
    },

    emptyPetCard: {
      backgroundColor: colors.surface,
      borderRadius: 22,
      padding: 24,
    },

    emptyPetIcon: {
      width: 55,
      height: 55,
      borderRadius: 28,
      backgroundColor: colors.successSurface,
      alignItems: "center",
      justifyContent: "center",
      marginBottom: 15,
    },

    emptyPetTitle: {
      color: colors.text,
      fontSize: 22,
      fontWeight: "800",
    },

    emptyPetText: {
      color: colors.textSecondary,
      fontSize: 14,
      marginTop: 8,
    },

    emptyPetAction: {
      color: colors.accentText,
      fontSize: 14,
      fontWeight: "800",
      marginTop: 16,
    },

    loadingCard: {
      backgroundColor: colors.surface,
      borderRadius: 22,
      padding: 28,
      alignItems: "center",
    },

    loadingText: {
      color: colors.text,
      fontSize: 14,
      marginTop: 12,
    },

    errorCard: {
      backgroundColor: colors.surface,
      borderRadius: 22,
      padding: 24,
      alignItems: "center",
    },

    errorTitle: {
      color: colors.text,
      fontSize: 15,
      fontWeight: "700",
      textAlign: "center",
      marginTop: 10,
    },

    retryButton: {
      backgroundColor: colors.accent,
      paddingVertical: 10,
      paddingHorizontal: 20,
      borderRadius: 12,
      marginTop: 14,
    },

    retryButtonText: {
      color: colors.onAccent,
      fontWeight: "800",
    },

    whitePanel: {
      backgroundColor: colors.surface,
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
      backgroundColor: colors.surface,
      borderRadius: 16,
      paddingVertical: 16,
      paddingHorizontal: 8,
      alignItems: "center",
      elevation: 3,
      borderWidth: 1,
      borderColor: colors.border,
    },

    iconCircle: {
      width: 62,
      height: 62,
      borderRadius: 31,
      backgroundColor: colors.successSurface,
      alignItems: "center",
      justifyContent: "center",
      marginBottom: 10,
    },

    iconCircleBlue: {
      width: 62,
      height: 62,
      borderRadius: 31,
      backgroundColor: colors.infoSurface,
      alignItems: "center",
      justifyContent: "center",
      marginBottom: 10,
    },

    cardTitle: {
      color: colors.text,
      fontWeight: "800",
      fontSize: 14,
    },

    cardSub: {
      color: colors.textSecondary,
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
      color: colors.text,
      fontSize: 18,
      fontWeight: "800",
      flexShrink: 1,
    },

    alertCard: {
      backgroundColor: colors.successSurface,
      borderRadius: 16,
      padding: 16,
      flexDirection: "row",
      alignItems: "center",
      gap: 12,
      borderWidth: 1,
      borderColor: colors.successBorder,
    },

    overdueCard: {
      backgroundColor: colors.dangerSurface,
      borderColor: colors.dangerBorder,
    },

    alertIcon: {
      width: 50,
      height: 50,
      borderRadius: 25,
      backgroundColor: colors.accent,
      alignItems: "center",
      justifyContent: "center",
    },

    overdueIcon: {
      backgroundColor: colors.danger,
    },

    alertContent: {
      flex: 1,
    },

    alertPet: {
      color: colors.text,
      fontSize: 15,
      fontWeight: "800",
    },

    alertMessage: {
      color: colors.text,
      fontSize: 13,
      lineHeight: 18,
      marginTop: 3,
    },

    alertDate: {
      color: colors.textSecondary,
      fontSize: 12,
      fontWeight: "700",
      marginTop: 6,
    },

    alertLoading: {
      backgroundColor: colors.successSurface,
      borderRadius: 16,
      padding: 20,
      flexDirection: "row",
      alignItems: "center",
      gap: 12,
    },

    alertLoadingText: {
      color: colors.text,
      fontSize: 13,
    },

    noAlertCard: {
      backgroundColor: colors.successSurface,
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
      backgroundColor: colors.surface,
      alignItems: "center",
      justifyContent: "center",
    },

    noAlertTitle: {
      color: colors.text,
      fontSize: 15,
      fontWeight: "800",
    },

    noAlertText: {
      color: colors.textSecondary,
      fontSize: 13,
      marginTop: 3,
      lineHeight: 18,
    },

    refreshAlerts: {
      flexDirection: "row",
      justifyContent:
        "center",
      alignItems: "center",
      gap: 5,
      marginTop: 13,
    },

    refreshAlertsText: {
      color: colors.accentText,
      fontSize: 12,
      fontWeight: "700",
    },
  });
