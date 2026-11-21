import { useState, useCallback } from "react";
import {
  getActiveUser,
  loginWithBackend,
  registerWithBackend,
  logoutWithBackend,
  changePasswordWithBackend,
  type User,
} from "@/services/users";
import { getAccessToken } from "@/services/apiClient";

export const useUsers = () => {
  const [currentUser, setCurrentUserState] = useState<User>(() => getActiveUser());

  const isAuthenticated = Boolean(getAccessToken() && currentUser.id);

  const login = useCallback(async (email: string, password: string) => {
    try {
      const user = await loginWithBackend(email, password);
      setCurrentUserState(user);
      return { success: true, user };
    } catch (err) {
      const message = err instanceof Error ? err.message : "Error de conexión con el servidor.";
      return {
        success: false,
        error: message.includes("Failed to fetch")
          ? "No se pudo conectar con el servidor backend (:8080)."
          : message,
      };
    }
  }, []);

  const register = useCallback(
    async (body: { fullName: string; email: string; password: string; phone: string }) => {
      try {
        const user = await registerWithBackend(body);
        setCurrentUserState(user);
        return { success: true, user };
      } catch (err) {
        const message = err instanceof Error ? err.message : "Error al registrar usuario.";
        return { success: false, error: message };
      }
    },
    []
  );

  const changePassword = useCallback(async (currentPassword: string, newPassword: string) => {
    try {
      await changePasswordWithBackend(currentPassword, newPassword);
      return { success: true };
    } catch (err) {
      return {
        success: false,
        error: err instanceof Error ? err.message : "No se pudo actualizar la contraseña.",
      };
    }
  }, []);

  const logout = useCallback(async () => {
    await logoutWithBackend();
    setCurrentUserState(getActiveUser());
  }, []);

  return {
    currentUser,
    isAuthenticated,
    login,
    register,
    changePassword,
    logout,
  };
};

export default useUsers;
