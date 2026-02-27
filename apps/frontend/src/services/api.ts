import { User, Veterinarian, Clinic } from "../types";
import { API_ENDPOINTS } from "../constants/routes";

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  nombre: string;
  apellido: string;
  email: string;
  password: string;
  matricula: number;
  especialidad: string;
  tipos_animales: string[];
  costo_consulta: number;
  nombre_consultorio: string;
  num_habilitacion: string;
  direccion: string;
  telefono: string;
}

export interface ChangePasswordRequest {
  contraseña_actual: string;
  contraseña_nueva: string;
}

export interface CreatePatientRequest {
  nombre: string;
  especie: string;
  edad: number;
  color: string;
  senia: string;
  sexo: "Macho" | "Hembra";
  raza: string;
  peso: number;
  esterilizado: boolean;
  tiene_microchip: boolean;
  num_microchip: string;
  activo: boolean;
  id_responsable: number;
  id_clinica: number;
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

  async createPatient(data: CreatePatientRequest): Promise<unknown> {
    const response = await fetch(
      `${API_ENDPOINTS.BASE}${API_ENDPOINTS.PACIENTES}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      },
    );
    const result = await response.json();
    if (!response.ok) {
      throw new Error(result.error || "Error al crear el paciente");
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

  async getVeterinarian(id: number, token: string): Promise<Veterinarian> {
    const response = await fetch(
      `${API_ENDPOINTS.BASE}/veterinario/${id}`,
      {
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      },
    );
    const result = await response.json();
    if (!response.ok) {
      throw new Error(result.error || "Error al obtener datos del veterinario");
    }
    return result;
  },

  async getClinic(token: string): Promise<Clinic> {
    const response = await fetch(
      `${API_ENDPOINTS.BASE}/clinica`,
      {
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      },
    );
    const result = await response.json();
    if (!response.ok) {
      throw new Error(result.error || "Error al obtener datos de la clínica");
    }
    return result.data;
  },

  async changePassword(data: ChangePasswordRequest, token: string): Promise<{ message: string }> {
    const response = await fetch(
      `${API_ENDPOINTS.BASE}/auth/cambiar-contraseña`,
      {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      },
    );
    const result = await response.json();
    if (!response.ok) {
      throw new Error(result.error || "Error al cambiar la contraseña");
    }
    return result;
  },

  async updateVeterinarian(id: number, data: Partial<Veterinarian>, token: string): Promise<Veterinarian> {
    const response = await fetch(
      `${API_ENDPOINTS.BASE}/veterinario/${id}`,
      {
        method: "PUT",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      },
    );
    const result = await response.json();
    if (!response.ok) {
      throw new Error(result.error || "Error al actualizar datos del veterinario");
    }
    return result;
  },

  async updateClinic(data: Partial<Clinic>, token: string): Promise<Clinic> {
    const response = await fetch(
      `${API_ENDPOINTS.BASE}/clinica`,
      {
        method: "PUT",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      },
    );
    const result = await response.json();
    if (!response.ok) {
      throw new Error(result.error || "Error al actualizar datos de la clínica");
    }
    return result.data;
  },
};
