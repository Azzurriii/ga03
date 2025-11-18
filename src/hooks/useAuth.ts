import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { mockAuthApi } from '@/services/mockAuthApi';
import { useAuthStore } from '@/store/authStore';
import type { User } from '@/store/authStore';

// Types
interface LoginCredentials {
  email: string;
  password: string;
}

interface GoogleCredentials {
  credential: string;
}

interface AuthResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
}

interface RefreshResponse {
  accessToken: string;
}

// Query keys
export const authKeys = {
  all: ['auth'] as const,
  user: () => [...authKeys.all, 'user'] as const,
};

// Login mutation
export function useLogin() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { setUser } = useAuthStore();

  return useMutation({
    mutationFn: async (credentials: LoginCredentials) => {
      const response = await mockAuthApi.login(
        credentials.email,
        credentials.password
      );
      return response;
    },
    onSuccess: (data: AuthResponse) => {
      // Update auth store
      setUser(data.user, data.accessToken);
      
      // Store refresh token
      localStorage.setItem('refreshToken', data.refreshToken);
      
      // Invalidate user query to trigger refetch
      queryClient.invalidateQueries({ queryKey: authKeys.user() });
      
      // Navigate to dashboard
      navigate('/inbox');
    },
    onError: (error: Error) => {
      console.error('Login failed:', error);
    },
  });
}

// Google login mutation
export function useGoogleLogin() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { setUser } = useAuthStore();

  return useMutation({
    mutationFn: async (credentials: GoogleCredentials) => {
      const response = await mockAuthApi.googleLogin(credentials.credential);
      return response;
    },
    onSuccess: (data: AuthResponse) => {
      // Update auth store
      setUser(data.user, data.accessToken);
      
      // Store refresh token
      localStorage.setItem('refreshToken', data.refreshToken);
      
      // Invalidate user query to trigger refetch
      queryClient.invalidateQueries({ queryKey: authKeys.user() });
      
      // Navigate to dashboard
      navigate('/inbox');
    },
    onError: (error: Error) => {
      console.error('Google login failed:', error);
    },
  });
}

// Logout mutation
export function useLogout() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { logout: logoutStore } = useAuthStore();

  return useMutation({
    mutationFn: async () => {
      // In a real app, you would call an API endpoint to invalidate the refresh token
      // await apiClient.post('/auth/logout');
      return Promise.resolve();
    },
    onSuccess: () => {
      // Clear auth store
      logoutStore();
      
      // Remove refresh token
      localStorage.removeItem('refreshToken');
      
      // Clear all queries
      queryClient.clear();
      
      // Navigate to login
      navigate('/login');
    },
    onError: (error: Error) => {
      console.error('Logout failed:', error);
      // Even if logout fails, clear local state
      logoutStore();
      localStorage.removeItem('refreshToken');
      navigate('/login');
    },
  });
}

// Fetch user data (for protected routes)
export function useUser() {
  const { isAuthenticated, user } = useAuthStore();

  return useQuery({
    queryKey: authKeys.user(),
    queryFn: async () => {
      // In a real app, fetch user data from API
      // const response = await apiClient.get('/auth/me');
      // return response.data;
      
      // For now, return user from store
      return user;
    },
    enabled: isAuthenticated, // Only fetch when authenticated
    staleTime: 5 * 60 * 1000, // Consider data fresh for 5 minutes
    gcTime: 10 * 60 * 1000, // Keep in cache for 10 minutes
  });
}

// Refresh token mutation
export function useRefreshToken() {
  const { setUser } = useAuthStore();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      const refreshToken = localStorage.getItem('refreshToken');
      if (!refreshToken) {
        throw new Error('No refresh token available');
      }
      
      const response = await mockAuthApi.refreshToken(refreshToken);
      return response;
    },
    onSuccess: (data: RefreshResponse) => {
      // Update auth store with new access token
      const currentUser = useAuthStore.getState().user;
      if (currentUser) {
        setUser(currentUser, data.accessToken);
      }
      
      // Invalidate user query
      queryClient.invalidateQueries({ queryKey: authKeys.user() });
    },
    onError: (error: Error) => {
      console.error('Token refresh failed:', error);
      // Clear auth state on refresh failure
      useAuthStore.getState().logout();
      localStorage.removeItem('refreshToken');
    },
  });
}
