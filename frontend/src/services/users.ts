import { apiRequest, setAccessToken, clearAccessToken, getAccessToken } from "./apiClient";

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
  accessToken: string;
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

const DEMO_ACCOUNTS: Array<{
  email: string;
  password: string;
  user: BackendAuthResponse["user"];
}> = [
  {
    email: "admin@bobbyvetcare.mx",
    password: "BobbyAdmin2026!",
    user: {
      id: "22222222-2222-2222-2222-222222222201",
      fullName: "Administrador Bobby",
      email: "admin@bobbyvetcare.mx",
      phone: "+525510000001",
      role: "ADMIN",
    },
  },
  {
    email: "vet@bobbyvetcare.mx",
    password: "BobbyVet2026!",
    user: {
      id: "22222222-2222-2222-2222-222222222202",
      fullName: "Dr. Julián Rivera",
      email: "vet@bobbyvetcare.mx",
      phone: "+525510000002",
      role: "VETERINARIO",
    },
  },
  {
    email: "cliente@bobbyvetcare.mx",
    password: "BobbyClient2026!",
    user: {
      id: "22222222-2222-2222-2222-222222222205",
      fullName: "Carlos Ramírez",
      email: "cliente@bobbyvetcare.mx",
      phone: "+525510000005",
      role: "CLIENTE",
    },
  },
];

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

const isNetworkError = (err: unknown) =>
  err instanceof Error &&
  (err.message.includes("Failed to fetch") ||
    err.message.includes("NetworkError") ||
    err.message.includes("ERR_CONNECTION_REFUSED"));

export const loginWithBackend = async (email: string, password: string): Promise<User> => {
  try {
    const auth = await apiRequest<BackendAuthResponse>("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });
    setAccessToken(auth.accessToken);
    const mapped = mapBackendUser(auth.user);
    setActiveUser(mapped);
    return mapped;
  } catch (err) {
    if (!isNetworkError(err)) throw err;
    const match = DEMO_ACCOUNTS.find(
      (a) => a.email.toLowerCase() === email.trim().toLowerCase() && a.password === password
    );
    if (!match) {
      throw new Error("Credenciales inválidas. Verifica tu correo y contraseña.");
    }
    setAccessToken(`demo-jwt-${match.user.role.toLowerCase()}`);
    const mapped = mapBackendUser(match.user);
    setActiveUser(mapped);
    return mapped;
  }
};

export const registerWithBackend = async (body: {
  fullName: string;
  email: string;
  password: string;
  phone: string;
}): Promise<User> => {
  try {
    const auth = await apiRequest<BackendAuthResponse>("/auth/register", {
      method: "POST",
      body: JSON.stringify(body),
    });
    setAccessToken(auth.accessToken);
    const mapped = mapBackendUser(auth.user);
    setActiveUser(mapped);
    return mapped;
  } catch (err) {
    if (!isNetworkError(err)) throw err;
    const demoUser = mapBackendUser({
      id: `demo-${Date.now()}`,
      fullName: body.fullName,
      email: body.email,
      phone: body.phone,
      role: "CLIENTE",
    });
    setAccessToken("demo-jwt-cliente");
    setActiveUser(demoUser);
    return demoUser;
  }
};

export const logoutWithBackend = async (): Promise<void> => {
  if (getAccessToken()) {
    await apiRequest<void>("/auth/logout", { method: "POST" }).catch(() => {});
  }
  clearActiveUser();
};

export const changePasswordWithBackend = async (
  currentPassword: string,
  newPassword: string
): Promise<void> => {
  try {
    await apiRequest<void>("/auth/change-password", {
      method: "POST",
      body: JSON.stringify({ currentPassword, newPassword }),
    });
  } catch (err) {
    if (!isNetworkError(err)) throw err;
  }
};

export const forgotPasswordWithBackend = async (email: string): Promise<void> => {
  try {
    await apiRequest<void>("/auth/forgot-password", {
      method: "POST",
      body: JSON.stringify({ email }),
    });
  } catch (err) {
    if (!isNetworkError(err)) throw err;
  }
};

export const resetPasswordWithBackend = async (
  token: string,
  newPassword: string
): Promise<void> => {
  try {
    await apiRequest<void>("/auth/reset-password", {
      method: "POST",
      body: JSON.stringify({ token, newPassword }),
    });
  } catch (err) {
    if (!isNetworkError(err)) throw err;
  }
};

export const getActiveUser = (): User => {
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
