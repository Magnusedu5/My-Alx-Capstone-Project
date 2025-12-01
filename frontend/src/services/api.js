// 📚 LESSON: What is this file?
// This file sets up Axios to talk to our Django backend.
// Think of it as a "phone" that calls our API.

import axios from 'axios';

// 🎯 Step 1: Define where our Django API lives
// Automatically uses production URL in production, localhost in development
const API_BASE_URL = import.meta.env.VITE_API_URL || 
  (import.meta.env.MODE === 'production' 
    ? 'https://my-alx-capstone-project.onrender.com/api'
    : 'http://localhost:8000/api');

// 🎯 Step 2: Create an axios instance (our "phone")
// This is pre-configured to talk to our backend
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 🎯 Step 3: Add authentication to every request
// This is called an "interceptor" - it runs before every API call
// It automatically adds the JWT token to requests
api.interceptors.request.use(
  (config) => {
    // Get the token from localStorage (we'll save it there after login)
    const token = localStorage.getItem('token');
    
    // If we have a token, add it to the request
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => {
    // If something goes wrong, reject the promise
    return Promise.reject(error);
  }
);

// 🎯 Step 4: Handle API responses
// This interceptor runs after we get a response from the server
api.interceptors.response.use(
  (response) => {
    // If successful, just return the response
    return response;
  },
  (error) => {
    // If we get a 401 (Unauthorized), the token might be expired
    // Redirect to login page
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    
    return Promise.reject(error);
  }
);

// 🎯 Step 5: Export our configured "phone" so other files can use it
export default api;

// 🎯 Step 6: Also export the base URL in case we need it
export { API_BASE_URL };
