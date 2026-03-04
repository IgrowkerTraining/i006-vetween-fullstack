export const ROUTES = {
  LOGIN: "/login",
  REGISTER: "/register",
  DASHBOARD: "/dashboard",
  PATIENT: "/patient",
  CLINICAL_SUMMARY: "/clinical-summary",
  RESPONSABLES: "/responsables",
  HOME: "/",
  DEV: "/dev",
} as const;

export const API_ENDPOINTS = {
  BASE: "http://localhost:3000/api",
  AUTH: {
    LOGIN: "/auth/login",
    REGISTER: "/auth/register",
  },
  PACIENTES: "/pacientes",
  HEALTH: "/health",
} as const;

export const STORAGE_KEYS = {
  USER: "example_user",
  TOKEN: "example_token",
} as const;
