const API_URL = "https://petos-java.onrender.com";

export type AuthResponse = {
  token: string;
  tokenType: string;
  expiresInSeconds: number;
  userId: number;
  name: string;
  email: string;
  role: "TUTOR" | "CLINICA";
};

export type LoginData = {
  email: string;
  password: string;
};

export type RegisterData = {
  name: string;
  email: string;
  password: string;
  role: "TUTOR" | "CLINICA";
};

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

export async function login(data: LoginData): Promise<AuthResponse> {
  const response = await fetch(`${API_URL}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error(await getErrorMessage(response));
  }

  return response.json();
}

export async function register(
  data: RegisterData
): Promise<AuthResponse> {
  const response = await fetch(`${API_URL}/auth/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error(await getErrorMessage(response));
  }

  return response.json();
}