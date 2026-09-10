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
import { register } from "../services/authService";
import { saveAuthSession } from "../storage/authStorage";

export default function RegisterScreen({ navigation }: any) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [formError, setFormError] = useState("");

  const registerMutation = useMutation({
    mutationFn: register,

    onSuccess: async (data) => {
      await saveAuthSession(
        data.token,
        data.name,
        data.email,
        data.role
      );

      navigation.reset({
        index: 0,
        routes: [{ name: "Home" }],
      });
    },

    onError: (error: Error) => {
      setFormError(error.message);
    },
  });

  function handleRegister() {
    setFormError("");

    if (!name.trim() || !email.trim() || !password.trim()) {
      setFormError("Preencha todos os campos.");
      return;
    }

    if (name.trim().length < 2) {
      setFormError("Digite um nome válido.");
      return;
    }

    if (password.length < 8) {
      setFormError("A senha deve possuir pelo menos 8 caracteres.");
      return;
    }

    registerMutation.mutate({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      password,
      role: "TUTOR",
    });
  }

  return (
    <View style={styles.container}>
      <Text style={styles.logo}>PetOS</Text>

      <Text style={styles.title}>Criar conta</Text>

      <Text style={styles.subtitle}>
        Cadastre-se para começar a cuidar dos seus pets.
      </Text>

      <TextInput
        style={styles.input}
        placeholder="Digite seu nome"
        placeholderTextColor={colors.gray}
        value={name}
        onChangeText={setName}
      />

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
        placeholder="Crie uma senha"
        placeholderTextColor={colors.gray}
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      {formError ? (
        <Text style={styles.error}>{formError}</Text>
      ) : null}

      <TouchableOpacity
        style={[
          styles.button,
          registerMutation.isPending && styles.buttonDisabled,
        ]}
        onPress={handleRegister}
        disabled={registerMutation.isPending}
      >
        {registerMutation.isPending ? (
          <ActivityIndicator color={colors.primary} />
        ) : (
          <Text style={styles.buttonText}>Criar conta</Text>
        )}
      </TouchableOpacity>

      <View style={styles.loginContainer}>
        <Text style={styles.loginText}>
          Já possui uma conta?
        </Text>

        <TouchableOpacity
          onPress={() => navigation.navigate("Login")}
        >
          <Text style={styles.loginLink}>Entrar</Text>
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
    marginBottom: 36,
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

  loginContainer: {
    marginTop: 24,
    alignItems: "center",
  },

  loginText: {
    color: colors.white,
    fontSize: 14,
  },

  loginLink: {
    color: colors.teal,
    fontSize: 15,
    fontWeight: "800",
    marginTop: 6,
  },
});