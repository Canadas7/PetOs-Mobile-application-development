import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";

import {
  AuthSession,
  clearAuthSession,
  getAuthSession,
} from "../storage/authStorage";

type AuthContextData = {
  session: AuthSession | null;
  loading: boolean;
  refreshSession: () => Promise<void>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextData>(
  {} as AuthContextData
);

export function AuthProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [session, setSession] = useState<AuthSession | null>(null);
  const [loading, setLoading] = useState(true);

  async function loadSession() {
    try {
      const storedSession = await getAuthSession();
      setSession(storedSession);
    } catch (error) {
      console.log("Erro ao carregar sessão:", error);
      setSession(null);
    } finally {
      setLoading(false);
    }
  }

  async function refreshSession() {
    const storedSession = await getAuthSession();
    setSession(storedSession);
  }

  async function signOut() {
    await clearAuthSession();
    setSession(null);
  }

  useEffect(() => {
    loadSession();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        session,
        loading,
        refreshSession,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}