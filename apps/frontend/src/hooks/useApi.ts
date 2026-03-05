import { useState, useCallback } from 'react';
import { useNotification } from '../context/NotificationContext'; // Import useNotification

interface ApiState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

interface UseApiReturn<T> extends ApiState<T> {
  execute: (showSuccessToast?: boolean, successMessage?: string) => Promise<T | null>;
  reset: () => void;
}

export const useApi = <T>(
  apiFunction: () => Promise<T>
): UseApiReturn<T> => {
  const [state, setState] = useState<ApiState<T>>({
    data: null,
    loading: false,
    error: null,
  });
  const { showNotification } = useNotification(); // Use o hook aqui

  const execute = useCallback(async (showSuccessToast = false, successMessage = "Sucesso!"): Promise<T | null> => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      const result = await apiFunction();
      setState({ data: result, loading: false, error: null });
      if (showSuccessToast) {
        showNotification(successMessage, "success");
      }
      return result;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Ocorreu um erro desconhecido.';
      setState(prev => ({ ...prev, loading: false, error: errorMessage }));
      showNotification(errorMessage, "error"); // Mostrar toast de erro
      return null;
    }
  }, [apiFunction, showNotification]);

  const reset = useCallback(() => {
    setState({ data: null, loading: false, error: null });
  }, []);

  return {
    ...state,
    execute,
    reset,
  };
};
