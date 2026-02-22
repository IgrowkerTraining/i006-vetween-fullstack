import { useCallback } from 'react';
import { useApi } from './useApi';
import { api, RegisterRequest, LoginRequest } from '../services/api';
import { User } from '../types';

export const useAuthApi = () => {
  const registerApi = useCallback(() => {
    throw new Error('useAuthApi.register requires user data');
  }, []);

  const loginApi = useCallback(() => {
    throw new Error('useAuthApi.login requires credentials');
  }, []);

  const register = useCallback(async (userData: RegisterRequest) => {
    return api.register(userData);
  }, []);

  const login = useCallback(async (credentials: LoginRequest) => {
    return api.login(credentials);
  }, []);

  const checkHealth = useCallback(() => {
    return api.checkHealth();
  }, []);

  return {
    register,
    login,
    checkHealth,
  };
};
