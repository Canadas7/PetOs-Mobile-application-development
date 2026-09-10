import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import LoginScreen from "./src/screens/LoginScreen";
import RegisterScreen from "./src/screens/Register";
import HomeScreen from "./src/screens/HomeScreen";
import PetsListScreen from "./src/screens/PetsListScreen";
import PetRegisterScreen from "./src/screens/PetRegisterScreen";
import PetDetailsScreen from "./src/screens/PetDetailsScreen";
import DashboardScreen from "./src/screens/DashboardScreen";
import ProfileScreen from "./src/screens/ProfileScreen";

import { RootStackParamList } from "./src/types/navigation";

const Stack = createNativeStackNavigator<RootStackParamList>();

const queryClient = new QueryClient();

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName="Login"
          screenOptions={{ headerShown: false }}
        >
          <Stack.Screen
            name="Login"
            component={LoginScreen}
          />

          <Stack.Screen
            name="Register"
            component={RegisterScreen}
          />

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
            name="Dashboard"
            component={DashboardScreen}
          />

          <Stack.Screen
            name="Profile"
            component={ProfileScreen}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </QueryClientProvider>
  );
}