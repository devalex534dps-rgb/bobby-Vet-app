import {
  apiRequest,
  setAccessToken,
  clearAccessToken,
  getAccessToken,
  isTokenExpired,
} from "./apiClient";

export type UserRole = "ADMIN" | "VETERINARIO" | "CLIENTE";

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  fullName: string;
  email: string;
  phone?: string;
  image: string;
  role: UserRole;
}

interface BackendAuthResponse {
  token?: string;
  accessToken?: string;
  tokenType: string;
  user: {
    id: string;
    fullName: string;
    email: string;
    phone?: string;
    role: UserRole;
    avatarUrl?: string;
  };
}

const STORAGE_KEY = "bobby_active_user";

export const EMPTY_USER: User = {
  id: "",
  firstName: "Invitado",
  lastName: "",
  fullName: "Invitado",
  email: "",
  image: "https://ui-avatars.com/api/?name=Bobby&background=024594&color=fff",
  role: "CLIENTE",
};

const mapBackendUser = (u: BackendAuthResponse["user"]): User => {
  const parts = (u.fullName || "Usuario").trim().split(/\s+/);
  const firstName = parts[0] || "Usuario";
  const lastName = parts.slice(1).join(" ") || "";

  return {
    id: u.id,
    firstName,
    lastName,
    fullName: u.fullName,
    email: u.email,
    phone: u.phone,
    image:
      u.avatarUrl ||
      `https://ui-avatars.com/api/?name=${encodeURIComponent(u.fullName)}&background=024594&color=fff`,
    role: (u.role?.toUpperCase() as UserRole) || "CLIENTE",
  };
};

export const loginWithBackend = async (email: string, password: string): Promise<User> => {
  const auth = await apiRequest<BackendAuthResponse>("/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
  const jwt = auth.token || auth.accessToken;
  if (!jwt) {
    throw new Error("El servidor no devolvió un token de acceso válido.");
  }
  setAccessToken(jwt);
  const mapped = mapBackendUser(auth.user);
  setActiveUser(mapped);
  return mapped;
};

export const registerWithBackend = async (body: {
  fullName: string;
  email: string;
  password: string;
  phone: string;
}): Promise<User> => {
  const auth = await apiRequest<BackendAuthResponse>("/auth/register", {
    method: "POST",
    body: JSON.stringify(body),
  });
  const jwt = auth.token || auth.accessToken;
  if (!jwt) {
    throw new Error("El servidor no devolvió un token de acceso válido.");
  }
  setAccessToken(jwt);
  const mapped = mapBackendUser(auth.user);
  setActiveUser(mapped);
  return mapped;
};

export const logoutWithBackend = async (): Promise<void> => {
  try {
    if (getAccessToken()) {
      await apiRequest<void>("/auth/logout", { method: "POST" });
    }
  } catch {
    // ignore network error on logout and clear local session
  } finally {
    clearActiveUser();
  }
};

export const changePasswordWithBackend = async (
  currentPassword: string,
  newPassword: string
): Promise<void> => {
  await apiRequest<void>("/auth/change-password", {
    method: "POST",
    body: JSON.stringify({ currentPassword, newPassword }),
  });
};

export const forgotPasswordWithBackend = async (email: string): Promise<void> => {
  await apiRequest<void>("/auth/forgot-password", {
    method: "POST",
    body: JSON.stringify({ email }),
  });
};

export const resetPasswordWithBackend = async (
  token: string,
  newPassword: string
): Promise<void> => {
  await apiRequest<void>("/auth/reset-password", {
    method: "POST",
    body: JSON.stringify({ token, newPassword }),
  });
};

export const getActiveUser = (): User => {
  const token = getAccessToken();
  if (!token || isTokenExpired(token)) {
    clearAccessToken();
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      // ignore storage errors
    }
    return EMPTY_USER;
  }

  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw) as User;
  } catch {
    // ignore storage errors
  }
  return EMPTY_USER;
};

export const setActiveUser = (user: User): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
  } catch {
    // ignore storage errors
  }
};

export const clearActiveUser = (): void => {
  clearAccessToken();
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    // ignore storage errors
  }
};
