export type ThemeMode = "light" | "dark";

export const brandColors = { navy: "#0D1B2A", teal: "#00C9A7", blue: "#1A6EBF" };

// Semantic tokens keep foregrounds independent from surfaces and brand colors.
export const lightColors = {
  background: "#F5F7FA",
  surface: "#FFFFFF",
  surfaceMuted: "#EDF1F5",
  text: brandColors.navy,
  textSecondary: "#526173",
  border: "#D8E1EA",
  accent: brandColors.teal,
  accentText: "#007D68",
  onAccent: brandColors.navy,
  blue: brandColors.blue,
  successSurface: "#E0FAF4",
  successBorder: "#A7DECF",
  infoSurface: "#E8F2FF",
  danger: "#C62828",
  dangerText: "#B42318",
  dangerSurface: "#FFEBEE",
  dangerBorder: "#F3B6B6",
  onDanger: "#FFFFFF",
  shadow: "#000000",
  accentOverlay: "rgba(13,27,42,0.08)",
};

export type ThemeColors = { [Key in keyof typeof lightColors]: string };

export const darkColors: ThemeColors = {
  background: brandColors.navy,
  surface: "#1B2D40",
  surfaceMuted: "#263D52",
  text: "#F3F7FB",
  textSecondary: "#B0C1D2",
  border: "#40586E",
  accent: brandColors.teal,
  accentText: "#55E2C6",
  onAccent: brandColors.navy,
  blue: "#79B8FF",
  successSurface: "#153D39",
  successBorder: "#2C6A5E",
  infoSurface: "#203D5C",
  danger: "#C62828",
  dangerText: "#FFB4B4",
  dangerSurface: "#492B36",
  dangerBorder: "#8F4B58",
  onDanger: "#FFFFFF",
  shadow: "#000000",
  accentOverlay: "rgba(13,27,42,0.08)",
};

export const themeColors: Record<ThemeMode, ThemeColors> = { light: lightColors, dark: darkColors };
