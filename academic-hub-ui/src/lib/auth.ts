/**
 * Authentication Service
 * Handles login, logout, and user authentication
 */

import api from './api';

export interface User {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  role: 'HOD' | 'STAFF';
  department: string | null;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;  // Backend returns 'token', not 'access'
  refresh: string;
  user: User;
}

/**
 * Login user and store tokens
 */
export const login = async (credentials: LoginCredentials): Promise<LoginResponse> => {
  const response = await api.post<LoginResponse>('/login/', credentials);
  const { token, refresh, user } = response.data;  // Backend uses 'token' key

  // Store tokens and user data
  localStorage.setItem('access_token', token);  // Store 'token' as 'access_token'
  localStorage.setItem('refresh_token', refresh);
  localStorage.setItem('user', JSON.stringify(user));

  return response.data;
};

/**
 * Logout user and clear tokens
 */
export const logout = () => {
  localStorage.removeItem('access_token');
  localStorage.removeItem('refresh_token');
  localStorage.removeItem('user');
};

/**
 * Get current user from localStorage
 */
export const getCurrentUser = (): User | null => {
  const userStr = localStorage.getItem('user');
  if (!userStr) return null;
  
  try {
    return JSON.parse(userStr);
  } catch {
    return null;
  }
};

/**
 * Check if user is authenticated
 */
export const isAuthenticated = (): boolean => {
  return !!localStorage.getItem('access_token');
};

/**
 * Check if user has HOD role
 */
export const isHOD = (): boolean => {
  const user = getCurrentUser();
  return user?.role === 'HOD';
};

/**
 * Check if user has Staff role
 */
export const isStaff = (): boolean => {
  const user = getCurrentUser();
  return user?.role === 'STAFF';
};

/**
 * Get user's display name
 */
export const getUserDisplayName = (): string => {
  const user = getCurrentUser();
  if (!user) return 'User';
  
  if (user.first_name && user.last_name) {
    return `${user.first_name} ${user.last_name}`;
  }
  
  return user.username;
};
