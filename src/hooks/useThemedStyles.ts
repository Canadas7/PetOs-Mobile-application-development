import { useMemo } from "react";
import type { ThemeColors } from "../styles/colors";
import { useTheme } from "./useTheme";

export function useThemedStyles<T>(createStyles: (colors: ThemeColors) => T): T {
  const { colors } = useTheme();
  return useMemo(() => createStyles(colors), [colors, createStyles]);
}
