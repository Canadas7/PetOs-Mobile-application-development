import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from "react-native";

import { Ionicons } from "@expo/vector-icons";

import colors from "../styles/colors";
import BottomNavigation from "../components/BottomNavigation";
import { useAuth } from "../contexts/AuthContext";

export default function ProfileScreen({ navigation }: any) {
  const { session, signOut } = useAuth();

  async function handleLogout() {
    try {
      await signOut();
    } catch (error) {
      console.log("Erro ao sair:", error);
    }
  }

  const userName = session?.name || "Usuário";
  const userEmail = session?.email || "";

  const userRole =
    session?.role === "CLINICA"
      ? "Clínica Veterinária"
      : "Tutor";

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Meu Perfil</Text>

      <View style={styles.profileCard}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>
            {userName.charAt(0).toUpperCase()}
          </Text>
        </View>

        <Text style={styles.name}>
          {userName}
        </Text>

        <Text style={styles.role}>
          {userRole}
        </Text>
      </View>

      <View style={styles.infoCard}>
        <View style={styles.infoRow}>
          <Ionicons
            name="person-outline"
            size={24}
            color={colors.teal}
          />

          <View style={styles.infoContent}>
            <Text style={styles.label}>
              Nome
            </Text>

            <Text style={styles.infoText}>
              {userName}
            </Text>
          </View>
        </View>

        <View style={styles.divider} />

        <View style={styles.infoRow}>
          <Ionicons
            name="mail-outline"
            size={24}
            color={colors.teal}
          />

          <View style={styles.infoContent}>
            <Text style={styles.label}>
              E-mail
            </Text>

            <Text style={styles.infoText}>
              {userEmail}
            </Text>
          </View>
        </View>

        <View style={styles.divider} />

        <View style={styles.infoRow}>
          <Ionicons
            name={
              session?.role === "CLINICA"
                ? "medkit-outline"
                : "paw-outline"
            }
            size={24}
            color={colors.teal}
          />

          <View style={styles.infoContent}>
            <Text style={styles.label}>
              Tipo de usuário
            </Text>

            <Text style={styles.infoText}>
              {userRole}
            </Text>
          </View>
        </View>
      </View>

      <TouchableOpacity
        style={styles.logoutButton}
        onPress={handleLogout}
      >
        <Ionicons
          name="log-out-outline"
          size={22}
          color={colors.white}
        />

        <Text style={styles.logoutText}>
          Sair da conta
        </Text>
      </TouchableOpacity>

      <BottomNavigation
        navigation={navigation}
        current="Profile"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.primary,
    padding: 24,
    paddingTop: 50,
  },

  title: {
    color: colors.white,
    fontSize: 30,
    fontWeight: "800",
    marginBottom: 24,
  },

  profileCard: {
    backgroundColor: colors.white,
    borderRadius: 24,
    padding: 24,
    alignItems: "center",
    marginBottom: 18,
  },

  avatar: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: colors.teal,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 14,
  },

  avatarText: {
    color: colors.primary,
    fontSize: 38,
    fontWeight: "800",
  },

  name: {
    color: colors.primary,
    fontSize: 26,
    fontWeight: "800",
    textAlign: "center",
  },

  role: {
    color: colors.gray,
    fontSize: 14,
    marginTop: 6,
  },

  infoCard: {
    backgroundColor: colors.white,
    borderRadius: 20,
    padding: 18,
  },

  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    paddingVertical: 10,
  },

  infoContent: {
    flex: 1,
  },

  label: {
    color: colors.gray,
    fontSize: 12,
    marginBottom: 3,
  },

  infoText: {
    color: colors.primary,
    fontSize: 16,
    fontWeight: "600",
  },

  divider: {
    height: 1,
    backgroundColor: "#EEEEEE",
  },

  logoutButton: {
    backgroundColor: colors.teal,
    borderRadius: 16,
    padding: 16,
    marginTop: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },

  logoutText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: "800",
  },
});