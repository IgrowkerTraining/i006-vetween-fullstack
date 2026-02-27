import { User } from "../types";
import { API_ENDPOINTS } from "../constants/routes";
import { storage } from "../utils/storage";

const getRequestHeaders = (requiresAuth = false): HeadersInit => {
  const headers: HeadersInit = {
    "Content-Type": "application/json",
  };

  if (!requiresAuth) return headers;

  const token = storage.getToken();
  return token ? { ...headers, Authorization: `Bearer ${token}` } : headers;
};

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
  especialidad: string[];
  tipos_animales: string[];
  costo_consulta: number;
  nombre_consultorio: string;
  num_habilitacion: string;
  direccion_calle: string;
  direccion_numero: string;
  direccion_localidad: string;
  provincia: string;
  telefono: string;
}

export interface CreatePatientRequest {
  nombre_paciente: string;
  especie: string;
  edad: number;
  color: string;
  senia: string;
  sexo: "Macho" | "Hembra";
  raza: string;
  peso: number;
  esterilizado: boolean;
  tiene_microchip: boolean;
  num_microchip?: string;
  activo: boolean;
  nombre_responsable: string;
  apellido: string;
  email: string;
  telefono: string;
  direccion_calle: string;
  direccion_numero: string;
  direccion_localidad: string;
  provincia: string;
  relacion: string;
}

export interface PatientsListItem {
  id?: number | string;
  id_pacientes?: number | string;
  id_paciente?: number | string;
  id_responsable?: number | string;
  nombre?: string;
  nombre_paciente?: string;
  especie?: string;
  responsable?: string;
  nombre_responsable?: string;
  apellido?: string;
  activo?: boolean | string;
  estado?: boolean | string;
}

export interface ResponsibleListItem {
  id_responsables: number;
  nombre: string;
  apellido: string;
  email: string;
  telefono: string;
  relacion: string;
  direccion_calle: string;
  direccion_numero: string;
  direccion_localidad: string;
  provincia: string;
}

export const api = {
  async register(data: RegisterRequest): Promise<{ user: User; message: string; token?: string }> {
    const response = await fetch("https://backend-bsmd.onrender.com/api/auth/register", {
      method: "POST",
      headers: getRequestHeaders(),
      body: JSON.stringify(data),
    });

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
        headers: getRequestHeaders(),
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
    const response = await fetch("https://backend-bsmd.onrender.com/api/pacientes-responsables", {
      method: "POST",
      headers: getRequestHeaders(true),
      body: JSON.stringify(data),
    });
    const result = await response.json();
    if (!response.ok) {
      const backendMessage =
        result?.error ||
        result?.message ||
        (Array.isArray(result?.details) ? result.details.join(", ") : undefined) ||
        "Error al crear el paciente";

      if (
        typeof backendMessage === "string" &&
        (backendMessage.includes("pacientes_num_microchip_key") ||
          backendMessage.toLowerCase().includes("duplicate key value"))
      ) {
        throw new Error(
          "El número de microchip ya está registrado. Ingresá uno diferente.",
        );
      }

      throw new Error(
        backendMessage,
      );
    }
    return result;
  },

  async getPatients(): Promise<PatientsListItem[] | { data?: PatientsListItem[]; pacientes?: PatientsListItem[] }> {
    const response = await fetch(
      "https://backend-bsmd.onrender.com/api/pacientes-responsables/pacientes",
      {
        method: "GET",
        headers: getRequestHeaders(true),
      },
    );

    const result = await response.json();
    if (!response.ok) {
      throw new Error(result?.error || result?.message || "Error al obtener pacientes");
    }

    return result;
  },

  async getResponsables(): Promise<
    ResponsibleListItem[] | { data?: ResponsibleListItem[]; responsables?: ResponsibleListItem[] }
  > {
    const response = await fetch(
      "https://backend-bsmd.onrender.com/api/pacientes-responsables/responsables",
      {
        method: "GET",
        headers: getRequestHeaders(true),
      },
    );

    const result = await response.json();
    if (!response.ok) {
      throw new Error(result?.error || result?.message || "Error al obtener responsables");
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
