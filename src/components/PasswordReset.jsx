import { useState } from 'react';
import { sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '../firebase/firebase';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import LoadingSpinner from './LoadingSpinner';
import { 
  FaEnvelope, 
  FaArrowLeft, 
  FaCheckCircle,
  FaBoxOpen,
  FaDatabase,
  FaCalculator,
  FaBullseye,
  FaUsers
} from 'react-icons/fa';

function PasswordReset() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setIsLoading(true);
    try {
      await sendPasswordResetEmail(auth, email);
      setSuccess('Password reset email sent! Check your inbox.');
    } catch (err) {
      setError('Failed to send password reset email. Please check your email address.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="dark">
      <motion.div 
        className="p-4 min-h-screen bg-[var(--primary-bg)] text-[var(--text-primary)]"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Navigation Bar */}
        <motion.nav 
          className="flex justify-center items-center mb-8 p-4 bg-[var(--secondary-bg)] rounded-xl shadow border border-[var(--border)]"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1, duration: 0.5 }}
        >
          <div className="flex flex-wrap gap-4 items-center">
            <button onClick={() => navigate('/dashboard')} className="text-blue-400 hover:underline font-semibold flex items-center gap-1 text-sm sm:text-base">
              <FaBoxOpen /> <span className="hidden sm:inline">Dashboard</span>
            </button>
            <button onClick={() => navigate('/business-data')} className="text-green-400 hover:underline font-semibold flex items-center gap-1 text-sm sm:text-base">
              <FaDatabase /> <span className="hidden sm:inline">Business Data</span>
            </button>
            <button onClick={() => navigate('/profit-loss')} className="text-purple-400 hover:underline font-semibold flex items-center gap-1 text-sm sm:text-base">
              <FaCalculator /> <span className="hidden sm:inline">Profit/Loss</span>
            </button>
            <button onClick={() => navigate('/goals')} className="text-orange-400 hover:underline font-semibold flex items-center gap-1 text-sm sm:text-base">
              <FaBullseye /> <span className="hidden sm:inline">Goals</span>
            </button>
            <button onClick={() => navigate('/login')} className="text-blue-400 hover:underline font-semibold flex items-center gap-1 text-sm sm:text-base">
              <FaUsers /> <span className="hidden sm:inline">Login</span>
            </button>
          </div>
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
              className="absolute top-0 right-0 w-32 h-32 bg-purple-800 rounded-full opacity-20"
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
              className="absolute bottom-0 left-0 w-24 h-24 bg-pink-800 rounded-full opacity-20"
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
                  <FaEnvelope className="text-2xl sm:text-3xl text-purple-400 flex-shrink-0" />
                </motion.div>
                <motion.h1 
                  className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-indigo-400 bg-clip-text text-transparent"
                  whileHover={{ scale: 1.05 }}
                >
                  Reset Your Password
                </motion.h1>
              </div>
              <motion.p 
                className="text-[var(--text-primary)] mb-4 text-sm sm:text-base"
                whileHover={{ color: "var(--accent)" }}
              >
                Enter your email address and we'll send you a link to reset your password.
              </motion.p>
            </div>
          </motion.div>

          {/* Reset Form Card */}
          <div className="rounded-xl shadow p-4 sm:p-8 border" style={{ background: 'var(--card-bg)', borderColor: 'var(--card-border)' }}>
            {error && (
              <div className="bg-red-900/20 border border-red-700 text-red-300 px-4 py-3 rounded-lg mb-6">
                {error}
              </div>
            )}
            {success && (
              <div className="bg-green-900/20 border border-green-700 text-green-300 px-4 py-3 rounded-lg mb-6 flex items-center gap-2">
                <FaCheckCircle /> {success}
              </div>
            )}
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-[var(--text-primary)] mb-2 flex items-center gap-2">
                  <FaEnvelope className="text-blue-400" />
                  Email Address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full p-3 border border-[var(--border)] rounded-lg text-[var(--text-primary)] bg-[var(--secondary-bg)] focus:ring-2 focus:ring-[var(--accent)] focus:border-transparent transition-all"
                  placeholder="Enter your email address"
                  required
                />
              </div>
              
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white p-3 rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all duration-200 flex items-center justify-center gap-2 font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Sending Email...
                  </>
                ) : (
                  <>
                    <FaEnvelope />
                    Send Password Reset Email
                    <FaArrowLeft className="transform rotate-180" />
                  </>
                )}
              </button>
            </form>
            
            <div className="mt-6 pt-6 border-t border-[var(--border)]">
              <button 
                onClick={() => navigate('/login')} 
                className="w-full text-center text-[var(--accent)] hover:underline font-semibold flex items-center justify-center gap-2"
              >
                <FaArrowLeft /> Back to Login
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}

export default PasswordReset;