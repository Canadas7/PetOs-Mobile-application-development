import AsyncStorage from "@react-native-async-storage/async-storage";

const TOKEN_KEY = "@petos:token";
const USER_NAME_KEY = "@petos:userName";
const USER_EMAIL_KEY = "@petos:userEmail";
const USER_ROLE_KEY = "@petos:userRole";

export type UserRole = "TUTOR" | "CLINICA";

export type AuthSession = {
  token: string;
  name: string;
  email: string;
  role: UserRole;
};

export async function saveAuthSession(
  token: string,
  name: string,
  email: string,
  role: UserRole
) {
  await AsyncStorage.multiSet([
    [TOKEN_KEY, token],
    [USER_NAME_KEY, name],
    [USER_EMAIL_KEY, email],
    [USER_ROLE_KEY, role],
  ]);
}

export async function getToken() {
  return AsyncStorage.getItem(TOKEN_KEY);
}

export async function getUserName() {
  return AsyncStorage.getItem(USER_NAME_KEY);
}

export async function getUserEmail() {
  return AsyncStorage.getItem(USER_EMAIL_KEY);
}

export async function getUserRole() {
  const role = await AsyncStorage.getItem(USER_ROLE_KEY);

  return role as UserRole | null;
}

export async function getAuthSession(): Promise<AuthSession | null> {
  const values = await AsyncStorage.multiGet([
    TOKEN_KEY,
    USER_NAME_KEY,
    USER_EMAIL_KEY,
    USER_ROLE_KEY,
  ]);

  const token = values[0][1];
  const name = values[1][1];
  const email = values[2][1];
  const role = values[3][1] as UserRole | null;

  if (!token || !name || !email || !role) {
    return null;
  }

  return {
    token,
    name,
    email,
    role,
  };
}

export async function isAuthenticated() {
  const token = await getToken();

  return !!token;
}

export async function clearAuthSession() {
  await AsyncStorage.multiRemove([
    TOKEN_KEY,
    USER_NAME_KEY,
    USER_EMAIL_KEY,
    USER_ROLE_KEY,
  ]);
}