import api from './api';

export interface User {
  id: string;
  username: string;
  email: string;
  role: string;
  avatar_url?: string;
}

export interface LoginParams {
  username?: string;
  email?: string;
  password: string;
}

export interface RegisterParams {
  username: string;
  email: string;
  password: string;
}

export const authService = {
  login: async (params: LoginParams) => {
    const response = await api.post('/auth/login', params);
    return response.data;
  },

  register: async (params: RegisterParams) => {
    const response = await api.post('/auth/register', params);
    return response.data;
  },

  getCurrentUser: async (): Promise<User> => {
    const response = await api.get('/users/me');
    return response.data;
  },

  logout: () => {
    localStorage.removeItem('token');
  },
};
