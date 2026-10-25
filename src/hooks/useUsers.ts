import { useState, useCallback } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  fetchUsers,
  getActiveUser,
  setActiveUser,
  clearActiveUser,
  findUserByIdentifier,
  type User,
} from "@/services/users";

export const useUsers = () => {
  const [currentUser, setCurrentUserState] = useState<User>(() => getActiveUser());

  const usersQuery = useQuery({
    queryKey: ["users"],
    queryFn: fetchUsers,
    staleTime: 1000 * 60 * 15, // 15 mins
  });

  const login = useCallback(
    async (identifier: string): Promise<{ success: boolean; user?: User; error?: string }> => {
      // Ensure users are loaded
      let usersList = usersQuery.data;
      if (!usersList || usersList.length === 0) {
        try {
          usersList = await fetchUsers();
        } catch {
          return {
            success: false,
            error: "Error de conexión al verificar credenciales.",
          };
        }
      }

      const matchedUser = findUserByIdentifier(usersList, identifier);

      if (matchedUser) {
        setActiveUser(matchedUser);
        setCurrentUserState(matchedUser);
        return { success: true, user: matchedUser };
      }

      return {
        success: false,
        error: "Usuario o correo electrónico no encontrado.",
      };
    },
    [usersQuery.data]
  );

  const logout = useCallback(() => {
    clearActiveUser();
    setCurrentUserState(getActiveUser());
  }, []);

  return {
    users: usersQuery.data ?? [],
    isLoading: usersQuery.isLoading,
    isError: usersQuery.isError,
    error: usersQuery.error,
    currentUser,
    login,
    logout,
    refetchUsers: usersQuery.refetch,
  };
};

export default useUsers;
