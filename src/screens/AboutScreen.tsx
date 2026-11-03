import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Constants from "expo-constants";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { SafeAreaView } from "react-native-safe-area-context";

import type { RootStackParamList } from "../types/navigation";
import type { ThemeColors } from "../styles/colors";
import { useTheme } from "../hooks/useTheme";
import { useThemedStyles } from "../hooks/useThemedStyles";

export default function AboutScreen({ navigation }: NativeStackScreenProps<RootStackParamList, "About">) {
  const { colors } = useTheme();
  const styles = useThemedStyles(createStyles);
  const commit = Constants.expoConfig?.extra?.referenceCommit;
  const details = [
    { label: "Versão", value: Constants.expoConfig?.version ?? "Não informada" },
    { label: "Entrega", value: "Sprint 4 / 2026" },
    { label: "Tecnologia", value: "React Native + Expo" },
    { label: "Commit de referência", value: typeof commit === "string" ? commit : "Não disponível nesta execução" },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            accessibilityRole="button"
            accessibilityLabel="Voltar ao perfil"
            style={styles.backButton}
          >
            <Ionicons name="arrow-back" size={24} color={colors.text} />
          </TouchableOpacity>
          <Text style={styles.title}>Sobre o App</Text>
        </View>

        <View style={styles.brandCard}>
          <View style={styles.logo}>
            <Ionicons name="paw" size={44} color={colors.onAccent} />
          </View>
          <Text style={styles.appName}>PetOS</Text>
          <Text style={styles.subtitle}>Cuidado e saúde para o seu pet</Text>
        </View>

        <View style={styles.infoCard}>
          {details.map(({ label, value }, index) => (
            <View key={label} style={[styles.row, index > 0 && styles.divider]}>
              <Text style={styles.label}>{label}</Text>
              <Text selectable style={styles.value}>{value}</Text>
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const createStyles = (colors: ThemeColors) => StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: 24, paddingBottom: 40 },
  header: { flexDirection: "row", alignItems: "center", gap: 12, marginBottom: 24 },
  backButton: { minWidth: 48, minHeight: 48, alignItems: "center", justifyContent: "center", borderRadius: 16, backgroundColor: colors.surface },
  title: { flex: 1, fontSize: 30, fontWeight: "800", color: colors.text },
  brandCard: { padding: 24, borderRadius: 24, backgroundColor: colors.surface, alignItems: "center", marginBottom: 18 },
  logo: { width: 96, height: 96, borderRadius: 48, backgroundColor: colors.accent, alignItems: "center", justifyContent: "center", marginBottom: 14 },
  appName: { fontSize: 30, fontWeight: "800", color: colors.text },
  subtitle: { fontSize: 14, color: colors.textSecondary, textAlign: "center", marginTop: 6 },
  infoCard: { backgroundColor: colors.surface, borderRadius: 20, paddingHorizontal: 18 },
  row: { paddingVertical: 18, gap: 6 },
  divider: { borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: colors.border },
  label: { color: colors.textSecondary, fontSize: 12 },
  value: { color: colors.text, fontSize: 16, fontWeight: "600" },
});
