// 📚 LESSON: Authentication Context
// This creates a "global storage" for user information
// Any component can access the current user and login status

import { createContext, useState, useContext, useEffect } from 'react';
import { isAuthenticated, getUser } from '../services/auth';

// 🎯 Step 1: Create the context (the "bulletin board")
const AuthContext = createContext();

// 🎯 Step 2: Create a provider component
// This wraps around our entire app and provides user info to all components
export const AuthProvider = ({ children }) => {
  // State to store the current user
  const [user, setUser] = useState(null);
  // State to track if we're loading user info
  const [loading, setLoading] = useState(true);

  // 🎯 Step 3: When the app loads, check if user is logged in
  useEffect(() => {
    // Check if we have a token
    if (isAuthenticated()) {
      // Get user from localStorage
      const userData = getUser();
      setUser(userData);
    }
    // Done loading
    setLoading(false);
  }, []);

  // 🎯 Step 4: Function to update user after login
  const login = (userData) => {
    setUser(userData);
  };

  // 🎯 Step 5: Function to clear user after logout
  const logout = () => {
    setUser(null);
  };

  // 🎯 Step 6: Create the value object that will be shared
  // Any component can access these values
  const value = {
    user,           // The current user object
    loading,        // Is data still loading?
    login,          // Function to set user after login
    logout,         // Function to clear user after logout
    isAuthenticated: !!user,  // Boolean: is user logged in?
    isHOD: user?.role?.toLowerCase() === 'hod',  // Boolean: is user HOD?
    isStaff: user?.role?.toLowerCase() === 'staff',  // Boolean: is user Staff?
  };

  // 🎯 Step 7: Provide the value to all child components
  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

// 🎯 Step 8: Create a custom hook for easy access
// Instead of using useContext(AuthContext), we can use useAuth()
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
