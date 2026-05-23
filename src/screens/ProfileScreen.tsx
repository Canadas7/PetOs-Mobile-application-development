import { useEffect, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from "@expo/vector-icons";

import colors from "../styles/colors";
import BottomNavigation from "../components/BottomNavigation";

export default function ProfileScreen({ navigation }: any) {
  const [userName, setUserName] = useState("Tutor");

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      loadUserName();
    });

    return unsubscribe;
  }, [navigation]);

  async function loadUserName() {
    const storedName = await AsyncStorage.getItem("userName");

    if (storedName) {
      setUserName(storedName);
    }
  }

  async function handleLogout() {
    await AsyncStorage.removeItem("userName");
    navigation.navigate("Login");
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Perfil</Text>

      <View style={styles.card}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>
            {userName.charAt(0).toUpperCase()}
          </Text>
        </View>

        <Text style={styles.name}>{userName}</Text>
        <Text style={styles.role}>Tutor responsável</Text>
      </View>

      <View style={styles.infoCard}>
        <View style={styles.infoRow}>
          <Ionicons name="person-outline" size={22} color={colors.teal} />
          <Text style={styles.infoText}>Nome: {userName}</Text>
        </View>

        <View style={styles.infoRow}>
          <Ionicons name="shield-checkmark-outline" size={22} color={colors.teal} />
          <Text style={styles.infoText}>Conta ativa no PetOS</Text>
        </View>
      </View>

      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutText}>Sair</Text>
      </TouchableOpacity>

      <BottomNavigation navigation={navigation} current="Profile" />
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
    fontSize: 32,
    fontWeight: "800",
    marginBottom: 24,
  },
  card: {
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
    marginTop: 4,
  },
  infoCard: {
    backgroundColor: colors.white,
    borderRadius: 20,
    padding: 18,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 14,
  },
  infoText: {
    color: colors.primary,
    fontSize: 16,
    fontWeight: "600",
  },
  logoutButton: {
    backgroundColor: colors.teal,
    padding: 16,
    borderRadius: 16,
    alignItems: "center",
    marginTop: 22,
  },
  logoutText: {
    color: colors.primary,
    fontSize: 16,
    fontWeight: "800",
  },
});