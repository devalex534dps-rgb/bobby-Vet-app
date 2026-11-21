import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  EMPTY_USER,
  changePasswordWithBackend,
  clearActiveUser,
  getActiveUser,
  loginWithBackend,
  logoutWithBackend,
  registerWithBackend,
  type User,
} from "@/services/users";
import {
  UNAUTHORIZED_EVENT,
  getAccessToken,
  isTokenExpired,
} from "@/services/apiClient";

export interface AuthResult {
  success: boolean;
  user?: User;
  error?: string;
}

export interface AuthContextValue {
  currentUser: User;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<AuthResult>;
  register: (body: {
    fullName: string;
    email: string;
    password: string;
    phone: string;
  }) => Promise<AuthResult>;
  changePassword: (
    currentPassword: string,
    newPassword: string
  ) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [currentUser, setCurrentUser] = useState<User>(() => getActiveUser());

  const isAuthenticated = useMemo(() => {
    const token = getAccessToken();
    return Boolean(token && !isTokenExpired(token) && currentUser.id);
  }, [currentUser]);

  const handleSessionInvalidated = useCallback(() => {
    clearActiveUser();
    setCurrentUser(EMPTY_USER);
  }, []);

  useEffect(() => {
    const onUnauthorized = () => {
      handleSessionInvalidated();
      const path = window.location.pathname;
      if (path !== "/login" && path !== "/portal" && path !== "/") {
        window.location.replace("/login");
      }
    };

    const checkTokenExpiration = () => {
      const token = getAccessToken();
      if (token && isTokenExpired(token)) {
        onUnauthorized();
      }
    };

    window.addEventListener(UNAUTHORIZED_EVENT, onUnauthorized);
    window.addEventListener("focus", checkTokenExpiration);
    const intervalId = window.setInterval(checkTokenExpiration, 30_000);

    return () => {
      window.removeEventListener(UNAUTHORIZED_EVENT, onUnauthorized);
      window.removeEventListener("focus", checkTokenExpiration);
      window.clearInterval(intervalId);
    };
  }, [handleSessionInvalidated]);

  const login = useCallback(async (email: string, password: string): Promise<AuthResult> => {
    try {
      const user = await loginWithBackend(email, password);
      setCurrentUser(user);
      return { success: true, user };
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Error de conexión con el servidor.";
      return {
        success: false,
        error: message,
      };
    }
  }, []);

  const register = useCallback(
    async (body: {
      fullName: string;
      email: string;
      password: string;
      phone: string;
    }): Promise<AuthResult> => {
      try {
        const user = await registerWithBackend(body);
        setCurrentUser(user);
        return { success: true, user };
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "Error al registrar usuario.";
        return { success: false, error: message };
      }
    },
    []
  );

  const changePassword = useCallback(
    async (currentPassword: string, newPassword: string) => {
      try {
        await changePasswordWithBackend(currentPassword, newPassword);
        return { success: true };
      } catch (err) {
        return {
          success: false,
          error:
            err instanceof Error
              ? err.message
              : "No se pudo actualizar la contraseña.",
        };
      }
    },
    []
  );

  const logout = useCallback(async () => {
    await logoutWithBackend();
    setCurrentUser(EMPTY_USER);
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      currentUser,
      isAuthenticated,
      login,
      register,
      changePassword,
      logout,
    }),
    [currentUser, isAuthenticated, login, register, changePassword, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextValue => {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth debe utilizarse dentro de un AuthProvider");
  }
  return ctx;
};
