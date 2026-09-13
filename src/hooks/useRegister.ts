import { useMutation } from "@tanstack/react-query";

import { register } from "../services/authService";
import {
  saveAuthSession,
  UserRole,
} from "../storage/authStorage";
import { useAuth } from "../contexts/AuthContext";

type RegisterData = {
  name: string;
  email: string;
  password: string;
  role: UserRole;
};

export function useRegister() {
  const { refreshSession } = useAuth();

  const registerMutation = useMutation({
    mutationFn: (data: RegisterData) =>
      register(data),

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

  async function registerUser(
    data: RegisterData
  ) {
    return registerMutation.mutateAsync(
      data
    );
  }

  return {
    registerUser,

    isRegistering:
      registerMutation.isPending,

    registerError:
      registerMutation.error,
  };
}
