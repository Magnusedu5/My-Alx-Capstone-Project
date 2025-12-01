// 🎨 PROFESSIONAL LOGIN PAGE - Premium Design
// Award-winning UI with advanced animations and interactions

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '../services/auth';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { FileText, Lock, Mail, ArrowRight, Sparkles, Eye, EyeOff, Shield, Zap } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();
  const { login: setAuthUser } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const data = await login(email, password);
      setAuthUser(data.user);
      toast.success('Welcome back! Logging you in...', {
        icon: '🎉',
        style: {
          borderRadius: '12px',
          background: '#10B981',
          color: '#fff',
          fontWeight: '600',
        },
      });
      setTimeout(() => navigate('/dashboard'), 800);
    } catch (err) {
      setError(err.message || 'Invalid email or password');
      toast.error(err.message || 'Invalid credentials', {
        icon: '❌',
        style: {
          borderRadius: '12px',
          background: '#EF4444',
          color: '#fff',
        },
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center px-4 py-8 relative overflow-hidden">
      <Toaster position="top-center" />
      
      {/* Advanced animated background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Gradient mesh */}
        <div className="absolute inset-0 bg-gradient-to-br from-violet-600/20 via-fuchsia-500/20 to-cyan-500/20"></div>
        
        {/* Animated orbs */}
        <motion.div
          className="absolute -top-40 -right-40 w-96 h-96 bg-gradient-to-br from-violet-500/30 to-fuchsia-500/30 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 90, 0],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div
          className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-br from-cyan-500/30 to-blue-500/30 rounded-full blur-3xl"
          animate={{
            scale: [1.2, 1, 1.2],
            rotate: [90, 0, 90],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-br from-fuchsia-500/20 to-violet-500/20 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        
        {/* Grid pattern overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:64px_64px]"></div>
      </div>

      {/* Premium login card */}
      <motion.div 
        className="w-full max-w-lg relative z-10"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        {/* Glow effect behind card */}
        <div className="absolute -inset-1 bg-gradient-to-r from-violet-600 via-fuchsia-600 to-cyan-600 rounded-3xl blur-2xl opacity-50"></div>
        
        {/* Main card */}
        <div className="relative bg-gray-900/90 backdrop-blur-2xl rounded-3xl shadow-2xl border border-white/10 overflow-hidden">
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-violet-500/5 via-transparent to-cyan-500/5"></div>
          
          <div className="relative p-10">
            {/* Logo and branding */}
            <motion.div 
              className="text-center mb-8"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
            >
              <motion.div 
                className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-violet-500 via-fuchsia-500 to-cyan-500 rounded-3xl mb-6 shadow-2xl shadow-violet-500/50 relative"
                whileHover={{ scale: 1.05, rotate: 5 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-violet-400 via-fuchsia-400 to-cyan-400 rounded-3xl blur-xl opacity-60 animate-pulse"></div>
                <FileText className="w-12 h-12 text-white relative z-10" />
              </motion.div>
              
              <h1 className="text-4xl font-bold text-white mb-3 tracking-tight">
                Welcome Back
              </h1>
              <p className="text-gray-400 flex items-center justify-center gap-2 text-lg">
                <Shield className="w-5 h-5 text-violet-400" />
                Secure Document Management
                <Shield className="w-5 h-5 text-cyan-400" />
              </p>
            </motion.div>

          {/* Error message */}
          {error && (
            <motion.div 
              className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-xl mb-6 backdrop-blur-sm"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <p className="font-medium text-sm">{error}</p>
            </motion.div>
          )}

          {/* Premium login form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email input with premium styling */}
            <motion.div 
              className="group"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <label className="block text-gray-300 font-semibold mb-3 text-sm flex items-center gap-2">
                <Mail className="w-4 h-4 text-violet-400" />
                Email or Username
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-4 bg-white/5 border border-white/10 rounded-2xl focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all duration-300 text-white placeholder-gray-500 backdrop-blur-xl hover:bg-white/10"
                  placeholder="Enter your email or username"
                  required
                />
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-violet-500/0 via-fuchsia-500/0 to-cyan-500/0 group-focus-within:from-violet-500/20 group-focus-within:via-fuchsia-500/20 group-focus-within:to-cyan-500/20 pointer-events-none transition-all duration-500"></div>
              </div>
            </motion.div>

            {/* Password input with show/hide toggle */}
            <motion.div 
              className="group"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
            >
              <label className="block text-gray-300 font-semibold mb-3 text-sm flex items-center gap-2">
                <Lock className="w-4 h-4 text-cyan-400" />
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-4 bg-white/5 border border-white/10 rounded-2xl focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all duration-300 text-white placeholder-gray-500 backdrop-blur-xl hover:bg-white/10 pr-12"
                  placeholder="Enter your password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-cyan-400 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-violet-500/0 via-fuchsia-500/0 to-cyan-500/0 group-focus-within:from-violet-500/20 group-focus-within:via-fuchsia-500/20 group-focus-within:to-cyan-500/20 pointer-events-none transition-all duration-500"></div>
              </div>
            </motion.div>

            {/* Premium submit button */}
            <motion.button
              type="submit"
              disabled={loading}
              className="group relative w-full bg-gradient-to-r from-violet-600 via-fuchsia-600 to-cyan-600 hover:from-violet-500 hover:via-fuchsia-500 hover:to-cyan-500 text-white font-bold py-4 px-6 rounded-2xl shadow-2xl shadow-violet-500/50 transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden mt-8"
              whileHover={{ scale: loading ? 1 : 1.02 }}
              whileTap={{ scale: loading ? 1 : 0.98 }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-violet-400 via-fuchsia-400 to-cyan-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-xl"></div>
              <span className="relative flex items-center gap-2">
                {loading ? (
                  <>
                    <motion.div 
                      className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    />
                    Authenticating...
                  </>
                ) : (
                  <>
                    <Zap className="w-5 h-5" />
                    Sign In
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </span>
            </motion.button>
          </form>

          {/* Premium demo credentials */}
          <motion.div 
            className="mt-8 p-6 bg-gradient-to-r from-violet-500/10 via-fuchsia-500/10 to-cyan-500/10 rounded-2xl border border-white/10 backdrop-blur-sm"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <p className="text-sm font-bold text-white mb-4 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-fuchsia-400" />
              Quick Access Credentials
            </p>
            <div className="space-y-3">
              <motion.div 
                className="group flex items-center justify-between p-3 bg-white/5 hover:bg-white/10 rounded-xl border border-white/5 hover:border-violet-500/50 transition-all cursor-pointer"
                whileHover={{ x: 4 }}
              >
                <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Staff</span>
                <span className="text-sm text-gray-300 font-mono">staff@example.com</span>
              </motion.div>
              <motion.div 
                className="group flex items-center justify-between p-3 bg-white/5 hover:bg-white/10 rounded-xl border border-white/5 hover:border-cyan-500/50 transition-all cursor-pointer"
                whileHover={{ x: 4 }}
              >
                <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">HOD</span>
                <span className="text-sm text-gray-300 font-mono">hod@example.com</span>
              </motion.div>
              <p className="text-xs text-gray-500 text-center mt-3">Password: pass1234 for both accounts</p>
            </div>
          </motion.div>
          
          {/* Security badge */}
          <motion.div 
            className="mt-6 flex items-center justify-center gap-2 text-gray-500 text-xs"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
          >
            <Shield className="w-4 h-4" />
            <span>Secured with 256-bit encryption</span>
          </motion.div>
          </div>
        </div>

        {/* Floating decorative elements */}
        <motion.div 
          className="absolute -z-10 -top-10 -left-10 w-40 h-40 bg-violet-500/20 rounded-full blur-2xl"
          animate={{
            y: [0, -20, 0],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div 
          className="absolute -z-10 -bottom-10 -right-10 w-40 h-40 bg-cyan-500/20 rounded-full blur-2xl"
          animate={{
            y: [0, 20, 0],
            scale: [1.1, 1, 1.1],
          }}
          transition={{
            duration: 5,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </motion.div>
    </div>
  );
};

export default Login;
