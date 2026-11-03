import { createContext, useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { themeColors, type ThemeColors, type ThemeMode } from "../styles/colors";
import { getThemePreference, saveThemePreference } from "../storage/themeStorage";

type ThemeContextValue = {
  mode: ThemeMode;
  colors: ThemeColors;
  themeLoading: boolean;
  savingTheme: boolean;
  themeError: string | null;
  setTheme: (mode: ThemeMode) => Promise<void>;
};

export const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [mode, setMode] = useState<ThemeMode>("dark");
  const [themeLoading, setThemeLoading] = useState(true);
  const [savingTheme, setSavingTheme] = useState(false);
  const [themeError, setThemeError] = useState<string | null>(null);
  const savingRef = useRef(false);

  useEffect(() => {
    let active = true;
    getThemePreference()
      .then((saved) => { if (active && saved) setMode(saved); })
      .catch(() => {
        if (active) setThemeError("Não foi possível carregar o tema salvo. Escolha o tema novamente.");
      })
      .finally(() => { if (active) setThemeLoading(false); });
    return () => { active = false; };
  }, []);

  const setTheme = useCallback(async (next: ThemeMode) => {
    if (themeLoading || savingRef.current) return;
    savingRef.current = true;
    setSavingTheme(true);
    setThemeError(null);
    const previous = mode;
    setMode(next);
    try {
      await saveThemePreference(next);
    } catch {
      setMode(previous);
      setThemeError("Não foi possível salvar o tema. Tente novamente.");
    } finally {
      savingRef.current = false;
      setSavingTheme(false);
    }
  }, [mode, themeLoading]);

  const value = useMemo(() => ({
    mode, colors: themeColors[mode], themeLoading, savingTheme, themeError, setTheme,
  }), [mode, themeLoading, savingTheme, themeError, setTheme]);

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}
