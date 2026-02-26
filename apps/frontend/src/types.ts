export interface User {
  id: string;
  email: string;
  username: string;
  name: string;
  lastName?: string;
  avatar?: string;
  registration?: string;
  specialties?: string;
  animalTypes?: string[];
  consultancy?: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}

export enum AuthView {
  LOGIN = "LOGIN",
  REGISTER = "REGISTER",
  DASHBOARD = "DASHBOARD",
}
