import AsyncStorage from "@react-native-async-storage/async-storage";
import type { ThemeMode } from "../styles/colors";

const THEME_KEY = "@petos:theme";

export async function getThemePreference(): Promise<ThemeMode | null> {
  const value = await AsyncStorage.getItem(THEME_KEY);
  return value === "light" || value === "dark" ? value : null;
}

export async function saveThemePreference(mode: ThemeMode): Promise<void> {
  await AsyncStorage.setItem(THEME_KEY, mode);
}
