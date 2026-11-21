import { useAuth } from "@/contexts/AuthContext";

export const useUsers = () => {
  return useAuth();
};

export default useUsers;
