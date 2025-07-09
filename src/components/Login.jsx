// src/components/Login.js
import { useState, useContext } from 'react';
import { auth } from '../firebase/firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

import ThemeToggle from './ThemeToggle';
import ThemeContext from '../context/ThemeContext';

import {
  FaLock, FaEnvelope, FaSignInAlt, FaUsers, FaDatabase, FaBoxOpen,
  FaRocket, FaLightbulb, FaArrowRight, FaChartLine, FaCalculator, 
  FaBullseye, FaUserPlus, FaShieldAlt
} from 'react-icons/fa';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { theme } = useContext(ThemeContext);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch {
      setError('Invalid email or password');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={theme === 'dark' ? 'dark' : ''}>
      <motion.div 
        className="p-4 min-h-screen bg-[var(--primary-bg)] text-[var(--text-primary)]"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Navigation Bar */}
        <motion.nav 
          className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 p-4 bg-[var(--secondary-bg)] rounded-xl shadow border border-[var(--border)] gap-4"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1, duration: 0.5 }}
        >
          <div className="flex flex-wrap gap-2 sm:gap-4 items-center">
            <button onClick={() => navigate('/dashboard')} className="text-blue-600 hover:underline font-semibold flex items-center gap-1 text-sm sm:text-base">
              <FaBoxOpen /> <span className="hidden sm:inline">Dashboard</span>
            </button>
            <button onClick={() => navigate('/business-data')} className="text-green-600 hover:underline font-semibold flex items-center gap-1 text-sm sm:text-base">
              <FaDatabase /> <span className="hidden sm:inline">Business Data</span>
            </button>
            <button onClick={() => navigate('/profit-loss')} className="text-purple-600 hover:underline font-semibold flex items-center gap-1 text-sm sm:text-base">
              <FaCalculator /> <span className="hidden sm:inline">Profit/Loss</span>
            </button>
            <button onClick={() => navigate('/goals')} className="text-orange-600 hover:underline font-semibold flex items-center gap-1 text-sm sm:text-base">
              <FaBullseye /> <span className="hidden sm:inline">Goals</span>
            </button>
            <button onClick={() => navigate('/register')} className="text-blue-600 hover:underline font-semibold flex items-center gap-1 text-sm sm:text-base">
              <FaUserPlus /> <span className="hidden sm:inline">Register</span>
            </button>
          </div>
          <ThemeToggle />
        </motion.nav>

        {/* Main Content */}
        <motion.div 
          className="max-w-4xl mx-auto"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          {/* Welcome Section */}
          <motion.div 
            className="rounded-xl p-4 sm:p-6 mb-8 border relative overflow-hidden" 
            style={{ background: 'var(--card-bg)', borderColor: 'var(--card-border)' }}
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            whileHover={{ 
              scale: 1.02,
              boxShadow: "0 20px 40px rgba(0,0,0,0.1)"
            }}
          >
            {/* Parallax Background Elements */}
            <motion.div
              className="absolute top-0 right-0 w-32 h-32 bg-purple-200 dark:bg-purple-800 rounded-full opacity-20"
              animate={{ 
                y: [0, -20, 0],
                rotate: [0, 180, 360]
              }}
              transition={{ 
                duration: 8, 
                repeat: Infinity, 
                ease: "linear" 
              }}
            />
            <motion.div
              className="absolute bottom-0 left-0 w-24 h-24 bg-pink-200 dark:bg-pink-800 rounded-full opacity-20"
              animate={{ 
                y: [0, 15, 0],
                scale: [1, 1.2, 1]
              }}
              transition={{ 
                duration: 6, 
                repeat: Infinity, 
                ease: "easeInOut" 
              }}
            />
            
            <div className="relative z-10">
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 mb-4">
                <motion.div
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                  whileHover={{ 
                    scale: 1.2,
                    rotate: [0, 15, -15, 0]
                  }}
                >
                  <FaRocket className="text-2xl sm:text-3xl text-purple-600 flex-shrink-0" />
                </motion.div>
                <motion.h1 
                  className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-indigo-600 bg-clip-text text-transparent"
                  whileHover={{ scale: 1.05 }}
                >
                  Welcome Back to Business Coach AI
                </motion.h1>
              </div>
              <motion.p 
                className="text-[var(--text-primary)] mb-4 text-sm sm:text-base"
                whileHover={{ color: "var(--accent)" }}
              >
                Sign in to continue tracking your business performance with AI-powered insights and analytics.
              </motion.p>
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                <motion.button 
                  onClick={() => navigate('/register')} 
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center justify-center gap-2 text-sm sm:text-base relative overflow-hidden"
                  whileHover={{ 
                    scale: 1.05, 
                    y: -3,
                    boxShadow: "0 10px 25px rgba(59, 130, 246, 0.3)"
                  }}
                  whileTap={{ scale: 0.95 }}
                >
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-blue-400 to-blue-600 opacity-0"
                    whileHover={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                  />
                  <span className="relative z-10 flex items-center gap-2">
                    <motion.div
                      whileHover={{ rotate: 360 }}
                      transition={{ duration: 0.5 }}
                    >
                      <FaUserPlus />
                    </motion.div>
                    Create Account
                  </span>
                </motion.button>
                <motion.button 
                  onClick={() => navigate('/dashboard')} 
                  className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 flex items-center justify-center gap-2 text-sm sm:text-base relative overflow-hidden"
                  whileHover={{ 
                    scale: 1.05, 
                    y: -3,
                    boxShadow: "0 10px 25px rgba(147, 51, 234, 0.3)"
                  }}
                  whileTap={{ scale: 0.95 }}
                >
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-purple-400 to-purple-600 opacity-0"
                    whileHover={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                  />
                  <span className="relative z-10 flex items-center gap-2">
                    <motion.div
                      whileHover={{ rotate: 360 }}
                      transition={{ duration: 0.5 }}
                    >
                      <FaBoxOpen />
                    </motion.div>
                    Explore Dashboard
                  </span>
                </motion.button>
              </div>
            </div>
          </motion.div>

          {/* Login Form Card */}
          <div className="rounded-xl shadow p-4 sm:p-8 border" style={{ background: 'var(--card-bg)', borderColor: 'var(--card-border)' }}>
            <div className="flex items-center gap-3 mb-6">
              <FaSignInAlt className="text-xl sm:text-2xl text-purple-500" />
              <h2 className="text-lg sm:text-xl font-semibold bg-gradient-to-r from-purple-500 to-pink-600 bg-clip-text text-transparent">Sign In to Your Account</h2>
            </div>
            
            {error && (
              <div className="bg-red-100 border border-red-300 text-red-800 px-4 py-3 rounded-lg mb-6 dark:bg-red-900/20 dark:border-red-700 dark:text-red-300">
                {error}
              </div>
            )}
            
            <form onSubmit={handleLogin} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-[var(--text-primary)] mb-2 flex items-center gap-2">
                  <FaEnvelope className="text-green-400" />
                  Email Address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full p-3 border border-[var(--border)] rounded-lg text-[var(--text-primary)] bg-[var(--secondary-bg)] focus:ring-2 focus:ring-[var(--accent)] focus:border-transparent transition-all"
                  placeholder="Enter your email"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-[var(--text-primary)] mb-2 flex items-center gap-2">
                  <FaShieldAlt className="text-red-400" />
                  Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full p-3 border border-[var(--border)] rounded-lg text-[var(--text-primary)] bg-[var(--secondary-bg)] focus:ring-2 focus:ring-[var(--accent)] focus:border-transparent transition-all"
                  placeholder="Enter your password"
                  required
                />
                <div className="text-right mt-2">
                  <button 
                    type="button" 
                    onClick={() => navigate('/reset-password')} 
                    className="text-[var(--accent)] underline text-sm hover:text-[var(--accent-hover)]"
                  >
                    Forgot password?
                  </button>
                </div>
              </div>
              
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-purple-600 to-purple-700 text-white p-3 rounded-lg hover:from-purple-700 hover:to-purple-800 transition-all duration-200 flex items-center justify-center gap-2 font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Signing In...
                  </>
                ) : (
                  <>
                    <FaSignInAlt />
                    Sign In
                    <FaArrowRight />
                  </>
                )}
              </button>
            </form>
            
            <div className="mt-6 pt-6 border-t border-[var(--border)]">
              <p className="text-center text-[var(--text-secondary)]">
                Don't have an account?{' '}
                <button 
                  onClick={() => navigate('/register')} 
                  className="text-[var(--accent)] hover:underline font-semibold"
                >
                  Create one here
                </button>
              </p>
            </div>
          </div>

          {/* Features Section */}
          <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            <div className="bg-gradient-to-br from-green-900/20 to-green-800/20 rounded-xl p-4 sm:p-6 border border-green-700">
              <div className="flex items-center gap-3 mb-3">
                <FaDatabase className="text-xl sm:text-2xl text-green-800" />
                <h3 className="font-semibold text-sm sm:text-base bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">Track Performance</h3>
              </div>
              <p className="text-xs sm:text-sm text-green-700">
                Monitor your business metrics with detailed analytics and insights.
              </p>
            </div>
            
            <div className="bg-gradient-to-br from-purple-900/20 to-purple-800/20 rounded-xl p-4 sm:p-6 border border-purple-700">
              <div className="flex items-center gap-3 mb-3">
                <FaLightbulb className="text-xl sm:text-2xl text-purple-800" />
                <h3 className="font-semibold text-sm sm:text-base bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">AI Insights</h3>
              </div>
              <p className="text-xs sm:text-sm text-purple-700">
                Get intelligent recommendations to improve your business decisions.
              </p>
            </div>
            
            <div className="bg-gradient-to-br from-blue-900/20 to-blue-800/20 rounded-xl p-4 sm:p-6 border border-blue-700 sm:col-span-2 lg:col-span-1">
              <div className="flex items-center gap-3 mb-3">
                <FaChartLine className="text-xl sm:text-2xl text-blue-800" />
                <h3 className="font-semibold text-sm sm:text-base bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">Visual Analytics</h3>
              </div>
              <p className="text-xs sm:text-sm text-blue-700">
                Beautiful charts and graphs to visualize your business data.
              </p>
            </div>
          </div>
        </motion.div>
        
        {/* Floating Action Button */}
        <motion.div
          className="fixed bottom-6 right-6 z-50"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 1, duration: 0.5 }}
        >
          <motion.button
            onClick={() => navigate('/register')}
            className="w-14 h-14 bg-gradient-to-r from-purple-500 to-pink-600 rounded-full shadow-lg flex items-center justify-center text-white relative overflow-hidden"
            whileHover={{ 
              scale: 1.1,
              boxShadow: "0 10px 30px rgba(0,0,0,0.3)"
            }}
            whileTap={{ scale: 0.9 }}
          >
            {/* Parallax background elements */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-purple-400 to-pink-500 opacity-0"
              whileHover={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            />
            <motion.div
              className="absolute top-1 left-1 w-2 h-2 bg-white rounded-full opacity-60"
              animate={{ 
                y: [0, -3, 0],
                opacity: [0.6, 1, 0.6]
              }}
              transition={{ 
                duration: 2, 
                repeat: Infinity, 
                ease: "easeInOut" 
              }}
            />
            <motion.div
              className="absolute bottom-1 right-1 w-1 h-1 bg-white rounded-full opacity-60"
              animate={{ 
                x: [0, 2, 0],
                opacity: [0.6, 1, 0.6]
              }}
              transition={{ 
                duration: 1.5, 
                repeat: Infinity, 
                ease: "easeInOut",
                delay: 0.5
              }}
            />
            
            <motion.div
              className="relative z-10"
              whileHover={{ rotate: 360 }}
              transition={{ duration: 0.5 }}
            >
              <FaUserPlus className="text-xl" />
            </motion.div>
          </motion.button>
        </motion.div>
      </motion.div>
    </div>
  );
}

export default Login;