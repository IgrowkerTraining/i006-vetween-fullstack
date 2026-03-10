import { ToastType } from "../context/ToastContext";

type ShowToastFn = (message: string, type?: ToastType) => void;
type On401Fn = () => void;

export class HttpError extends Error {
  status: number;
  constructor(status: number, message: string) {
    super(message);
    this.name = "HttpError";
    this.status = status;
  }
}

let _showToast: ShowToastFn | null = null;
let _on401: On401Fn | null = null;
let _interceptorInstalled = false;

export const setHttpErrorHandlers = (
  showToastFn: ShowToastFn,
  on401Fn: On401Fn
): void => {
  _showToast = showToastFn;
  _on401 = on401Fn;
};

const STATUS_MESSAGES: Partial<Record<number, string>> = {
  401: "Tu sesión ha expirado. Por favor, inicia sesión nuevamente.",
  403: "No tienes permisos para realizar esta acción.",
  404: "El recurso solicitado no fue encontrado.",
  500: "Error interno del servidor. Intenta nuevamente más tarde.",
  502: "Servicio no disponible. Intenta nuevamente más tarde.",
  503: "Servicio temporalmente no disponible.",
};

const AUTH_ENDPOINTS = ["/auth/login", "/auth/register"];

const isAuthEndpoint = (url: string): boolean =>
  AUTH_ENDPOINTS.some((path) => url.includes(path));

export const installFetchInterceptor = (): void => {
  if (_interceptorInstalled) return;
  _interceptorInstalled = true;

  const originalFetch = window.fetch.bind(window);

  window.fetch = async (
    input: RequestInfo | URL,
    init?: RequestInit
  ): Promise<Response> => {
    const response = await originalFetch(input, init);
    const url =
      typeof input === "string"
        ? input
        : input instanceof URL
        ? input.href
        : (input as Request).url;

    if (!response.ok) {
      const isAuth = isAuthEndpoint(url);

      // 401 on authenticated endpoints = expired session
      if (!isAuth && response.status === 401) {
        const message = STATUS_MESSAGES[401]!;
        _showToast?.(message, "warning");
        _on401?.();
        throw new HttpError(401, message);
      }

      // 5xx = server errors, always generic
      if (response.status >= 500) {
        const message =
          STATUS_MESSAGES[response.status] ??
          "Error del servidor. Intenta nuevamente más tarde.";
        _showToast?.(message, "error");
        throw new HttpError(response.status, message);
      }
    }

    return response;
  };
};
