import { useState } from "react";

import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from "react-native";

import type { ThemeColors } from "../styles/colors";
import { useTheme } from "../hooks/useTheme";
import { useThemedStyles } from "../hooks/useThemedStyles";

import {
  UserRole,
} from "../storage/authStorage";

import { useRegister } from "../hooks/useRegister";

export default function RegisterScreen({
  navigation,
}: any) {
  const { colors, mode } = useTheme();
  const styles = useThemedStyles(createStyles);
  const [name, setName] =
    useState("");

  const [email, setEmail] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [role, setRole] =
    useState<UserRole>("TUTOR");

  const [formError, setFormError] =
    useState("");

  const {
    registerUser,
    isRegistering,
  } = useRegister();

  async function handleRegister() {
    setFormError("");

    if (
      !name.trim() ||
      !email.trim() ||
      !password.trim()
    ) {
      setFormError(
        "Preencha todos os campos."
      );

      return;
    }

    if (name.trim().length < 2) {
      setFormError(
        "Digite um nome válido."
      );

      return;
    }

    if (password.length < 8) {
      setFormError(
        "A senha deve possuir pelo menos 8 caracteres."
      );

      return;
    }

    try {
      await registerUser({
        name: name.trim(),

        email:
          email
            .trim()
            .toLowerCase(),

        password,

        role,
      });
    } catch (error) {
      setFormError(
        error instanceof Error
          ? error.message
          : "Não foi possível criar a conta."
      );
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.logo}>
        PetOS
      </Text>

      <Text style={styles.title}>
        Criar conta
      </Text>

      <Text style={styles.subtitle}>
        Cadastre-se para começar a utilizar o PetOS.
      </Text>

      <TextInput
        keyboardAppearance={mode}
        style={styles.input}
        placeholder="Digite seu nome"
        placeholderTextColor={
          colors.textSecondary
        }
        value={name}
        onChangeText={setName}
      />

      <TextInput
        keyboardAppearance={mode}
        style={styles.input}
        placeholder="Digite seu e-mail"
        placeholderTextColor={
          colors.textSecondary
        }
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
        autoCorrect={false}
      />

      <TextInput
        keyboardAppearance={mode}
        style={styles.input}
        placeholder="Crie uma senha"
        placeholderTextColor={
          colors.textSecondary
        }
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      <Text style={styles.roleTitle}>
        Tipo de usuário
      </Text>

      <View style={styles.roleContainer}>
        <TouchableOpacity
          style={[
            styles.roleButton,

            role === "TUTOR" &&
              styles.roleButtonSelected,
          ]}
          onPress={() =>
            setRole("TUTOR")
          }
        >
          <Text
            style={[
              styles.roleText,

              role === "TUTOR" &&
                styles.roleTextSelected,
            ]}
          >
            Tutor
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.roleButton,

            role === "CLINICA" &&
              styles.roleButtonSelected,
          ]}
          onPress={() =>
            setRole("CLINICA")
          }
        >
          <Text
            style={[
              styles.roleText,

              role === "CLINICA" &&
                styles.roleTextSelected,
            ]}
          >
            Clínica Veterinária
          </Text>
        </TouchableOpacity>
      </View>

      {formError ? (
        <Text style={styles.error}>
          {formError}
        </Text>
      ) : null}

      <TouchableOpacity
        style={[
          styles.button,

          isRegistering &&
            styles.buttonDisabled,
        ]}
        onPress={handleRegister}
        disabled={isRegistering}
      >
        {isRegistering ? (
          <ActivityIndicator
            color={colors.onAccent}
          />
        ) : (
          <Text
            style={styles.buttonText}
          >
            Criar conta
          </Text>
        )}
      </TouchableOpacity>

      <View
        style={
          styles.loginContainer
        }
      >
        <Text
          style={styles.loginText}
        >
          Já possui uma conta?
        </Text>

        <TouchableOpacity
          onPress={() =>
            navigation.navigate(
              "Login"
            )
          }
        >
          <Text
            style={
              styles.loginLink
            }
          >
            Entrar
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const createStyles = (colors: ThemeColors) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    padding: 24,
    justifyContent: "center",
  },

  logo: {
    color: colors.accentText,
    fontSize: 42,
    fontWeight: "800",
    marginBottom: 28,
  },

  title: {
    color: colors.text,
    fontSize: 30,
    fontWeight: "800",
  },

  subtitle: {
    color: colors.textSecondary,
    fontSize: 15,
    marginTop: 8,
    marginBottom: 24,
  },

  input: {
    color: colors.text,
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 16,
    fontSize: 16,
    marginBottom: 16,
  },

  roleTitle: {
    color: colors.text,
    fontSize: 15,
    fontWeight: "700",
    marginTop: 4,
    marginBottom: 10,
  },

  roleContainer: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 18,
  },

  roleButton: {
    flex: 1,
    backgroundColor: colors.surface,
    paddingVertical: 14,
    paddingHorizontal: 8,
    borderRadius: 14,
    alignItems: "center",
    borderWidth: 2,
    borderColor: "transparent",
  },

  roleButtonSelected: {
    backgroundColor: colors.accent,
    borderColor: colors.border,
  },

  roleText: {
    color: colors.text,
    fontSize: 14,
    fontWeight: "700",
    textAlign: "center",
  },

  roleTextSelected: {
    color: colors.onAccent,
  },

  error: {
    color: colors.dangerText,
    fontSize: 14,
    marginBottom: 12,
  },

  button: {
    backgroundColor: colors.accent,
    padding: 16,
    borderRadius: 16,
    alignItems: "center",
  },

  buttonDisabled: {
    opacity: 0.6,
  },

  buttonText: {
    color: colors.onAccent,
    fontSize: 16,
    fontWeight: "800",
  },

  loginContainer: {
    marginTop: 20,
    alignItems: "center",
  },

  loginText: {
    color: colors.text,
    fontSize: 14,
  },

  loginLink: {
    color: colors.accentText,
    fontSize: 15,
    fontWeight: "800",
    marginTop: 6,
  },
});