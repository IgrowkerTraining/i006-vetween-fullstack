import { useState, useCallback } from 'react';
import { useToast } from '../context/ToastContext';
import { HttpError } from '../utils/httpErrorHandler';

interface ApiState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

interface UseApiReturn<T> extends ApiState<T> {
  execute: () => Promise<T | null>;
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

  const { showToast } = useToast();

  const execute = useCallback(async (): Promise<T | null> => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      const result = await apiFunction();
      setState({ data: result, loading: false, error: null });
      return result;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An error occurred';
      setState(prev => ({ ...prev, loading: false, error: errorMessage }));
      // HttpErrors are already toasted by the fetch interceptor (401, 5xx)
      if (!(error instanceof HttpError)) {
        showToast(errorMessage, 'error');
      }
      return null;
    }
  }, [apiFunction, showToast]);

  const reset = useCallback(() => {
    setState({ data: null, loading: false, error: null });
  }, []);

  return {
    ...state,
    execute,
    reset,
  };
};
