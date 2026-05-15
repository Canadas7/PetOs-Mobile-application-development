import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from "react-native";

import colors from "../styles/colors";

export default function LoginScreen({ navigation }: any) {
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");

  function handleLogin() {
    if (!userName || !password) {
      return;
    }

    navigation.navigate("Home", {
      userName,
    });
  }

  return (
    <View style={styles.container}>
      <Text style={styles.logo}>PetOS</Text>

      <Text style={styles.title}>Bem-vindo!</Text>

      <Text style={styles.subtitle}>
        Entre para acompanhar a saúde do seu pet.
      </Text>

      <TextInput
        style={styles.input}
        placeholder="Digite seu nome"
        placeholderTextColor={colors.gray}
        value={userName}
        onChangeText={setUserName}
      />

      <TextInput
        style={styles.input}
        placeholder="Digite sua senha"
        placeholderTextColor={colors.gray}
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Entrar</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.primary,
    padding: 24,
    justifyContent: "center",
  },
  logo: {
    color: colors.teal,
    fontSize: 42,
    fontWeight: "800",
    marginBottom: 40,
  },
  title: {
    color: colors.white,
    fontSize: 30,
    fontWeight: "800",
  },
  subtitle: {
    color: colors.mint,
    fontSize: 15,
    marginTop: 8,
    marginBottom: 28,
  },
  input: {
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 16,
    fontSize: 16,
    marginBottom: 18,
  },
  button: {
    backgroundColor: colors.teal,
    padding: 16,
    borderRadius: 16,
    alignItems: "center",
    marginTop: 8,
  },
  buttonText: {
    color: colors.primary,
    fontSize: 16,
    fontWeight: "800",
  },
});