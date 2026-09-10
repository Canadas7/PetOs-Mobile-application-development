import AsyncStorage from "@react-native-async-storage/async-storage";

const TOKEN_KEY = "@petos:token";
const USER_NAME_KEY = "@petos:userName";
const USER_EMAIL_KEY = "@petos:userEmail";
const USER_ROLE_KEY = "@petos:userRole";

export async function saveAuthSession(
  token: string,
  name: string,
  email: string,
  role: string
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
  return AsyncStorage.getItem(USER_ROLE_KEY);
}

export async function clearAuthSession() {
  await AsyncStorage.multiRemove([
    TOKEN_KEY,
    USER_NAME_KEY,
    USER_EMAIL_KEY,
    USER_ROLE_KEY,
  ]);
}