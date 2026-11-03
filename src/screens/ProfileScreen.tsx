import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";

import { Ionicons } from "@expo/vector-icons";

import type { ThemeColors } from "../styles/colors";
import { useTheme } from "../hooks/useTheme";
import { useThemedStyles } from "../hooks/useThemedStyles";
import BottomNavigation from "../components/BottomNavigation";
import { useAuth } from "../contexts/AuthContext";

export default function ProfileScreen({ navigation }: any) {
  const { colors, mode, setTheme, savingTheme, themeError } = useTheme();
  const styles = useThemedStyles(createStyles);
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
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
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
            color={colors.accentText}
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
            color={colors.accentText}
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
            color={colors.accentText}
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

      <View style={styles.themeCard}>
        <Text style={styles.themeTitle}>Aparência</Text>
        <Text style={styles.label}>Escolha o tema do PetOS</Text>
        <View style={styles.themeOptions} accessibilityRole="radiogroup">
          {(["light", "dark"] as const).map((option) => (
            <TouchableOpacity
              key={option}
              accessibilityRole="radio"
              accessibilityLabel={option === "light" ? "Tema claro" : "Tema escuro"}
              accessibilityState={{ checked: mode === option, disabled: savingTheme }}
              disabled={savingTheme}
              onPress={() => { void setTheme(option); }}
              style={[styles.themeOption, mode === option && styles.themeOptionSelected]}
            >
              <Ionicons
                name={option === "light" ? "sunny-outline" : "moon-outline"}
                size={20}
                color={mode === option ? colors.onAccent : colors.text}
              />
              <Text style={[styles.themeOptionText, mode === option && styles.themeOptionTextSelected]}>
                {option === "light" ? "Claro" : "Escuro"}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
        {savingTheme && <Text style={styles.label} accessibilityLiveRegion="polite">Salvando preferência...</Text>}
        {themeError && <Text style={styles.themeError} accessibilityRole="alert">{themeError}</Text>}
      </View>

      <TouchableOpacity
        style={styles.logoutButton}
        onPress={handleLogout}
      >
        <Ionicons
          name="log-out-outline"
          size={22}
          color={colors.onAccent}
        />

        <Text style={styles.logoutText}>
          Sair da conta
        </Text>
      </TouchableOpacity>
      </ScrollView>

      <BottomNavigation
        navigation={navigation}
        current="Profile"
      />
    </View>
  );
}

const createStyles = (colors: ThemeColors) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },

  content: {
    padding: 24,
    paddingTop: 50,
    paddingBottom: 120,
  },

  themeCard: {
    backgroundColor: colors.surface,
    borderRadius: 20,
    padding: 18,
    marginTop: 18,
  },
  themeTitle: {
    color: colors.text,
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 6,
  },
  themeOptions: {
    flexDirection: "row",
    gap: 12,
    marginTop: 12,
    marginBottom: 8,
  },
  themeOption: {
    flex: 1,
    minHeight: 48,
    padding: 12,
    borderRadius: 14,
    backgroundColor: colors.surfaceMuted,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  themeOptionSelected: { backgroundColor: colors.accent },
  themeOptionText: { color: colors.text, fontWeight: "700" },
  themeOptionTextSelected: { color: colors.onAccent },
  themeError: {
    color: colors.dangerText,
    fontSize: 13,
    marginTop: 8,
  },

  title: {
    color: colors.text,
    fontSize: 30,
    fontWeight: "800",
    marginBottom: 24,
  },

  profileCard: {
    backgroundColor: colors.surface,
    borderRadius: 24,
    padding: 24,
    alignItems: "center",
    marginBottom: 18,
  },

  avatar: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: colors.accent,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 14,
  },

  avatarText: {
    color: colors.onAccent,
    fontSize: 38,
    fontWeight: "800",
  },

  name: {
    color: colors.text,
    fontSize: 26,
    fontWeight: "800",
    textAlign: "center",
  },

  role: {
    color: colors.textSecondary,
    fontSize: 14,
    marginTop: 6,
  },

  infoCard: {
    backgroundColor: colors.surface,
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
    color: colors.textSecondary,
    fontSize: 12,
    marginBottom: 3,
  },

  infoText: {
    color: colors.text,
    fontSize: 16,
    fontWeight: "600",
  },

  divider: {
    height: 1,
    backgroundColor: colors.border,
  },

  logoutButton: {
    backgroundColor: colors.accent,
    borderRadius: 16,
    padding: 16,
    marginTop: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },

  logoutText: {
    color: colors.onAccent,
    fontSize: 16,
    fontWeight: "800",
  },
});
