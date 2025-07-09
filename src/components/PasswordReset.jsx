import { useState } from 'react';
import { sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '../firebase/firebase';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import ThemeToggle from './ThemeToggle';
import LoadingSpinner from './LoadingSpinner';
import { FaEnvelope, FaArrowLeft, FaCheckCircle } from 'react-icons/fa';

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
    <motion.div 
      className="p-4 min-h-screen bg-[var(--primary-bg)] text-[var(--text-primary)]"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <motion.nav 
        className="flex justify-between items-center mb-8 p-4 bg-[var(--secondary-bg)] rounded-xl shadow border border-[var(--border)]"
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.1, duration: 0.5 }}
      >
        <button onClick={() => navigate('/login')} className="text-blue-600 hover:underline font-semibold flex items-center gap-2 text-sm sm:text-base">
          <FaArrowLeft /> Back to Login
        </button>
        <ThemeToggle />
      </motion.nav>
      <motion.div 
        className="max-w-md mx-auto bg-[var(--secondary-bg)] rounded-xl shadow p-6 border border-[var(--border)]"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
      >
        <div className="flex items-center gap-3 mb-6">
          <FaEnvelope className="text-xl sm:text-2xl text-purple-500" />
          <h2 className="text-lg sm:text-xl font-semibold bg-gradient-to-r from-purple-500 to-pink-600 bg-clip-text text-transparent">Reset Your Password</h2>
        </div>
        {error && (
          <div className="bg-red-100 border border-red-300 text-red-800 px-4 py-3 rounded-lg mb-6 dark:bg-red-900/20 dark:border-red-700 dark:text-red-300">
            {error}
          </div>
        )}
        {success && (
          <div className="bg-green-100 border border-green-300 text-green-800 px-4 py-3 rounded-lg mb-6 dark:bg-green-900/20 dark:border-green-700 dark:text-green-300 flex items-center gap-2">
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
            className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 rounded-lg font-semibold hover:from-purple-700 hover:to-pink-700 transition-colors flex items-center justify-center gap-2"
            disabled={isLoading}
          >
            {isLoading ? <LoadingSpinner size="sm" text="" /> : 'Send Password Reset Email'}
          </button>
        </form>
      </motion.div>
    </motion.div>
  );
}

export default PasswordReset;
