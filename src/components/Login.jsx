import { useState } from 'react';
import { auth } from '../firebase/firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

import ThemeToggle from './ThemeToggle';
import LoadingSpinner from './LoadingSpinner';
import { 
  FaLock, 
  FaEnvelope, 
  FaSignInAlt, 
  FaUsers, 
  FaDatabase, 
  FaBoxOpen,
  FaRocket,
  FaLightbulb,
  FaArrowRight,
  FaChartLine,
  FaCalculator,
  FaBullseye
} from 'react-icons/fa';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      // Navigation will be handled by PublicRoute when user state updates
    } catch {
      setError('Invalid email or password');
    } finally {
      setIsLoading(false);
    }
  };

  return (
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
          <button onClick={() => navigate('/login')} className="text-blue-600 hover:underline font-semibold flex items-center gap-1 text-sm sm:text-base">
            <FaUsers /> <span className="hidden sm:inline">Login</span>
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
          className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl p-4 sm:p-6 mb-8 border border-blue-200 dark:border-blue-700 relative overflow-hidden"
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
            className="absolute top-0 right-0 w-32 h-32 bg-blue-200 dark:bg-blue-800 rounded-full opacity-20"
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
            className="absolute bottom-0 left-0 w-24 h-24 bg-indigo-200 dark:bg-indigo-800 rounded-full opacity-20"
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
                <FaRocket className="text-2xl sm:text-3xl text-blue-600 flex-shrink-0" />
              </motion.div>
              <motion.h1 
                className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent"
                whileHover={{ scale: 1.05 }}
              >
                Welcome to Business Coach AI
              </motion.h1>
            </div>
            <motion.p 
              className="text-[var(--text-primary)] mb-4 text-sm sm:text-base"
              whileHover={{ color: "var(--accent)" }}
            >
              Sign in to access your personalized business dashboard and start tracking your performance with AI-powered insights.
            </motion.p>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
              <motion.button 
                onClick={() => navigate('/register')} 
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
                    <FaUsers />
                  </motion.div>
                  Create Account
                </span>
              </motion.button>
              <motion.button 
                onClick={() => navigate('/dashboard')} 
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
                    <FaBoxOpen />
                  </motion.div>
                  Explore Dashboard
                </span>
              </motion.button>
            </div>
          </div>
        </motion.div>

        {/* Login Form Card */}
        <motion.div 
          className="bg-[var(--secondary-bg)] rounded-xl shadow p-4 sm:p-8 border border-[var(--border)] relative overflow-hidden"
          initial={{ y: 40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          whileHover={{ 
            scale: 1.01,
            boxShadow: "0 25px 50px rgba(0,0,0,0.15)"
          }}
        >
          {/* Floating particles */}
          <motion.div
            className="absolute top-4 right-4 w-2 h-2 bg-blue-400 rounded-full opacity-60"
            animate={{ 
              y: [0, -10, 0],
              opacity: [0.6, 1, 0.6]
            }}
            transition={{ 
              duration: 3, 
              repeat: Infinity, 
              ease: "easeInOut" 
            }}
          />
          <motion.div
            className="absolute bottom-6 left-6 w-1 h-1 bg-purple-400 rounded-full opacity-60"
            animate={{ 
              y: [0, 8, 0],
              x: [0, 5, 0]
            }}
            transition={{ 
              duration: 4, 
              repeat: Infinity, 
              ease: "easeInOut",
              delay: 1
            }}
          />
          
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-6">
              <motion.div
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Infinity, repeatDelay: 4 }}
                whileHover={{ 
                  scale: 1.3,
                  rotate: 360
                }}
              >
                <FaSignInAlt className="text-xl sm:text-2xl text-blue-500" />
              </motion.div>
              <motion.h2 
                className="text-lg sm:text-xl font-semibold bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent"
                whileHover={{ scale: 1.05 }}
              >
                Sign In to Your Account
              </motion.h2>
            </div>
          
          {error && (
            <div className="bg-red-100 border border-red-300 text-red-800 px-4 py-3 rounded-lg mb-6 dark:bg-red-900/20 dark:border-red-700 dark:text-red-300">
              {error}
            </div>
          )}
          
          <form onSubmit={handleLogin} className="space-y-6">
            <motion.div
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <motion.label 
                className="block text-sm font-medium text-[var(--text-primary)] mb-2 flex items-center gap-2"
              >
                <motion.div
                  whileHover={{ rotate: 360, scale: 1.2 }}
                  transition={{ duration: 0.5 }}
                >
                  <FaEnvelope className="text-blue-400" />
                </motion.div>
                Email Address
              </motion.label>
              <motion.input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-3 border border-[var(--border)] rounded-lg text-[var(--text-primary)] bg-[var(--secondary-bg)] focus:ring-2 focus:ring-[var(--accent)] focus:border-transparent transition-all"
                placeholder="Enter your email"
                required
                whileFocus={{ 
                  scale: 1.02,
                  boxShadow: "0 0 0 3px rgba(59, 130, 246, 0.1)"
                }}
                whileHover={{ 
                  borderColor: "var(--accent)",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.1)"
                }}
              />
            </motion.div>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-[var(--text-primary)] mb-2 flex items-center gap-2">
                <FaLock className="text-blue-400" />
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
              <div className="mt-2 text-right">
                <button
                  type="button"
                  className="text-blue-600 underline hover:text-blue-800 text-sm font-medium transition-colors"
                  onClick={() => navigate('/reset-password')}
                >
                  Forgot password?
                </button>
              </div>
            </div>
            
            <motion.button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white p-3 rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-200 flex items-center justify-center gap-2 font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {isLoading ? (
                <LoadingSpinner size="sm" text="" />
              ) : (
                <>
                  <FaSignInAlt />
                  Sign In
                  <FaArrowRight />
                </>
              )}
            </motion.button>
          </form>
          
          <motion.div 
            className="mt-6 pt-6 border-t border-[var(--border)]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.5 }}
          >
            <p className="text-center text-[var(--text-secondary)]">
              Don't have an account?{' '}
              <motion.button 
                onClick={() => navigate('/register')} 
                className="text-[var(--accent)] hover:underline font-semibold"
                whileHover={{ 
                  scale: 1.05,
                  textShadow: "0 0 8px var(--accent)"
                }}
              >
                Create one here
              </motion.button>
            </p>
          </motion.div>
        </div>
        </motion.div>

        {/* Features Section */}
        <motion.div 
          className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6"
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.6 }}
        >
          <motion.div 
            className="bg-gradient-to-br from-green-900/20 to-green-800/20 rounded-xl p-4 sm:p-6 border border-green-700 relative overflow-hidden"
            whileHover={{ 
              scale: 1.08, 
              y: -8,
              boxShadow: "0 20px 40px rgba(34, 197, 94, 0.2)"
            }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            {/* Parallax background */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-br from-green-400/10 to-green-600/10 opacity-0"
              whileHover={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            />
            
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-3">
                <motion.div
                  animate={{ rotate: [0, 5, -5, 0] }}
                  transition={{ duration: 2, repeat: Infinity, repeatDelay: 5 }}
                  whileHover={{ 
                    scale: 1.5,
                    rotate: [0, 15, -15, 0]
                  }}
                >
                  <FaDatabase className="text-xl sm:text-2xl text-green-800" />
                </motion.div>
                <motion.h3 
                  className="font-semibold text-sm sm:text-base bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent"
                  whileHover={{ scale: 1.05 }}
                >
                  Track Performance
                </motion.h3>
              </div>
              <motion.p 
                className="text-xs sm:text-sm text-green-700"
                whileHover={{ color: "rgb(34, 197, 94)" }}
              >
                Monitor your business metrics with detailed analytics and insights.
              </motion.p>
            </div>
          </motion.div>
          
          <motion.div 
            className="bg-gradient-to-br from-purple-900/20 to-purple-800/20 rounded-xl p-4 sm:p-6 border border-purple-700 relative overflow-hidden"
            whileHover={{ 
              scale: 1.08, 
              y: -8,
              boxShadow: "0 20px 40px rgba(147, 51, 234, 0.2)"
            }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            {/* Parallax background */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-br from-purple-400/10 to-purple-600/10 opacity-0"
              whileHover={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            />
            
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-3">
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity, repeatDelay: 5 }}
                  whileHover={{ 
                    scale: 1.5,
                    filter: "brightness(1.2)"
                  }}
                >
                  <FaLightbulb className="text-xl sm:text-2xl text-purple-800" />
                </motion.div>
                <motion.h3 
                  className="font-semibold text-sm sm:text-base bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent"
                  whileHover={{ scale: 1.05 }}
                >
                  AI Insights
                </motion.h3>
              </div>
              <motion.p 
                className="text-xs sm:text-sm text-purple-700"
                whileHover={{ color: "rgb(147, 51, 234)" }}
              >
                Get intelligent recommendations to improve your business decisions.
              </motion.p>
            </div>
          </motion.div>
          
          <motion.div 
            className="bg-gradient-to-br from-blue-900/20 to-blue-800/20 rounded-xl p-4 sm:p-6 border border-blue-700 sm:col-span-2 lg:col-span-1 relative overflow-hidden"
            whileHover={{ 
              scale: 1.08, 
              y: -8,
              boxShadow: "0 20px 40px rgba(59, 130, 246, 0.2)"
            }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            {/* Parallax background */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-br from-blue-400/10 to-blue-600/10 opacity-0"
              whileHover={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            />
            
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-3">
                <motion.div
                  animate={{ y: [0, -3, 0] }}
                  transition={{ duration: 2, repeat: Infinity, repeatDelay: 5 }}
                  whileHover={{ 
                    scale: 1.5,
                    y: [0, -8, 0]
                  }}
                >
                  <FaChartLine className="text-xl sm:text-2xl text-blue-800" />
                </motion.div>
                <motion.h3 
                  className="font-semibold text-sm sm:text-base bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent"
                  whileHover={{ scale: 1.05 }}
                >
                  Visual Analytics
                </motion.h3>
              </div>
              <motion.p 
                className="text-xs sm:text-sm text-blue-700"
                whileHover={{ color: "rgb(59, 130, 246)" }}
              >
                Beautiful charts and graphs to visualize your business data.
              </motion.p>
            </div>
          </motion.div>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}

export default Login;