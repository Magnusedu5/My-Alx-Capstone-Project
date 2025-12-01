// 📚 LESSON: Enhanced Navigation Bar with Modern Design
// Beautiful gradient navbar with smooth animations

import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { logout as logoutService } from '../services/auth';
import { 
  LayoutDashboard, 
  FileText, 
  BarChart3, 
  CheckCircle, 
  LogOut, 
  User,
  Menu,
  X
} from 'lucide-react';
import { useState } from 'react';

const Navbar = () => {
  const { user, isHOD, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logoutService();
    logout();
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path;

  const navLinks = [
    { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/documents', label: 'Documents', icon: FileText },
    { to: '/results', label: 'Results', icon: BarChart3 },
  ];

  const hodLinks = [
    { to: '/approve-documents', label: 'Approve Docs', icon: CheckCircle },
    { to: '/approve-results', label: 'Approve Results', icon: CheckCircle },
  ];

  return (
    <nav className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 text-white shadow-2xl sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          {/* Logo */}
          <Link 
            to="/dashboard" 
            className="flex items-center space-x-3 group"
          >
            <div className="bg-white/20 backdrop-blur-sm p-2 rounded-xl group-hover:scale-110 transition-transform duration-300">
              <FileText className="w-6 h-6" />
            </div>
            <span className="text-xl font-bold hidden sm:block">DMS</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const active = isActive(link.to);
              return (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-300 ${
                    active
                      ? 'bg-white/20 backdrop-blur-sm shadow-lg'
                      : 'hover:bg-white/10'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="font-medium">{link.label}</span>
                </Link>
              );
            })}

            {isHOD && hodLinks.map((link) => {
              const Icon = link.icon;
              const active = isActive(link.to);
              return (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-300 ${
                    active
                      ? 'bg-white/20 backdrop-blur-sm shadow-lg'
                      : 'hover:bg-white/10'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="font-medium">{link.label}</span>
                </Link>
              );
            })}
          </div>

          {/* User info & Logout */}
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-3 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full">
              <User className="w-4 h-4" />
              <div className="text-sm">
                <p className="font-semibold">{user?.username}</p>
                <p className="text-xs text-white/80">{user?.role}</p>
              </div>
            </div>
            
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 bg-red-500 hover:bg-red-600 px-4 py-2 rounded-full transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Logout</span>
            </button>

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-white/10 transition-colors"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="md:hidden pb-4 space-y-2 animate-fadeIn">
            {[...navLinks, ...(isHOD ? hodLinks : [])].map((link) => {
              const Icon = link.icon;
              const active = isActive(link.to);
              return (
                <Link
                  key={link.to}
                  to={link.to}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                    active
                      ? 'bg-white/20 backdrop-blur-sm'
                      : 'hover:bg-white/10'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{link.label}</span>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
