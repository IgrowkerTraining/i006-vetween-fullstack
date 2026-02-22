export const ROUTES = {
  LOGIN: "/login",
  REGISTER: "/register",
  DASHBOARD: "/dashboard",
  HOME: "/",
  DEV: "/dev",
} as const;

export const API_ENDPOINTS = {
  BASE: 'https://virtserver.swaggerhub.com/personal-c69/Vetween/1.0.0',
  AUTH: {
    LOGIN: "/auth/login",
    REGISTER: "/auth/register",
  },
  HEALTH: "/health",
} as const;

export const STORAGE_KEYS = {
  USER: "example_user",
  TOKEN: "example_token",
} as const;
