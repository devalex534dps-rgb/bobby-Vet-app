/// <reference types="vite/client" />
import axios, { AxiosError, type AxiosRequestConfig } from "axios";

export const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:8080/api/v1";

export const TOKEN_STORAGE_KEY = "bobby_access_token";
export const UNAUTHORIZED_EVENT = "bobby:unauthorized";

export interface BackendApiResponse<T> {
  success: boolean;
  data: T;
  message?: string | null;
  timestamp?: string;
}

export interface ApiErrorPayload {
  status?: number;
  error?: string;
  message?: string;
  fieldErrors?: Record<string, string> | null;
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

export const isTokenExpired = (token: string): boolean => {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return true;
    const base64 = parts[1].replace(/-/g, "+").replace(/_/g, "/");
    const padded = base64.padEnd(base64.length + ((4 - (base64.length % 4)) % 4), "=");
    const payload = JSON.parse(atob(padded)) as { exp?: number };
    if (typeof payload.exp !== "number") return false;
    return payload.exp * 1000 <= Date.now();
  } catch {
    return true;
  }
};

export const notifyUnauthorized = (): void => {
  clearAccessToken();
  try {
    localStorage.removeItem("bobby_active_user");
  } catch {
    // ignore storage errors
  }
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent(UNAUTHORIZED_EVENT));
  }
};

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 15000,
});

apiClient.interceptors.request.use(
  (config) => {
    const requestUrl = config.url || "";
    const isPublicEndpoint =
      requestUrl.includes("/auth/login") ||
      requestUrl.includes("/auth/register") ||
      requestUrl.includes("/auth/forgot-password") ||
      requestUrl.includes("/auth/reset-password") ||
      requestUrl.includes("/public/");

    if (isPublicEndpoint) {
      return config;
    }

    const token = getAccessToken();
    if (token) {
      if (isTokenExpired(token)) {
        notifyUnauthorized();
        return Promise.reject(new Error("Tu sesión ha expirado. Inicia sesión nuevamente."));
      }
      config.headers = config.headers ?? {};
      if (!config.headers.Authorization) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError<ApiErrorPayload>) => {
    if (!axios.isAxiosError(error)) {
      return Promise.reject(error);
    }
    const status = error.response?.status;
    const data = error.response?.data;

    if (status === 401) {
      const requestUrl = error.config?.url || "";
      const isAuthEndpoint =
        requestUrl.includes("/auth/login") || requestUrl.includes("/auth/register");
      if (!isAuthEndpoint) {
        notifyUnauthorized();
      }
    }

    let message = data?.message;
    if (!message && data?.fieldErrors) {
      const firstError = Object.values(data.fieldErrors)[0];
      if (firstError) message = firstError;
    }
    if (!message) {
      if (error.code === "ERR_NETWORK" || !error.response) {
        message = "No se pudo conectar con el servidor backend.";
      } else {
        message = `Error HTTP ${status}: ${error.response?.statusText || error.message}`;
      }
    }

    return Promise.reject(new Error(message));
  }
);

export async function apiRequest<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const method = (options.method || "GET").toUpperCase();
  const config: AxiosRequestConfig = {
    url: path,
    method,
    headers: options.headers as Record<string, string> | undefined,
  };

  if (options.body !== undefined) {
    config.data =
      typeof options.body === "string" ? JSON.parse(options.body) : options.body;
  }

  const response = await apiClient.request<T | BackendApiResponse<T>>(config);
  const payload = response.data;

  if (payload && typeof payload === "object" && "data" in payload) {
    return (payload as BackendApiResponse<T>).data;
  }

  return payload as T;
}
