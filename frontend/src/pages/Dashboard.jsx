// 🎨 PROFESSIONAL DASHBOARD - Next-Level Design
// Enterprise-grade dashboard with advanced animations and interactions

import { useState, useEffect } from 'react';
import { getDashboardData } from '../services/dashboard';
import { useAuth } from '../context/AuthContext';
import Layout from '../components/Layout';
import { motion } from 'framer-motion';
import { 
  FileText, 
  BarChart3, 
  Clock, 
  CheckCircle,
  Upload,
  TrendingUp,
  Users,
  Activity,
  Zap,
  ArrowUpRight,
  Star,
  Award,
  Target
} from 'lucide-react';

const Dashboard = () => {
  // 🎯 State to store dashboard data
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const { user, isHOD } = useAuth();

  // 🎯 Fetch dashboard data when component loads
  useEffect(() => {
    const fetchData = async () => {
      try {
        const dashboardData = await getDashboardData();
        setData(dashboardData);
      } catch (err) {
        setError(err.message || 'Failed to load dashboard');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []); // Empty array means "run once when component loads"

  // 🎯 Show loading state
  if (loading) {
    return (
      <Layout>
        <div className="text-center py-12">
          <div className="text-4xl mb-4">⏳</div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </Layout>
    );
  }

  // 🎯 Show error state
  if (error) {
    return (
      <Layout>
        <div className="text-center py-12">
          <div className="text-4xl mb-4">❌</div>
          <p className="text-red-600">{error}</p>
        </div>
      </Layout>
    );
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100
      }
    }
  };

  return (
    <Layout>
      {/* Premium welcome section */}
      <motion.div 
        className="mb-12"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-violet-400 via-fuchsia-400 to-cyan-400 mb-3 flex items-center gap-3">
              Welcome back, {user?.username}! 
              <motion.span
                animate={{ rotate: [0, 14, -8, 14, -4, 10, 0] }}
                transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
              >
                👋
              </motion.span>
            </h1>
            <p className="text-gray-400 text-lg flex items-center gap-2">
              <Activity className="w-5 h-5 text-violet-400" />
              {isHOD ? 'Department Overview' : 'Your Activity Dashboard'}
            </p>
          </div>
          
          <motion.div 
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-violet-500/10 to-cyan-500/10 rounded-full border border-white/10"
            whileHover={{ scale: 1.05 }}
          >
            <Award className="w-5 h-5 text-fuchsia-400" />
            <span className="text-sm font-semibold text-white">{user?.role}</span>
          </motion.div>
        </div>
      </motion.div>

      {/* Premium statistics cards */}
      <motion.div 
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Total Documents Card */}
        <motion.div 
          className="group relative overflow-hidden"
          variants={itemVariants}
          whileHover={{ scale: 1.02, y: -5 }}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-violet-600 to-violet-800 rounded-3xl"></div>
          <div className="absolute inset-0 bg-gradient-to-br from-violet-400/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          <div className="relative p-6 backdrop-blur-sm">
            <div className="flex items-center justify-between mb-6">
              <motion.div 
                className="p-3 bg-white/10 rounded-2xl backdrop-blur-xl border border-white/20"
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.6 }}
              >
                <FileText className="w-6 h-6 text-white" />
              </motion.div>
              <div className="flex items-center gap-1 px-3 py-1 bg-green-500/20 rounded-full">
                <TrendingUp className="w-4 h-4 text-green-300" />
                <span className="text-xs text-green-300 font-semibold">+12%</span>
              </div>
            </div>
            <p className="text-violet-200 text-sm font-semibold mb-2">Total Documents</p>
            <div className="flex items-end gap-3">
              <motion.p 
                className="text-5xl font-black text-white"
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3, type: "spring" }}
              >
                {data?.total_documents || 0}
              </motion.p>
              <ArrowUpRight className="w-6 h-6 text-violet-300 mb-2" />
            </div>
            <div className="mt-4 w-full bg-white/10 rounded-full h-2 overflow-hidden">
              <motion.div 
                className="h-full bg-gradient-to-r from-violet-400 to-fuchsia-400 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: "75%" }}
                transition={{ duration: 1, delay: 0.5 }}
              />
            </div>
          </div>
        </motion.div>

        {/* Total Results Card */}
        <motion.div 
          className="group relative overflow-hidden"
          variants={itemVariants}
          whileHover={{ scale: 1.02, y: -5 }}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-cyan-600 to-cyan-800 rounded-3xl"></div>
          <div className="absolute inset-0 bg-gradient-to-br from-cyan-400/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          <div className="relative p-6 backdrop-blur-sm">
            <div className="flex items-center justify-between mb-6">
              <motion.div 
                className="p-3 bg-white/10 rounded-2xl backdrop-blur-xl border border-white/20"
                whileHover={{ rotate: -360 }}
                transition={{ duration: 0.6 }}
              >
                <BarChart3 className="w-6 h-6 text-white" />
              </motion.div>
              <div className="flex items-center gap-1 px-3 py-1 bg-green-500/20 rounded-full">
                <CheckCircle className="w-4 h-4 text-green-300" />
                <span className="text-xs text-green-300 font-semibold">Active</span>
              </div>
            </div>
            <p className="text-cyan-200 text-sm font-semibold mb-2">Total Results</p>
            <div className="flex items-end gap-3">
              <motion.p 
                className="text-5xl font-black text-white"
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.4, type: "spring" }}
              >
                {data?.total_results || 0}
              </motion.p>
              <Target className="w-6 h-6 text-cyan-300 mb-2" />
            </div>
            <div className="mt-4 w-full bg-white/10 rounded-full h-2 overflow-hidden">
              <motion.div 
                className="h-full bg-gradient-to-r from-cyan-400 to-blue-400 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: "65%" }}
                transition={{ duration: 1, delay: 0.6 }}
              />
            </div>
          </div>
        </motion.div>

        {/* HOD-specific stats */}
        {isHOD && (
          <>
            {/* Pending Documents */}
            <motion.div 
              className="group relative overflow-hidden"
              variants={itemVariants}
              whileHover={{ scale: 1.02, y: -5 }}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-orange-600 to-red-600 rounded-3xl"></div>
              <div className="absolute inset-0 bg-gradient-to-br from-orange-400/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <motion.div 
                className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16"
                animate={{ scale: [1, 1.2, 1], rotate: [0, 90, 0] }}
                transition={{ duration: 3, repeat: Infinity }}
              />
              <div className="relative p-6 backdrop-blur-sm">
                <div className="flex items-center justify-between mb-6">
                  <motion.div 
                    className="p-3 bg-white/10 rounded-2xl backdrop-blur-xl border border-white/20"
                    animate={{ rotate: [0, -10, 10, -10, 0] }}
                    transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                  >
                    <Clock className="w-6 h-6 text-white" />
                  </motion.div>
                  <motion.div 
                    className="px-3 py-1 bg-yellow-500/20 rounded-full border border-yellow-400/30"
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <span className="text-xs text-yellow-200 font-bold">URGENT</span>
                  </motion.div>
                </div>
                <p className="text-orange-200 text-sm font-semibold mb-2">Pending Documents</p>
                <div className="flex items-end gap-3">
                  <motion.p 
                    className="text-5xl font-black text-white"
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.5, type: "spring" }}
                  >
                    {data?.pending_documents || 0}
                  </motion.p>
                  <Zap className="w-6 h-6 text-orange-300 mb-2" />
                </div>
                <p className="text-xs text-orange-200 mt-4">Awaiting your review</p>
              </div>
            </motion.div>

            {/* Pending Results */}
            <motion.div 
              className="group relative overflow-hidden"
              variants={itemVariants}
              whileHover={{ scale: 1.02, y: -5 }}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-fuchsia-600 to-pink-600 rounded-3xl"></div>
              <div className="absolute inset-0 bg-gradient-to-br from-fuchsia-400/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <motion.div 
                className="absolute bottom-0 left-0 w-32 h-32 bg-white/5 rounded-full -ml-16 -mb-16"
                animate={{ scale: [1, 1.2, 1], rotate: [0, -90, 0] }}
                transition={{ duration: 3, repeat: Infinity }}
              />
              <div className="relative p-6 backdrop-blur-sm">
                <div className="flex items-center justify-between mb-6">
                  <motion.div 
                    className="p-3 bg-white/10 rounded-2xl backdrop-blur-xl border border-white/20"
                    animate={{ rotate: [0, 10, -10, 10, 0] }}
                    transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                  >
                    <Clock className="w-6 h-6 text-white" />
                  </motion.div>
                  <motion.div 
                    className="px-3 py-1 bg-yellow-500/20 rounded-full border border-yellow-400/30"
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
                  >
                    <span className="text-xs text-yellow-200 font-bold">PENDING</span>
                  </motion.div>
                </div>
                <p className="text-fuchsia-200 text-sm font-semibold mb-2">Pending Results</p>
                <div className="flex items-end gap-3">
                  <motion.p 
                    className="text-5xl font-black text-white"
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.6, type: "spring" }}
                  >
                    {data?.pending_results || 0}
                  </motion.p>
                  <Star className="w-6 h-6 text-fuchsia-300 mb-2" />
                </div>
                <p className="text-xs text-fuchsia-200 mt-4">Awaiting your review</p>
              </div>
            </motion.div>
          </>
        )}
      </motion.div>

      {/* Premium Quick Actions */}
      <motion.div 
        className="relative overflow-hidden rounded-3xl"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8, duration: 0.6 }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900 to-gray-800"></div>
        <div className="absolute inset-0 bg-gradient-to-br from-violet-500/10 via-fuchsia-500/10 to-cyan-500/10"></div>
        <div className="relative p-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
                <Zap className="w-8 h-8 text-fuchsia-400" />
                Quick Actions
              </h2>
              <p className="text-gray-400">Get things done faster</p>
            </div>
            <motion.div 
              className="px-4 py-2 bg-gradient-to-r from-violet-500/20 to-cyan-500/20 rounded-full border border-white/10"
              whileHover={{ scale: 1.05 }}
            >
              <span className="text-sm text-white font-semibold">3 Actions Available</span>
            </motion.div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <motion.a
              href="/documents/upload"
              className="group relative overflow-hidden bg-gradient-to-br from-violet-600/20 to-violet-800/20 backdrop-blur-xl rounded-2xl p-6 border border-white/10 hover:border-violet-500/50 transition-all duration-300"
              whileHover={{ scale: 1.03, y: -5 }}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-violet-500/0 to-violet-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <motion.div 
                className="absolute top-0 right-0 w-32 h-32 bg-violet-500/10 rounded-full -mr-16 -mt-16"
                whileHover={{ scale: 1.5 }}
                transition={{ duration: 0.3 }}
              />
              <div className="relative">
                <motion.div 
                  className="w-14 h-14 bg-gradient-to-br from-violet-500 to-fuchsia-500 rounded-2xl flex items-center justify-center mb-4 shadow-xl shadow-violet-500/50"
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.6 }}
                >
                  <Upload className="w-7 h-7 text-white" />
                </motion.div>
                <h3 className="font-bold text-white text-xl mb-2 group-hover:text-violet-300 transition-colors">Upload Document</h3>
                <p className="text-gray-400 text-sm mb-4">Add new documents to the system</p>
                <div className="flex items-center gap-2 text-violet-400 text-sm font-semibold">
                  <span>Get Started</span>
                  <ArrowUpRight className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                </div>
              </div>
            </motion.a>

            <motion.a
              href="/results/upload"
              className="group relative overflow-hidden bg-gradient-to-br from-cyan-600/20 to-cyan-800/20 backdrop-blur-xl rounded-2xl p-6 border border-white/10 hover:border-cyan-500/50 transition-all duration-300"
              whileHover={{ scale: 1.03, y: -5 }}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/0 to-cyan-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <motion.div 
                className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/10 rounded-full -mr-16 -mt-16"
                whileHover={{ scale: 1.5 }}
                transition={{ duration: 0.3 }}
              />
              <div className="relative">
                <motion.div 
                  className="w-14 h-14 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-2xl flex items-center justify-center mb-4 shadow-xl shadow-cyan-500/50"
                  whileHover={{ rotate: -360 }}
                  transition={{ duration: 0.6 }}
                >
                  <BarChart3 className="w-7 h-7 text-white" />
                </motion.div>
                <h3 className="font-bold text-white text-xl mb-2 group-hover:text-cyan-300 transition-colors">Upload Result</h3>
                <p className="text-gray-400 text-sm mb-4">Add course results and grades</p>
                <div className="flex items-center gap-2 text-cyan-400 text-sm font-semibold">
                  <span>Get Started</span>
                  <ArrowUpRight className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                </div>
              </div>
            </motion.a>

            <motion.a
              href="/documents"
              className="group relative overflow-hidden bg-gradient-to-br from-fuchsia-600/20 to-fuchsia-800/20 backdrop-blur-xl rounded-2xl p-6 border border-white/10 hover:border-fuchsia-500/50 transition-all duration-300"
              whileHover={{ scale: 1.03, y: -5 }}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-fuchsia-500/0 to-fuchsia-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <motion.div 
                className="absolute top-0 right-0 w-32 h-32 bg-fuchsia-500/10 rounded-full -mr-16 -mt-16"
                whileHover={{ scale: 1.5 }}
                transition={{ duration: 0.3 }}
              />
              <div className="relative">
                <motion.div 
                  className="w-14 h-14 bg-gradient-to-br from-fuchsia-500 to-pink-500 rounded-2xl flex items-center justify-center mb-4 shadow-xl shadow-fuchsia-500/50"
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.6 }}
                >
                  <FileText className="w-7 h-7 text-white" />
                </motion.div>
                <h3 className="font-bold text-white text-xl mb-2 group-hover:text-fuchsia-300 transition-colors">View Documents</h3>
                <p className="text-gray-400 text-sm mb-4">Browse and manage all files</p>
                <div className="flex items-center gap-2 text-fuchsia-400 text-sm font-semibold">
                  <span>Get Started</span>
                  <ArrowUpRight className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                </div>
              </div>
            </motion.a>
          </div>
        </div>
      </motion.div>

      {/* Additional info for HOD */}
      {isHOD && data && (data.pending_documents > 0 || data.pending_results > 0) && (
        <div className="mt-6 bg-gradient-to-r from-orange-50 to-red-50 border-l-4 border-orange-500 rounded-lg p-6">
          <div className="flex items-start gap-3">
            <div className="bg-orange-500 rounded-full p-2">
              <Clock className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-800 mb-1">Action Required</h3>
              <p className="text-gray-600 text-sm">
                You have {(data.pending_documents || 0) + (data.pending_results || 0)} item(s) pending your approval.
                Please review them at your earliest convenience.
              </p>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default Dashboard;
