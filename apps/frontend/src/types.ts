// Tipos base
export interface BaseEntity {
  id?: number;
  nombre: string;
}

export interface ContactInfo {
  telefono?: string;
  email?: string;
}

// Tipos específicos da API
export interface Veterinarian {
  id_veterinario: number;
  nombre: string;
  apellido: string;
  email: string;
  matricula: number;
  especialidad: string;
  tipos_animales: string[];
  costo_consulta: number;
  id_clinica: number;
}

export interface Clinic {
  id_clinica: number;
  nombre: string;
  direccion_calle: string;
  direccion_numero: string;
  direccion_localidad: string;
  provincia: string;
  telefono: string;
  num_habilitacion: string;
  fecha_creacion: string;
}

// User es la combinación de Veterinarian + datos de Clinic
// Usado en AuthContext para almacenar el estado del usuario logueado
export interface User {
  // Datos del veterinario (del token/login)
  id_veterinario?: number;
  id_clinica?: number;
  name?: string;
  nombre: string;
  apellido: string;
  email: string;
  matricula?: number;
  especialidad?: string;
  tipos_animales?: string[];
  costo_consulta?: number;
  
  // Datos de la clínica (del token/login)
  nombre_consultorio?: string;
  num_habilitacion?: string;
  direccion_calle?: string;
  direccion_numero?: string;
  direccion_localidad?: string;
  provincia?: string;
  telefono?: string;
  fecha_creacion?: string;
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
