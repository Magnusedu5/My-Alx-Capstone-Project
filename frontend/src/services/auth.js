// 📚 LESSON: Authentication Service
// This file handles all authentication-related API calls
// (login, logout, getting user profile)

import api from './api';

// 🎯 Function 1: Login
// Takes email and password, sends them to Django, gets back a token
export const login = async (email, password) => {
  try {
    // Make a POST request to /api/login/
    const response = await api.post('/login/', {
      email,
      password,
    });
    
    // If successful, save the token and user info
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    
    return response.data;
  } catch (error) {
    // If login fails, throw an error with a message
    throw error.response?.data || { message: 'Login failed' };
  }
};

// 🎯 Function 2: Logout
// Removes token and user info from localStorage
export const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  window.location.href = '/login';
};

// 🎯 Function 3: Get Current User Profile
// Fetches the current user's information from the API
export const getCurrentUser = async () => {
  try {
    const response = await api.get('/profile/');
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to get user profile' };
  }
};

// 🎯 Function 4: Check if user is authenticated
// Returns true if we have a token, false otherwise
export const isAuthenticated = () => {
  const token = localStorage.getItem('token');
  return !!token; // !! converts to boolean
};

// 🎯 Function 5: Get user from localStorage
// Returns the stored user object
export const getUser = () => {
  const userStr = localStorage.getItem('user');
  return userStr ? JSON.parse(userStr) : null;
};

// 🎯 Function 6: Check if user is HOD
// Returns true if the user's role is HOD
export const isHOD = () => {
  const user = getUser();
  return user?.role?.toLowerCase() === 'hod';
};

// 🎯 Function 7: Check if user is Staff
// Returns true if the user's role is Staff
export const isStaff = () => {
  const user = getUser();
  return user?.role?.toLowerCase() === 'staff';
};
