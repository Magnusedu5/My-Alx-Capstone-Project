// 📚 LESSON: Main App Component
// This is the heart of our application - it sets up all the routes
// Think of routes as "pages" - each URL shows a different page

import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './utils/ProtectedRoute';

// Import all our pages
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import DocumentsList from './pages/DocumentsList';
import UploadDocument from './pages/UploadDocument';
import ResultsList from './pages/ResultsList';
import UploadResult from './pages/UploadResult';
import ApproveDocuments from './pages/ApproveDocuments';
import ApproveResults from './pages/ApproveResults';

function App() {
  return (
    // 🎯 Step 1: Wrap everything in AuthProvider
    // This gives all components access to user information
    <AuthProvider>
      {/* 🎯 Step 2: Set up the Router
          This enables navigation between pages */}
      <Router>
        <Routes>
          {/* 🎯 Step 3: Define all our routes (pages) */}
          
          {/* Public route - anyone can access */}
          <Route path="/login" element={<Login />} />
          
          {/* Redirect root to dashboard */}
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          
          {/* Protected routes - require authentication */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          
          <Route
            path="/documents"
            element={
              <ProtectedRoute>
                <DocumentsList />
              </ProtectedRoute>
            }
          />
          
          <Route
            path="/documents/upload"
            element={
              <ProtectedRoute>
                <UploadDocument />
              </ProtectedRoute>
            }
          />
          
          <Route
            path="/results"
            element={
              <ProtectedRoute>
                <ResultsList />
              </ProtectedRoute>
            }
          />
          
          <Route
            path="/results/upload"
            element={
              <ProtectedRoute>
                <UploadResult />
              </ProtectedRoute>
            }
          />
          
          {/* HOD-only routes - require HOD role */}
          <Route
            path="/approve-documents"
            element={
              <ProtectedRoute requireHOD={true}>
                <ApproveDocuments />
              </ProtectedRoute>
            }
          />
          
          <Route
            path="/approve-results"
            element={
              <ProtectedRoute requireHOD={true}>
                <ApproveResults />
              </ProtectedRoute>
            }
          />
          
          {/* 404 - Page not found */}
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
