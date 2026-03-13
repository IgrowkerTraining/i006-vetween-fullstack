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
let _suppressToastCount = 0;

export const runWithoutToast = async <T>(fn: () => Promise<T>): Promise<T> => {
  _suppressToastCount++;
  try {
    return await fn();
  } finally {
    _suppressToastCount--;
  }
};

const fireToast = (message: string, type?: ToastType): void => {
  if (_suppressToastCount === 0) _showToast?.(message, type);
};

export const setHttpErrorHandlers = (
  showToastFn: ShowToastFn,
  on401Fn: On401Fn,
): void => {
  _showToast = showToastFn;
  _on401 = on401Fn;
};

const STATUS_MESSAGES: Partial<Record<number, string>> = {
  401: "Tu sesión ha expirado. Por favor, inicia sesión nuevamente.",
  403: "No tienes permisos para realizar esta acción.",
  404: "El recurso solicitado no fue encontrado.",
  408: "La solicitud tardó demasiado. Intenta nuevamente.",
  500: "Error interno del servidor. Intenta nuevamente más tarde.",
  502: "Servicio no disponible. Intenta nuevamente más tarde.",
  503: "Servicio temporalmente no disponible.",
};

const FETCH_TIMEOUT_MS = 10000;

const AUTH_ENDPOINTS = ["/auth/login", "/auth/register"];

const isAuthEndpoint = (url: string): boolean =>
  AUTH_ENDPOINTS.some((path) => url.includes(path));

export const installFetchInterceptor = (): void => {
  if (_interceptorInstalled) return;
  _interceptorInstalled = true;

  const originalFetch = window.fetch.bind(window);

  window.fetch = async (
    input: RequestInfo | URL,
    init?: RequestInit,
  ): Promise<Response> => {
    const controller = new AbortController();
    const timeoutId = window.setTimeout(() => {
      controller.abort();
    }, FETCH_TIMEOUT_MS);

    const url =
      typeof input === "string"
        ? input
        : input instanceof URL
          ? input.href
          : (input as Request).url;

    let response: Response;
    try {
      response = await originalFetch(input, {
        ...init,
        signal: init?.signal ?? controller.signal,
      });
    } catch (error: unknown) {
      if (error instanceof DOMException && error.name === "AbortError") {
        const message = STATUS_MESSAGES[408]!;
        fireToast(message, "error");
        throw new HttpError(408, message);
      }

      const message =
        "No se pudo conectar con el servidor. Verifica tu conexión.";
      fireToast(message, "error");
      throw new HttpError(503, message);
    } finally {
      window.clearTimeout(timeoutId);
    }

    if (!response.ok) {
      const isAuth = isAuthEndpoint(url);

      // 401 on authenticated endpoints = expired session
      if (!isAuth && response.status === 401) {
        const message = STATUS_MESSAGES[401]!;
        fireToast(message, "warning");
        _on401?.();
        throw new HttpError(401, message);
      }

      // 5xx = server errors, always generic
      if (response.status >= 500) {
        const message =
          STATUS_MESSAGES[response.status] ??
          "Error del servidor. Intenta nuevamente más tarde.";
        fireToast(message, "error");
        throw new HttpError(response.status, message);
      }
    }

    return response;
  };
};
