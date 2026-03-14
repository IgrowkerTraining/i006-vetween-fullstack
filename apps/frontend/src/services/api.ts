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
  nombre: string;
  especie: string;
  edad: number;
  color: string;
  senia?: string;
  sexo: "Macho" | "Hembra";
  raza: string;
  peso: number;
  esterilizado: boolean;
  tiene_microchip: boolean;
  num_microchip?: string;
  activo: boolean;
  id_responsable: number;
  id_clinica?: never;
}

export interface UpdatePatientRequest {
  nombre?: string;
  especie?: string;
  edad?: number;
  color?: string;
  senia?: string;
  sexo?: "Macho" | "Hembra";
  raza?: string;
  peso?: number;
  esterilizado?: boolean;
  tiene_microchip?: boolean;
  num_microchip?: string;
  activo?: boolean;
}

export interface CreateResponsableRequest {
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

export interface UpdateResponsableRequest {
  nombre?: string;
  apellido?: string;
  email?: string;
  telefono?: string;
  relacion?: string;
  direccion?: string;
  direccion_calle?: string;
  direccion_numero?: string;
  direccion_localidad?: string;
  provincia?: string;
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
  // responsable id returned by new API
  id_responsable?: number | string;
  // responsable fields (may come flattened or nested)
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
    id_responsable?: number | string;
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

export interface ResponsableDetailResponse {
  id_responsable?: number | string;
  nombre?: string;
  apellido?: string;
  email?: string;
  telefono?: string;
  direccion_calle?: string;
  direccion_numero?: string;
  direccion_localidad?: string;
  provincia?: string;
  relacion?: string;
}

export interface ResponsibleListItem {
  id_responsable?: number;
  id_responsables?: number;
  nombre: string;
  apellido: string;
  email: string;
  telefono: string;
  relacion: string;
  direccion_calle: string;
  direccion_numero: string;
  direccion_localidad: string;
  provincia: string;
  mascota?: string;
  nombre_paciente?: string;
  nombre_mascota?: string;
}


export const api = {

 apiUrl: import.meta.env.VITE_API_PROD_URL,
 
  async register(
    data: RegisterRequest,
  ): Promise<{ user: User; message: string; token?: string }> {
    const response = await fetch(
      `${api.apiUrl}/auth/register`,
      {
        method: "POST",
        headers: getRequestHeaders(),
        body: JSON.stringify(data),
      },
    );

    const result = await response.json();
    if (!response.ok) {
      const message =
        result.errors?.join(", ") ||
        result.message ||
        result.error ||
        "Registration failed";
      throw new Error(message);
    }
    return result;
  },

  async login(
    data: LoginRequest,
  ): Promise<{ user: User; token: string; message: string }> {
    const headers = getRequestHeaders();
    console.log("[login] Request headers:", headers);
    console.log("[login] Request body:", JSON.stringify(data));

    const response = await fetch(
      `${api.apiUrl}/auth/login`,
      {
        method: "POST",
        headers,
        body: JSON.stringify(data),
      },
    );

    const result = await response.json();
    console.log("[login] Response status:", response.status);
    console.log("[login] Response body:", result);
    if (!response.ok) {
      throw new Error(result.error || result.message || "Login failed");
    }
    // The API wraps the payload inside `data`
    const payload = result.data ?? result;
    return {
      token: payload.token ?? result.token,
      user: payload.user ?? result.user,
      message: result.message,
    };
  },

  async getPatients(page = 1): Promise<unknown> {
    const url = `${api.apiUrl}/pacientes?page=${page}`;
    console.log("[getPatients] fetching:", url);
    const response = await fetch(url, {
      method: "GET",
      headers: getRequestHeaders(true),
    });

    const result = await response.json();
    console.log("[getPatients] page", page, "raw response:", result);
    if (!response.ok) {
      throw new Error(
        result?.error || result?.message || "Error al obtener pacientes",
      );
    }

    return result;
  },

  async createPatient(data: CreatePatientRequest): Promise<unknown> {
    const response = await fetch(
      `${api.apiUrl}/pacientes`,
      {
        method: "POST",
        headers: getRequestHeaders(true),
        body: JSON.stringify(data),
      },
    );
    const result = await response.json();
    if (!response.ok) {
      const msg =
        result?.error ||
        result?.message ||
        (Array.isArray(result?.details)
          ? result.details.join(", ")
          : undefined) ||
        "Error al crear el paciente";
      if (
        typeof msg === "string" &&
        (msg.includes("pacientes_num_microchip_key") ||
          msg.toLowerCase().includes("duplicate key value"))
      ) {
        throw new Error(
          "El número de microchip ya está registrado. Ingresá uno diferente.",
        );
      }
      throw new Error(msg);
    }
    return result;
  },

  async updatePatient(
    id: string | number,
    data: UpdatePatientRequest,
  ): Promise<unknown> {
    const response = await fetch(
      `${api.apiUrl}/pacientes/${id}`,
      {
        method: "PATCH",
        headers: getRequestHeaders(true),
        body: JSON.stringify(data),
      },
    );
    const result = await response.json();
    if (!response.ok) {
      throw new Error(
        result?.error || result?.message || "Error al actualizar el paciente",
      );
    }
    return result;
  },

  async deletePatient(id: string | number): Promise<void> {
    const response = await fetch(
      `${api.apiUrl}/pacientes/${id}`,
      {
        method: "DELETE",
        headers: getRequestHeaders(true),
      },
    );
    const result = await response.json();
    if (!response.ok) {
      throw new Error(
        result?.error || result?.message || "Error al eliminar el paciente",
      );
    }
  },

  async createResponsable(data: CreateResponsableRequest): Promise<unknown> {
    const response = await fetch(
      `${api.apiUrl}/responsables`,
      {
        method: "POST",
        headers: getRequestHeaders(true),
        body: JSON.stringify(data),
      },
    );
    const result = await response.json();
    if (!response.ok) {
      throw new Error(
        result?.error || result?.message || "Error al crear el responsable",
      );
    }
    return result;
  },

  async updateResponsable(
    id: string | number,
    data: UpdateResponsableRequest,
  ): Promise<unknown> {
    const response = await fetch(
      `${api.apiUrl}/responsables/${id}`,
      {
        method: "PATCH",
        headers: getRequestHeaders(true),
        body: JSON.stringify(data),
      },
    );
    const result = await response.json();
    if (!response.ok) {
      throw new Error(
        result?.error ||
          result?.message ||
          "Error al actualizar el responsable",
      );
    }
    return result;
  },

  async deleteResponsable(id: string | number): Promise<void> {
    const response = await fetch(
      `${api.apiUrl}/responsables/${id}`,
      {
        method: "DELETE",
        headers: getRequestHeaders(true),
      },
    );
    if (!response.ok) {
      const result = await response.json().catch(() => ({}));
      throw new Error(
        result?.error || result?.message || "Error al eliminar el responsable",
      );
    }
  },

  async getResponsables(page = 1): Promise<unknown> {
    const response = await fetch(
      `${api.apiUrl}/responsables?page=${page}`,
      {
        method: "GET",
        headers: getRequestHeaders(true),
      },
    );

    const result = await response.json();
    if (!response.ok) {
      throw new Error(
        result?.error || result?.message || "Error al obtener responsables",
      );
    }

    return result;
  },

  async getPatientById(id: string): Promise<PatientDetailResponse> {
    const response = await fetch(
      `${api.apiUrl}/pacientes/${id}`,
      {
        method: "GET",
        headers: getRequestHeaders(true),
      },
    );

    const result = await response.json();
    console.log("[getPatientById] raw response:", result);

    if (!response.ok) {
      throw new Error(
        result?.error || result?.message || "Error al obtener el paciente",
      );
    }

    // Desempaquetar si la respuesta viene envuelta
    if (
      result?.data &&
      typeof result.data === "object" &&
      !Array.isArray(result.data)
    ) {
      return result.data as PatientDetailResponse;
    }
    if (result?.paciente && typeof result.paciente === "object") {
      return result.paciente as PatientDetailResponse;
    }

    return result as PatientDetailResponse;
  },

  async getResponsableById(
    id: string | number,
  ): Promise<ResponsableDetailResponse> {
    const response = await fetch(
      `${api.apiUrl}/responsables/${id}`,
      {
        method: "GET",
        headers: getRequestHeaders(true),
      },
    );
    const result = await response.json();
    if (!response.ok) {
      throw new Error(
        result?.error || result?.message || "Error al obtener el responsable",
      );
    }
    if (result?.data && typeof result.data === "object")
      return result.data as ResponsableDetailResponse;
    return result as ResponsableDetailResponse;
  },

  async getVisitasByPatientId(
    id: string,
    page: number = 1,
  ): Promise<{
    data: {
      id_visitas: number;
      fecha: string;
      motivo_consulta: string;
      diagnostico: string;
      tratamiento: string;
      observaciones: string;
      estado: boolean;
      historial_previo: boolean;
      id_paciente: number;
    }[];
    total: number;
    pagina: number;
    ultimaPagina: number;
  }> {
    const response = await fetch(
      `${api.apiUrl}/pacientes/${id}/visitas?page=${page}`,
      {
        method: "GET",
        headers: getRequestHeaders(true),
      },
    );
    const result = await response.json();
    if (!response.ok) {
      throw new Error(
        result?.error ||
          result?.message ||
          "Error al obtener el historial de visitas",
      );
    }
    if (result?.data?.data) {
      return {
        data: result.data.data,
        total: result.data.total ?? 0,
        pagina: result.data.pagina ?? 1,
        ultimaPagina: result.data.ultimaPagina ?? 1,
      };
    }
    const flat = Array.isArray(result)
      ? result
      : Array.isArray(result?.data)
        ? result.data
        : [];
    return { data: flat, total: flat.length, pagina: 1, ultimaPagina: 1 };
  },

  async getVacunasByPatientId(
    id: string,
    page: number = 1,
  ): Promise<{
    data: {
      id_vacunas: number;
      tipo: string;
      nombre_cientifico: string;
      fecha_aplicacion: string;
      observacion: string;
      estado: boolean;
      id_paciente: number;
    }[];
    total: number | null;
    pagina: number;
    ultimaPagina: number;
  }> {
    const response = await fetch(
      `${api.apiUrl}/pacientes/${id}/vacunas?page=${page}`,
      {
        method: "GET",
        headers: getRequestHeaders(true),
      },
    );
    const result = await response.json();
    if (!response.ok) {
      throw new Error(
        result?.error ||
          result?.message ||
          "Error al obtener el historial de vacunas",
      );
    }
    if (result?.data?.data) {
      return {
        data: result.data.data,
        total: result.data.total ?? null,
        pagina: result.data.pagina ?? 1,
        ultimaPagina: result.data.ultimaPagina || 1,
      };
    }
    const flat = Array.isArray(result)
      ? result
      : Array.isArray(result?.data)
        ? result.data
        : [];
    return { data: flat, total: flat.length, pagina: 1, ultimaPagina: 1 };
  },

  async createVaccine(data: {
    tipo: string;
    nombre_cientifico: string;
    fecha_aplicacion: string;
    observacion: string;
    estado: boolean;
    id_paciente: number | string;
  }): Promise<unknown> {
    const response = await fetch(
      `${api.apiUrl}/vacunas`,
      {
        method: "POST",
        headers: getRequestHeaders(true),
        body: JSON.stringify(data),
      },
    );
    const result = await response.json();
    if (!response.ok) {
      throw new Error(
        result?.error || result?.message || "Error al registrar la vacuna",
      );
    }
    return result;
  },

  async createVisit(data: {
    fecha: string;
    motivo_consulta: string;
    diagnostico: string;
    tratamiento: string;
    observaciones: string;
    estado: boolean;
    historial_previo?: boolean;
    id_paciente: number | string;
  }): Promise<unknown> {
    const response = await fetch(
      `${api.apiUrl}/visitas`,
      {
        method: "POST",
        headers: getRequestHeaders(true),
        body: JSON.stringify(data),
      },
    );
    const result = await response.json();
    if (!response.ok) {
      const validationErrors = Array.isArray(result?.errors)
        ? result.errors.join(" | ")
        : undefined;
      throw new Error(
        validationErrors ||
          result?.error ||
          result?.message ||
          "Error al registrar la visita",
      );
    }
    return result;
  },

  async inactivarVisita(idVisita: string | number): Promise<unknown> {
    const response = await fetch(
      `${api.apiUrl}/visitas/${idVisita}/inactivar`,
      {
        method: "PATCH",
        headers: getRequestHeaders(true),
      },
    );
    const result = await response.json();
    if (!response.ok) {
      throw new Error(
        result?.error || result?.message || "Error al inactivar la visita",
      );
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
      `${api.apiUrl}/veterinario`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
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
      `${api.apiUrl}/clinica`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
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

  async changePassword(
    data: ChangePasswordRequest,
    token: string,
  ): Promise<{ message: string }> {
    const response = await fetch(
      `${API_ENDPOINTS.BASE}/auth/cambiar-contraseña`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
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

  async updateVeterinarian(
    id: number,
    data: {
      nombre?: string;
      apellido?: string;
      especialidad?: string[];
      tipos_animales?: string[];
      costo_consulta?: number;
    },
    token: string,
  ): Promise<Veterinarian> {
    const response = await fetch(
      `${api.apiUrl}/veterinario`,
      {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      },
    );
    const result = await response.json();
    if (!response.ok) {
      throw new Error(
        result.error || "Error al actualizar datos del veterinario",
      );
    }
    return result.data ?? result;
  },

  async updateClinic(
    data: {
      nombre?: string;
      direccion_calle?: string;
      direccion_numero?: string;
      direccion_localidad?: string;
      provincia?: string;
      telefono?: string;
    },
    token: string,
  ): Promise<Clinic> {
    const response = await fetch(
      `${api.apiUrl}/clinica`,
      {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      },
    );
    const result = await response.json();
    if (!response.ok) {
      throw new Error(
        result.error || "Error al actualizar datos de la clínica",
      );
    }
    return result.data;
  },

  async generateClinicalSummary(payload: {
    id_paciente: number | string;
  }): Promise<{ resumen?: string; summary?: string; data?: unknown }> {
    const response = await fetch(
      `${api.apiUrl}/ia/generar-resumen`,
      {
        method: "POST",
        headers: getRequestHeaders(true),
        body: JSON.stringify(payload),
      },
    );
    const result = await response.json();
    if (!response.ok) {
      throw new Error(
        result.error || result.message || "Error al generar resumen clínico",
      );
    }
    return result;
  },

  async getClinicalSummaryByPatientId(id: string | number): Promise<any[]> {
    const response = await fetch(
      `${api.apiUrl}/ia/pacientes/${id}/ia`,
      {
        method: "GET",
        headers: getRequestHeaders(true),
      },
    );
    const result = await response.json();
    if (!response.ok) {
      throw new Error(
        result.error || result.message || "Error al obtener resumen clínico",
      );
    }
    if (Array.isArray(result)) return result;
    if (result.data && Array.isArray(result.data)) return result.data;
    return [];
  },
};
