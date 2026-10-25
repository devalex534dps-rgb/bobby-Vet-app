export interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  username: string;
  image: string;
  role: string;
  phone?: string;
  gender?: string;
  company?: {
    title?: string;
    department?: string;
    name?: string;
  };
}

export interface UsersApiResponse {
  users: User[];
  total: number;
  skip: number;
  limit: number;
}

const STORAGE_KEY = "bobby_active_user";

export const DEFAULT_USER: User = {
  id: 1,
  firstName: "Emily",
  lastName: "Johnson",
  email: "emily.johnson@x.dummyjson.com",
  username: "emilys",
  image: "https://dummyjson.com/icon/emilys/128",
  role: "admin",
};

export const fetchUsers = async (): Promise<User[]> => {
  const response = await fetch("https://dummyjson.com/users?limit=100");
  if (!response.ok) {
    throw new Error(`Error al obtener usuarios: ${response.statusText}`);
  }
  const data: UsersApiResponse = await response.json();
  return data.users;
};

export const findUserByIdentifier = (
  users: User[],
  identifier: string
): User | undefined => {
  const cleanId = identifier.trim().toLowerCase();
  return users.find(
    (u) =>
      u.username.toLowerCase() === cleanId || u.email.toLowerCase() === cleanId
  );
};

export const getActiveUser = (): User => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored) as User;
    }
  } catch (err) {
    console.error("Error reading active user from localStorage:", err);
  }
  return DEFAULT_USER;
};

export const setActiveUser = (user: User): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
  } catch (err) {
    console.error("Error writing active user to localStorage:", err);
  }
};

export const clearActiveUser = (): void => {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (err) {
    console.error("Error clearing active user from localStorage:", err);
  }
};
