import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from "react-native";

import { useMutation } from "@tanstack/react-query";

import colors from "../styles/colors";
import { login } from "../services/authService";
import { saveAuthSession } from "../storage/authStorage";
import { useAuth } from "../contexts/AuthContext";

export default function LoginScreen({ navigation }: any) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [formError, setFormError] = useState("");

  const { refreshSession } = useAuth();

  const loginMutation = useMutation({
    mutationFn: login,

    onSuccess: async (data) => {
      await saveAuthSession(
        data.token,
        data.name,
        data.email,
        data.role
      );

      await refreshSession();
    },

    onError: (error: Error) => {
      setFormError(error.message);
    },
  });

  function handleLogin() {
    setFormError("");

    if (!email.trim() || !password.trim()) {
      setFormError("Preencha o e-mail e a senha.");
      return;
    }

    loginMutation.mutate({
      email: email.trim().toLowerCase(),
      password,
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
        placeholder="Digite seu e-mail"
        placeholderTextColor={colors.gray}
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <TextInput
        style={styles.input}
        placeholder="Digite sua senha"
        placeholderTextColor={colors.gray}
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      {formError ? (
        <Text style={styles.error}>{formError}</Text>
      ) : null}

      <TouchableOpacity
        style={[
          styles.button,
          loginMutation.isPending && styles.buttonDisabled,
        ]}
        onPress={handleLogin}
        disabled={loginMutation.isPending}
      >
        {loginMutation.isPending ? (
          <ActivityIndicator color={colors.primary} />
        ) : (
          <Text style={styles.buttonText}>Entrar</Text>
        )}
      </TouchableOpacity>

      <View style={styles.registerContainer}>
        <Text style={styles.registerText}>
          Ainda não possui uma conta?
        </Text>

        <TouchableOpacity
          onPress={() => navigation.navigate("Register")}
        >
          <Text style={styles.registerLink}>
            Criar conta
          </Text>
        </TouchableOpacity>
      </View>
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

  error: {
    color: "#FFB4B4",
    fontSize: 14,
    marginBottom: 14,
  },

  button: {
    backgroundColor: colors.teal,
    padding: 16,
    borderRadius: 16,
    alignItems: "center",
    marginTop: 8,
  },

  buttonDisabled: {
    opacity: 0.6,
  },

  buttonText: {
    color: colors.primary,
    fontSize: 16,
    fontWeight: "800",
  },

  registerContainer: {
    marginTop: 24,
    alignItems: "center",
  },

  registerText: {
    color: colors.white,
    fontSize: 14,
  },

  registerLink: {
    color: colors.teal,
    fontSize: 15,
    fontWeight: "800",
    marginTop: 6,
  },
});