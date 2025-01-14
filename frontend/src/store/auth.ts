import { create } from 'zustand';
import { User } from '@/types';
import api from '@/lib/axios';

interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (username: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  getProfile: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: typeof window !== 'undefined' ? localStorage.getItem('token') : null,
  isLoading: false,

  login: async (email: string, password: string) => {
    try {
      set({ isLoading: true });
      const { data } = await api.post('/auth/login', { email, password });
      localStorage.setItem('token', data.token);
      set({ user: data.user, token: data.token });
    } finally {
      set({ isLoading: false });
    }
  },

  register: async (username: string, email: string, password: string) => {
    try {
      set({ isLoading: true });
      await api.post('/auth/register', { username, email, password, role: 'user' });
    } finally {
      set({ isLoading: false });
    }
  },

  logout: () => {
    localStorage.removeItem('token');
    set({ user: null, token: null });
  },

  getProfile: async () => {
    try {
      set({ isLoading: true });
      const { data } = await api.get('/users/profile');
      set({ user: data });
    } finally {
      set({ isLoading: false });
    }
  },
}));
