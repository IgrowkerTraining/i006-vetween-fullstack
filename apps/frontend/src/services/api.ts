import { User, Veterinarian, Clinic } from "../types";
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

export interface ChangePasswordRequest {
  contraseña_actual: string;
  contraseña_nueva: string;
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

export interface PatientDetailResponse {
  id_pacientes?: number | string;
  id_paciente?: number | string;
  id?: number | string;
  nombre?: string;
  nombre_paciente?: string;
  especie?: string;
  raza?: string;
  edad?: number | string;
  peso?: number | string;
  sexo?: string;
  color?: string;
  senia?: string;
  esterilizado?: boolean;
  tiene_microchip?: boolean;
  num_microchip?: string;
  activo?: boolean | string;
  estado?: boolean | string;
  // responsable fields (may come flattened or nested)
  id_responsables?: number | string;
  nombre_responsable?: string;
  apellido?: string;
  email?: string;
  telefono?: string;
  direccion_calle?: string;
  direccion_numero?: string;
  direccion_localidad?: string;
  provincia?: string;
  relacion?: string;
  // nested object as returned by the API
  responsables?: {
    id_responsables?: number | string;
    nombre?: string;
    apellido?: string;
    email?: string;
    telefono?: string;
    direccion_calle?: string;
    direccion_numero?: string;
    direccion_localidad?: string;
    provincia?: string;
    relacion?: string;
  };
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

  async getPatientById(id: string): Promise<PatientDetailResponse> {
    const response = await fetch(
      `https://backend-bsmd.onrender.com/api/pacientes-responsables/pacientes/${id}`,
      {
        method: "GET",
        headers: getRequestHeaders(true),
      },
    );

    const result = await response.json();
    console.log("[getPatientById] raw response:", result);

    if (!response.ok) {
      throw new Error(result?.error || result?.message || "Error al obtener el paciente");
    }

    // Desempaquetar si la respuesta viene envuelta
    if (result?.data && typeof result.data === "object" && !Array.isArray(result.data)) {
      return result.data as PatientDetailResponse;
    }
    if (result?.paciente && typeof result.paciente === "object") {
      return result.paciente as PatientDetailResponse;
    }

    return result as PatientDetailResponse;
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

  async changePassword(data: ChangePasswordRequest, token: string, idVeterinario?: number): Promise<{ message: string }> {
    // Try the main endpoint first, if it returns 404/405 try fallback endpoints (prepared for future backend)
    const tryRequest = async (url: string, method = "POST") => {
      const res = await fetch(url, {
        method,
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      const result = await res.json().catch(() => ({}));
      return { res, result };
    };

    // Primary endpoint
    let attempt = await tryRequest(`${API_ENDPOINTS.BASE}/auth/cambiar-contraseña`, "POST");
    if (attempt.res.ok) return attempt.result;

    // Fallbacks: if server doesn't expose the primary route yet, try veterinarian-scoped endpoint (if id provided)
    if (attempt.res.status === 404 || attempt.res.status === 405) {
      if (idVeterinario) {
        attempt = await tryRequest(`${API_ENDPOINTS.BASE}/veterinario/${idVeterinario}/cambiar-contraseña`, "POST");
        if (attempt.res.ok) return attempt.result;
      }

      // Last resort: try PUT on auth endpoint (some backends expect PUT)
      attempt = await tryRequest(`${API_ENDPOINTS.BASE}/auth/cambiar-contraseña`, "PUT");
      if (attempt.res.ok) return attempt.result;
    }

    throw new Error(attempt.result?.error || attempt.result?.message || "Error al cambiar la contraseña");
  },

  async updateVeterinarian(id: number, data: Partial<Veterinarian>, token: string): Promise<Veterinarian> {
    // Prefer PATCH for partial updates; fallback to PUT if server doesn't support PATCH yet.
    const tryRequest = async (method: string) => {
      const res = await fetch(`${API_ENDPOINTS.BASE}/veterinario/${id}`, {
        method,
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      const result = await res.json().catch(() => ({}));
      return { res, result };
    };

    let attempt = await tryRequest("PATCH");
    if (attempt.res.ok) return attempt.result;

    if (attempt.res.status === 404 || attempt.res.status === 405) {
      attempt = await tryRequest("PUT");
      if (attempt.res.ok) return attempt.result;
    }

    throw new Error(attempt.result?.error || attempt.result?.message || "Error al actualizar datos del veterinario");
  },

  async updateClinic(data: Partial<Clinic>, token: string): Promise<Clinic> {
    // Prefer PATCH for partial updates; fallback to PUT if server doesn't support PATCH yet.
    const tryRequest = async (method: string) => {
      const res = await fetch(`${API_ENDPOINTS.BASE}/clinica`, {
        method,
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      const result = await res.json().catch(() => ({}));
      return { res, result };
    };

    let attempt = await tryRequest("PATCH");
    if (attempt.res.ok) return attempt.result.data || attempt.result;

    if (attempt.res.status === 404 || attempt.res.status === 405) {
      attempt = await tryRequest("PUT");
      if (attempt.res.ok) return attempt.result.data || attempt.result;
    }

    throw new Error(attempt.result?.error || attempt.result?.message || "Error al actualizar datos de la clínica");
  },
};
