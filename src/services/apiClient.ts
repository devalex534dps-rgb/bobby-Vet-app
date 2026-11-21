/// <reference types="vite/client" />
const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:8080/api/v1";

export const TOKEN_STORAGE_KEY = "bobby_access_token";

export interface BackendApiResponse<T> {
  success: boolean;
  data: T;
  message?: string | null;
  timestamp?: string;
}

export const getAccessToken = (): string | null => {
  try {
    return localStorage.getItem(TOKEN_STORAGE_KEY);
  } catch {
    return null;
  }
};

export const setAccessToken = (token: string): void => {
  try {
    localStorage.setItem(TOKEN_STORAGE_KEY, token);
  } catch {
    // ignore storage errors
  }
};

export const clearAccessToken = (): void => {
  try {
    localStorage.removeItem(TOKEN_STORAGE_KEY);
  } catch {
    // ignore storage errors
  }
};

export async function apiRequest<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const token = getAccessToken();
  const headers = new Headers(options.headers || {});
  if (!headers.has("Content-Type") && options.body) {
    headers.set("Content-Type", "application/json");
  }
  if (token && !headers.has("Authorization")) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers,
  });

  const payload = await response.json().catch(() => null);

  if (!response.ok) {
    const errMsg =
      payload?.message ||
      `Error HTTP ${response.status}: ${response.statusText}`;
    throw new Error(errMsg);
  }

  if (payload && typeof payload === "object" && "data" in payload) {
    return (payload as BackendApiResponse<T>).data;
  }

  return payload as T;
}
