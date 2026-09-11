import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from "react-native";

import {
  Ionicons,
  MaterialIcons,
} from "@expo/vector-icons";

import colors from "../styles/colors";
import { useAuth } from "../contexts/AuthContext";

export default function BottomNavigation({
  navigation,
  current,
}: any) {
  const { session } = useAuth();

  const isTutor = session?.role === "TUTOR";
  const isClinica = session?.role === "CLINICA";

  return (
    <View style={styles.bottomNav}>
      <TouchableOpacity
        style={styles.navButton}
        activeOpacity={0.7}
        onPress={() => navigation.navigate("Home")}
      >
        <Ionicons
          name="home"
          size={23}
          color={
            current === "Home"
              ? colors.teal
              : colors.gray
          }
        />

        <Text
          style={
            current === "Home"
              ? styles.navActive
              : styles.navItem
          }
        >
          Início
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.navButton}
        activeOpacity={0.7}
        onPress={() =>
          navigation.navigate("PetsList")
        }
      >
        <MaterialIcons
          name="pets"
          size={23}
          color={
            current === "PetsList"
              ? colors.teal
              : colors.gray
          }
        />

        <Text
          style={
            current === "PetsList"
              ? styles.navActive
              : styles.navItem
          }
        >
          Pets
        </Text>
      </TouchableOpacity>

      {isTutor && (
        <TouchableOpacity
          style={styles.navButton}
          activeOpacity={0.7}
          onPress={() =>
            navigation.navigate("History")
          }
        >
          <Ionicons
            name="heart-outline"
            size={23}
            color={
              current === "History"
                ? colors.teal
                : colors.gray
            }
          />

          <Text
            style={
              current === "History"
                ? styles.navActive
                : styles.navItem
            }
          >
            Cuidados
          </Text>
        </TouchableOpacity>
      )}

      {isClinica && (
        <TouchableOpacity
          style={styles.navButton}
          activeOpacity={0.7}
          onPress={() =>
            navigation.navigate("Vaccines")
          }
        >
          <Ionicons
            name="medical-outline"
            size={23}
            color={
              current === "Vaccines"
                ? colors.teal
                : colors.gray
            }
          />

          <Text
            style={
              current === "Vaccines"
                ? styles.navActive
                : styles.navItem
            }
          >
            Vacinas
          </Text>
        </TouchableOpacity>
      )}

      <TouchableOpacity
        style={styles.navButton}
        activeOpacity={0.7}
        onPress={() =>
          navigation.navigate("Profile")
        }
      >
        <Ionicons
          name="person-outline"
          size={23}
          color={
            current === "Profile"
              ? colors.teal
              : colors.gray
          }
        />

        <Text
          style={
            current === "Profile"
              ? styles.navActive
              : styles.navItem
          }
        >
          Perfil
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  bottomNav: {
    position: "absolute",
    left: 20,
    right: 20,
    bottom: 18,
    height: 72,

    backgroundColor: colors.white,
    borderRadius: 24,

    paddingHorizontal: 10,

    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",

    elevation: 8,

    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.12,
    shadowRadius: 6,
  },

  navButton: {
    flex: 1,
    height: 60,

    alignItems: "center",
    justifyContent: "center",

    gap: 4,
  },

  navActive: {
    color: colors.teal,
    fontWeight: "800",
    fontSize: 11,
    textAlign: "center",
  },

  navItem: {
    color: colors.gray,
    fontWeight: "700",
    fontSize: 11,
    textAlign: "center",
  },
});