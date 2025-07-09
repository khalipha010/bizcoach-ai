// src/components/Login.js
import { useState, useContext } from 'react';
import { auth } from '../firebase/firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

import ThemeToggle from './ThemeToggle';
import LoadingSpinner from './LoadingSpinner';
import ThemeContext from '../context/ThemeContext';

import {
  FaLock, FaEnvelope, FaSignInAlt, FaUsers, FaDatabase, FaBoxOpen,
  FaRocket, FaLightbulb, FaArrowRight, FaChartLine, FaCalculator, FaBullseye
} from 'react-icons/fa';

function Login() {
  const { theme } = useContext(ThemeContext);
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

        {/* Navbar */}
        <motion.nav
          className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 p-4 bg-[var(--secondary-bg)] rounded-xl shadow border border-[var(--border)] gap-4"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1, duration: 0.5 }}
        >
          <div className="flex flex-wrap gap-3 sm:gap-6 items-center">
            <button onClick={() => navigate('/dashboard')} className="text-[var(--accent)] hover:underline font-semibold flex items-center gap-2 text-2xl sm:text-3xl">
              <FaBoxOpen /> <span className="hidden sm:inline">Dashboard</span>
            </button>
            <button onClick={() => navigate('/business-data')} className="text-[var(--success)] hover:underline font-semibold flex items-center gap-2 text-2xl sm:text-3xl">
              <FaDatabase /> <span className="hidden sm:inline">Business Data</span>
            </button>
            <button onClick={() => navigate('/profit-loss')} className="text-[var(--purple)] hover:underline font-semibold flex items-center gap-2 text-2xl sm:text-3xl">
              <FaCalculator /> <span className="hidden sm:inline">Profit/Loss</span>
            </button>
            <button onClick={() => navigate('/goals')} className="text-[var(--highlight)] hover:underline font-semibold flex items-center gap-2 text-2xl sm:text-3xl">
              <FaBullseye /> <span className="hidden sm:inline">Goals</span>
            </button>
            <button onClick={() => navigate('/login')} className="text-[var(--accent)] hover:underline font-semibold flex items-center gap-2 text-2xl sm:text-3xl">
              <FaUsers /> <span className="hidden sm:inline">Login</span>
            </button>
          </div>
          <ThemeToggle />
        </motion.nav>

        {/* Main Login Section */}
        <motion.div
          className="max-w-4xl mx-auto"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <motion.div
            className="rounded-xl p-6 mb-8 border relative overflow-hidden"
            style={{ background: 'var(--card-bg)', borderColor: 'var(--card-border)' }}
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-4">
                <FaRocket className="text-3xl text-[var(--accent)]" />
                <h1 className="text-2xl font-bold bg-[var(--gradient-primary)] bg-clip-text text-transparent">
                  Welcome to Business Coach AI
                </h1>
              </div>
              <p className="text-sm text-[var(--text-secondary)] mb-4">
                Sign in to access your dashboard and insights.
              </p>
              <div className="flex gap-4">
                <button onClick={() => navigate('/register')} className="bg-[var(--accent)] text-white px-4 py-2 rounded-lg flex items-center gap-2">
                  <FaUsers /> Create Account
                </button>
                <button onClick={() => navigate('/dashboard')} className="bg-[var(--accent)] text-white px-4 py-2 rounded-lg flex items-center gap-2">
                  <FaBoxOpen /> Explore Dashboard
                </button>
              </div>
            </div>
          </motion.div>

          {/* Login Form */}
          <motion.div
            className="rounded-xl shadow p-8 border relative overflow-hidden"
            style={{ background: 'var(--card-bg)', borderColor: 'var(--card-border)' }}
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.6 }}
          >
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-6">
                <FaSignInAlt className="text-2xl text-[var(--accent)]" />
                <h2 className="text-xl font-semibold bg-[var(--gradient-primary)] bg-clip-text text-transparent">
                  Sign In to Your Account
                </h2>
              </div>

              {error && (
                <div className="bg-[var(--warning-bg)] border border-[var(--warning-border)] text-[var(--warning)] px-4 py-3 rounded-lg mb-6">
                  {error}
                </div>
              )}

              <form onSubmit={handleLogin} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium mb-2 flex items-center gap-2">
                    <FaEnvelope className="text-[var(--accent)]" /> Email
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full p-3 border border-[var(--border)] rounded-lg bg-[var(--secondary-bg)] text-[var(--text-primary)]"
                    placeholder="Enter your email"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2 flex items-center gap-2">
                    <FaLock className="text-[var(--accent)]" /> Password
                  </label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full p-3 border border-[var(--border)] rounded-lg bg-[var(--secondary-bg)] text-[var(--text-primary)]"
                    placeholder="Enter your password"
                    required
                  />
                  <div className="text-right mt-2">
                    <button type="button" onClick={() => navigate('/reset-password')} className="text-[var(--accent)] underline text-sm">
                      Forgot password?
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-[var(--gradient-accent)] text-white p-3 rounded-lg flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {isLoading ? (
                    <LoadingSpinner size="sm" />
                  ) : (
                    <>
                      <FaSignInAlt />
                      Sign In
                      <FaArrowRight />
                    </>
                  )}
                </button>
              </form>

              <div className="mt-6 text-center text-[var(--text-secondary)]">
                Don’t have an account?{' '}
                <button onClick={() => navigate('/register')} className="text-[var(--accent)] hover:underline font-semibold">
                  Create one here
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  );
}

export default Login;
