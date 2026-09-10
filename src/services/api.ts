import { getToken } from "../storage/authStorage";

export const API_URL = "https://petos-java.onrender.com";

async function getErrorMessage(response: Response) {
  try {
    const data = await response.json();

    return (
      data.message ||
      data.error ||
      "Não foi possível completar a operação."
    );
  } catch {
    return "Não foi possível completar a operação.";
  }
}

export async function apiRequest<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const token = await getToken();

  const headers = new Headers(options.headers);

  headers.set("Content-Type", "application/json");

  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    throw new Error(await getErrorMessage(response));
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return response.json();
}