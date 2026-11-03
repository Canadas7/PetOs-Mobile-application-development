import {
  ActivityIndicator,
  StyleSheet,
  View,
} from "react-native";

import { DarkTheme, DefaultTheme, NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import {
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";

import LoginScreen from "./src/screens/LoginScreen";
import RegisterScreen from "./src/screens/Register";

import HomeScreen from "./src/screens/HomeScreen";
import PetsListScreen from "./src/screens/PetsListScreen";
import PetRegisterScreen from "./src/screens/PetRegisterScreen";
import PetDetailsScreen from "./src/screens/PetDetailsScreen";
import HistoryScreen from "./src/screens/HistoryScreen";
import ProfileScreen from "./src/screens/ProfileScreen";
import AboutScreen from "./src/screens/AboutScreen";
import VaccinesScreen from "./src/screens/VaccinesScreen";

import { RootStackParamList } from "./src/types/navigation";

import {
  AuthProvider,
  useAuth,
} from "./src/contexts/AuthContext";

import { StatusBar } from "expo-status-bar";
import { ThemeProvider } from "./src/contexts/ThemeContext";
import { useTheme } from "./src/hooks/useTheme";

const Stack =
  createNativeStackNavigator<RootStackParamList>();

const queryClient = new QueryClient();

function AppNavigator() {
  const { session, loading } = useAuth();
  const { mode, colors, themeLoading } = useTheme();
  const baseTheme = mode === "dark" ? DarkTheme : DefaultTheme;
  const navigationTheme = {
    ...baseTheme,
    colors: {
      ...baseTheme.colors,
      primary: colors.accentText,
      background: colors.background,
      card: colors.surface,
      text: colors.text,
      border: colors.border,
      notification: colors.danger,
    },
  };

  if (loading || themeLoading) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: colors.background }]}>
        <StatusBar style={mode === "dark" ? "light" : "dark"} />
        <ActivityIndicator
          size="large"
          color={colors.accentText}
        />
      </View>
    );
  }

  return (
    <NavigationContainer theme={navigationTheme}>
      <StatusBar style={mode === "dark" ? "light" : "dark"} />
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: colors.background },
        }}
      >
        {!session ? (
          <>
            <Stack.Screen
              name="Login"
              component={LoginScreen}
            />

            <Stack.Screen
              name="Register"
              component={RegisterScreen}
            />
          </>
        ) : (
          <>
            <Stack.Screen
              name="Home"
              component={HomeScreen}
            />

            <Stack.Screen
              name="PetsList"
              component={PetsListScreen}
            />

            <Stack.Screen
              name="PetRegister"
              component={PetRegisterScreen}
            />

            <Stack.Screen
              name="PetDetails"
              component={PetDetailsScreen}
            />

            <Stack.Screen
              name="History"
              component={HistoryScreen}
            />

            <Stack.Screen
              name="Profile"
              component={ProfileScreen}
            />

            <Stack.Screen name="About" component={AboutScreen} />

            <Stack.Screen
              name="Vaccines"
              component={VaccinesScreen}
            />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <AuthProvider>
          <AppNavigator />
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});
