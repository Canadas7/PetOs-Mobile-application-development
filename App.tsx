import {
  ActivityIndicator,
  StyleSheet,
  View,
} from "react-native";

import { NavigationContainer } from "@react-navigation/native";
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
import VaccinesScreen from "./src/screens/VaccinesScreen";

import { RootStackParamList } from "./src/types/navigation";

import {
  AuthProvider,
  useAuth,
} from "./src/contexts/AuthContext";

import colors from "./src/styles/colors";

const Stack =
  createNativeStackNavigator<RootStackParamList>();

const queryClient = new QueryClient();

function AppNavigator() {
  const { session, loading } = useAuth();

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator
          size="large"
          color={colors.teal}
        />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
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
      <AuthProvider>
        <AppNavigator />
      </AuthProvider>
    </QueryClientProvider>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    backgroundColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
  },
});