import { User } from "../types";
import { API_ENDPOINTS } from "../constants/routes";

export interface LoginRequest {
  email: string;
  contraseña: string;
}

export interface RegisterRequest {
  nombre: string;
  apellido: string;
  email: string;
  password: string;
  matricula: number;
  especialidad: string;
  tipos_animales: string[][];
  costo_consulta: number;
  nombre_consultorio: string;
  num_habilitacion: string;
  direccion: string;
  telefono: string;
}

export const api = {
  async register(data: RegisterRequest): Promise<{ user: User; message: string }> {
    const response = await fetch(
      `${API_ENDPOINTS.BASE}${API_ENDPOINTS.AUTH.REGISTER}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      },
    );

    const result = await response.json();
    if (!response.ok) {
      throw new Error(result.error || "Registration failed");
    }
    return result;
  },

  async login(
    data: LoginRequest,
  ): Promise<{ user: User; token: string; message: string }> {
    const response = await fetch(
      `${API_ENDPOINTS.BASE}${API_ENDPOINTS.AUTH.LOGIN}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      },
    );

    const result = await response.json();
    if (!response.ok) {
      throw new Error(result.error || "Login failed");
    }
    return result;
  },

  async checkHealth(): Promise<boolean> {
    try {
      const response = await fetch(
        `${API_ENDPOINTS.BASE}${API_ENDPOINTS.HEALTH}`,
      );
      return response.ok;
    } catch {
      return false;
    }
  },
};
