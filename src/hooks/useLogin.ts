import { useMutation } from "@tanstack/react-query";

import { login } from "../services/authService";
import { saveAuthSession } from "../storage/authStorage";
import { useAuth } from "../contexts/AuthContext";

type LoginCredentials = {
  email: string;
  password: string;
};

export function useLogin() {
  const { refreshSession } = useAuth();

  const loginMutation = useMutation({
    mutationFn: (credentials: LoginCredentials) =>
      login(credentials),

    onSuccess: async (data) => {
      await saveAuthSession(
        data.token,
        data.name,
        data.email,
        data.role
      );

      await refreshSession();
    },
  });

  async function loginUser(
    credentials: LoginCredentials
  ) {
    return loginMutation.mutateAsync(
      credentials
    );
  }

  return {
    loginUser,

    isLoggingIn:
      loginMutation.isPending,

    loginError:
      loginMutation.error,
  };
}