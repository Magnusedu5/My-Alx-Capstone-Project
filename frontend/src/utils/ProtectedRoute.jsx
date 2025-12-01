// 📚 LESSON: Protected Route Component
// This component protects pages that require authentication
// If user is not logged in, redirect them to login page

import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// 🎯 This component wraps around pages that need authentication
const ProtectedRoute = ({ children, requireHOD = false }) => {
  const { isAuthenticated, isHOD } = useAuth();

  // If not logged in, redirect to login page
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // If page requires HOD role but user is not HOD, redirect to dashboard
  if (requireHOD && !isHOD) {
    return <Navigate to="/dashboard" replace />;
  }

  // User is authenticated and has correct role, show the page
  return children;
};

export default ProtectedRoute;
