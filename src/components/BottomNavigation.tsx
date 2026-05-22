import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";

import colors from "../styles/colors";

export default function BottomNavigation({
  navigation,
  current,
}: any) {
  return (
    <View style={styles.bottomNav}>
      <TouchableOpacity
        style={styles.navButton}
        onPress={() => navigation.navigate("Home")}
      >
        <Ionicons
          name="home"
          size={23}
          color={current === "Home" ? colors.teal : colors.gray}
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
        onPress={() => navigation.navigate("PetsList")}
      >
        <MaterialIcons
          name="pets"
          size={23}
          color={current === "PetsList" ? colors.teal : colors.gray}
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

      <TouchableOpacity
        style={styles.navButton}
        onPress={() => navigation.navigate("PetRegister")}
      >
        <Ionicons
          name="add-circle"
          size={23}
          color={
            current === "PetRegister"
              ? colors.teal
              : colors.gray
          }
        />

        <Text
          style={
            current === "PetRegister"
              ? styles.navActive
              : styles.navItem
          }
        >
          Cadastro
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.navButton}
        onPress={() => navigation.navigate("Dashboard")}
      >
        <Ionicons
          name="grid"
          size={23}
          color={current === "Dashboard" ? colors.teal : colors.gray}
        />

        <Text
          style={
            current === "Dashboard"
              ? styles.navActive
              : styles.navItem
          }
        >
          Painel
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  bottomNav: {
    backgroundColor: colors.white,
    borderRadius: 24,
    paddingVertical: 12,
    paddingHorizontal: 10,
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: "auto",
  },
  navButton: {
    alignItems: "center",
    gap: 4,
  },
  navActive: {
    color: colors.teal,
    fontWeight: "800",
    fontSize: 12,
  },
  navItem: {
    color: colors.gray,
    fontWeight: "700",
    fontSize: 12,
  },
});