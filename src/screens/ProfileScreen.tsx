import { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";

import { Ionicons } from "@expo/vector-icons";

import colors from "../styles/colors";
import BottomNavigation from "../components/BottomNavigation";

import {
  getUserName,
  getUserEmail,
  getUserRole,
  clearAuthSession,
} from "../storage/authStorage";

export default function ProfileScreen({ navigation }: any) {
  const [userName, setUserName] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [userRole, setUserRole] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      loadUserData();
    });

    return unsubscribe;
  }, [navigation]);

  async function loadUserData() {
    try {
      setLoading(true);

      const name = await getUserName();
      const email = await getUserEmail();
      const role = await getUserRole();

      setUserName(name || "Tutor");
      setUserEmail(email || "");
      setUserRole(role || "TUTOR");
    } catch (error) {
      console.log("Erro ao carregar usuário:", error);
    } finally {
      setLoading(false);
    }
  }

  async function handleLogout() {
    try {
      await clearAuthSession();

      navigation.reset({
        index: 0,
        routes: [{ name: "Login" }],
      });
    } catch (error) {
      console.log("Erro ao sair:", error);
    }
  }

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.teal} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Meu Perfil</Text>

      <View style={styles.profileCard}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>
            {userName.charAt(0).toUpperCase()}
          </Text>
        </View>

        <Text style={styles.name}>{userName}</Text>

        <Text style={styles.role}>
          {userRole === "TUTOR" ? "Tutor" : userRole}
        </Text>
      </View>

      <View style={styles.infoCard}>
        <View style={styles.infoRow}>
          <Ionicons
            name="person-outline"
            size={24}
            color={colors.teal}
          />

          <View>
            <Text style={styles.label}>Nome</Text>
            <Text style={styles.infoText}>{userName}</Text>
          </View>
        </View>

        <View style={styles.divider} />

        <View style={styles.infoRow}>
          <Ionicons
            name="mail-outline"
            size={24}
            color={colors.teal}
          />

          <View>
            <Text style={styles.label}>E-mail</Text>
            <Text style={styles.infoText}>{userEmail}</Text>
          </View>
        </View>

        <View style={styles.divider} />

        <View style={styles.infoRow}>
          <Ionicons
            name="shield-checkmark-outline"
            size={24}
            color={colors.teal}
          />

          <View>
            <Text style={styles.label}>Perfil</Text>
            <Text style={styles.infoText}>
              {userRole === "TUTOR" ? "Tutor" : userRole}
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

        <Text style={styles.logoutText}>Sair da conta</Text>
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

  loadingContainer: {
    flex: 1,
    backgroundColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
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