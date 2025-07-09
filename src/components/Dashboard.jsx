// 🚀 ULTIMATE STUDENT BUSINESS DASHBOARD WITH FIELD GUIDE
import { useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import AuthContext from '../context/AuthContext';
import ThemeToggle from './ThemeToggle';
import {
  FaBoxOpen, 
  FaChartLine, 
  FaInfoCircle,
  FaTag,
  FaDollarSign,
  FaShoppingCart,
  FaChartBar,
  FaBullhorn,
  FaUndo,
  FaWarehouse,
  FaMapMarkerAlt,
  FaPercent,
  FaLightbulb,
  FaRocket,
  FaGraduationCap,
  FaUsers,
  FaDatabase,
  FaArrowRight,
  FaSignOutAlt,
  FaStar,
  FaCalculator,
  FaBullseye
} from 'react-icons/fa';

import { reAuthAndDeleteUser } from '../utils/reAuthAndDeleteUser';

function Dashboard() {
  const { user, logout } = useContext(AuthContext);
  // DEBUG: Log user object and photoURL
  console.log('Dashboard user:', user);
  if (user) {
    console.log('Dashboard user.photoURL:', user.photoURL);
  }
  const navigate = useNavigate();
  const [loggingOut, setLoggingOut] = useState(false);

  const handleLogout = async () => {
    setLoggingOut(true);
    if (typeof logout === 'function') await logout();
  };

  // Delete Profile Handler
  const handleDeleteProfile = async () => {
    if (!window.confirm('Are you sure you want to delete your profile? This action cannot be undone.')) return;
    const password = window.prompt('Please enter your password to confirm deletion:');
    if (!password) return alert('Profile deletion cancelled.');
    try {
      await reAuthAndDeleteUser(password);
      alert('Your profile has been deleted.');
      navigate('/login');
    } catch (err) {
      if (err.code === 'auth/wrong-password') {
        alert('Incorrect password. Profile not deleted.');
      } else if (err.code === 'auth/too-many-requests') {
        alert('Too many failed attempts. Please try again later.');
      } else {
        alert('Error deleting profile: ' + (err.message || err));
      }
    }
  };



  useEffect(() => {
    if (loggingOut && !user) {
      setLoggingOut(false);
      navigate('/login');
    }
  }, [loggingOut, user, navigate]);

  const fieldExplanations = [
    {
      field: 'productName',
      icon: <FaTag className="text-blue-500" />,
      title: 'Product Name',
      description: 'Enter the name of your product or service',
      example: 'e.g., Premium Coffee Blend, Consulting Service',
      required: true,
      category: 'Basic Info'
    },
    {
      field: 'price',
      icon: <FaDollarSign className="text-green-500" />,
      title: 'Price',
      description: 'The selling price of your product/service in Naira',
      example: 'e.g., ₦29,999, ₦150,000',
      required: true,
      category: 'Financial'
    },
    {
      field: 'sales',
      icon: <FaShoppingCart className="text-purple-500" />,
      title: 'Sales Quantity',
      description: 'Number of units sold or services provided',
      example: 'e.g., 50 units, 10 sessions',
      required: true,
      category: 'Performance'
    },
    {
      field: 'expenses',
      icon: <FaChartBar className="text-red-500" />,
      title: 'Expenses',
      description: 'Total cost to produce/deliver the product/service in Naira',
      example: 'e.g., ₦15,000 per unit, ₦80,000 per session',
      required: false,
      category: 'Financial'
    },
    {
      field: 'marketingSpend',
      icon: <FaBullhorn className="text-orange-500" />,
      title: 'Marketing Spend',
      description: 'Amount spent on advertising and promotion in Naira',
      example: 'e.g., ₦200,000 for ads, ₦50,000 for social media',
      required: false,
      category: 'Marketing'
    },
    {
      field: 'unitsReturned',
      icon: <FaUndo className="text-red-400" />,
      title: 'Units Returned',
      description: 'Number of products returned by customers',
      example: 'e.g., 2 returns out of 50 sold',
      required: false,
      category: 'Quality'
    },
    {
      field: 'stockLeft',
      icon: <FaWarehouse className="text-gray-500" />,
      title: 'Stock Left',
      description: 'Remaining inventory after sales',
      example: 'e.g., 25 units remaining in stock',
      required: false,
      category: 'Inventory'
    },
    {
      field: 'category',
      icon: <FaInfoCircle className="text-indigo-500" />,
      title: 'Category',
      description: 'Product category or business segment',
      example: 'e.g., Electronics, Food & Beverage, Services',
      required: false,
      category: 'Organization'
    },
    {
      field: 'rating',
      icon: <FaStar className="text-yellow-500" />,
      title: 'Customer Rating',
      description: 'Average customer satisfaction rating (1-5)',
      example: 'e.g., 4.5 out of 5 stars',
      required: false,
      category: 'Customer'
    },
    {
      field: 'region',
      icon: <FaMapMarkerAlt className="text-pink-500" />,
      title: 'Region',
      description: 'Geographic market or sales region',
      example: 'e.g., North America, Lagos, Online',
      required: false,
      category: 'Market'
    },
    {
      field: 'discount',
      icon: <FaPercent className="text-teal-500" />,
      title: 'Discount',
      description: 'Percentage discount offered on the product',
      example: 'e.g., 10% off, 0 for no discount',
      required: false,
      category: 'Pricing'
    }
  ];

  const categories = [...new Set(fieldExplanations.map(field => field.category))];

  return (
    <motion.div 
      className="p-4 min-h-screen" style={{ background: 'var(--primary-bg)', color: 'var(--text-primary)' }}
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
          <button onClick={() => navigate('/customer-records')} className="text-pink-600 hover:underline font-semibold flex items-center gap-1 text-sm sm:text-base">
            <FaUsers /> <span className="hidden sm:inline">Customer Records</span>
          </button>
          {!user && (
            <button onClick={() => navigate('/login')} className="text-blue-600 hover:underline font-semibold flex items-center gap-1 text-sm sm:text-base">
              <FaUsers /> <span className="hidden sm:inline">Login</span>
            </button>
          )}
        </div>
        <div className="flex gap-2 sm:gap-4 items-center justify-end w-full sm:w-auto">
          <ThemeToggle />
          {user && (
            <>
              <button onClick={handleLogout} className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 flex items-center gap-2 text-sm sm:text-base">
                <FaSignOutAlt /> <span className="hidden sm:inline">Logout</span>
              </button>
              <button
                onClick={handleDeleteProfile}
                className="bg-gradient-to-r from-red-600 to-pink-600 text-white px-3 py-1 rounded hover:from-red-700 hover:to-pink-700 flex items-center gap-2 text-sm sm:text-base border border-red-700 ml-2"
                style={{ transition: 'background 0.2s, box-shadow 0.2s' }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6M1 7h22M8 7V5a2 2 0 012-2h4a2 2 0 012 2v2" /></svg>
                <span className="hidden sm:inline">Delete Profile</span>
              </button>
            </>
          )}
        </div>
      </motion.nav>

      {/* Main Dashboard Content */}
      <motion.div 
        className="max-w-6xl mx-auto bg-[var(--secondary-bg)] rounded-xl shadow p-6"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
      >
                <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-6 gap-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 w-full lg:w-auto">
                      <h1 className="text-xl sm:text-2xl font-bold flex items-center gap-2">
            <FaBoxOpen /> <span className="hidden sm:inline bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">Business Coach AI Dashboard</span>
            <span className="sm:hidden bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">Dashboard</span>
          </h1>
          </div>
          <div className="flex flex-col items-center sm:flex-row sm:justify-end gap-4 w-full lg:w-auto">
            {user && (
              <div className="flex items-center gap-3 bg-[var(--card-bg)] rounded-lg p-3 border border-[var(--card-border)]">
                <div className="relative">
                  {user.photoURL ? (
                    <img 
                      src={user.photoURL} 
                      alt="Profile" 
                      className="w-8 h-8 sm:w-10 sm:h-10 rounded-full object-cover border-2 border-blue-300 dark:border-blue-600 shadow-sm"
                    />
                  ) : (
                    <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-semibold text-sm sm:text-lg border-2 border-blue-300 dark:border-blue-600 shadow-sm">
                      {user.displayName ? user.displayName.charAt(0).toUpperCase() : user.email?.charAt(0).toUpperCase() || 'U'}
                    </div>
                  )}
                  <div className="absolute -bottom-1 -right-1 w-3 h-3 sm:w-4 sm:h-4 bg-green-500 rounded-full border-2 border-white dark:border-gray-800"></div>
                </div>
                <div className="flex flex-col">
                  <span className="text-xs sm:text-sm font-semibold text-[var(--text-primary)]">
                    {user.displayName || 'User'}
                  </span>
                  <span className="text-xs text-[var(--text-secondary)] hidden sm:block">
                    {user.email}
                  </span>
                </div>
              </div>
            )}
            <div className="hidden sm:block">
              <ThemeToggle />
            </div>
            <button 
              onClick={() => navigate('/business-data')} 
              className="bg-green-600 text-white px-4 py-3 sm:px-4 sm:py-2 rounded-lg hover:bg-green-700 flex items-center justify-center gap-2 transition-colors text-sm sm:text-base w-full sm:w-auto"
            >
              <FaDatabase /> <span className="hidden sm:inline">Enter Business Data</span>
              <span className="sm:hidden">Enter Business Data</span>
              <FaArrowRight />
            </button>
          </div>
        </div>

        {/* Welcome Section */}
        <div className="bg-[var(--card-bg)] rounded-xl p-4 sm:p-6 mb-8 border border-[var(--card-border)]">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 mb-4">
            <FaLightbulb className="text-2xl sm:text-3xl text-yellow-500 flex-shrink-0" />
            <h2 className="text-lg sm:text-xl font-semibold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">Welcome to Business Coach AI!</h2>
                </div>
          <p className="text-[var(--text-primary)] mb-4 text-sm sm:text-base">
            Ready to track your business performance? This dashboard helps you understand what data to collect and how to analyze it for better business decisions. All financial data is tracked in Nigerian Naira (₦).
          </p>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
            <button 
              onClick={() => navigate('/business-data')} 
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center justify-center gap-2 text-sm sm:text-base"
            >
              <FaDatabase /> <span className="hidden sm:inline">Start Tracking Data</span>
              <span className="sm:hidden">Track Data</span>
            </button>
            <button 
              onClick={() => document.getElementById('field-guide').scrollIntoView({ behavior: 'smooth' })} 
              className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 flex items-center justify-center gap-2 text-sm sm:text-base"
            >
              <FaGraduationCap /> <span className="hidden sm:inline">Learn About Fields</span>
              <span className="sm:hidden">Learn Fields</span>
            </button>
          </div>
        </div>

        {/* Field Guide Section */}
        <div id="field-guide" className="my-8">
          <div className="flex items-center gap-3 mb-6">
            <FaGraduationCap className="text-2xl text-blue-500" />
            <h2 className="text-xl font-semibold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">Field Guide & Data Requirements</h2>
            <FaLightbulb className="text-lg text-yellow-500" />
          </div>
          <p className="mb-6 leading-relaxed text-[var(--text-primary)]">
            Understanding what data to collect is crucial for business success. Here's a comprehensive guide to all the fields you can track in your business dashboard.
          </p>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {categories.map(category => (
              <div key={category} className="bg-[var(--card-bg)] rounded-xl p-4 sm:p-6 border border-[var(--card-border)]">
                <h3 className="text-base sm:text-lg font-semibold mb-4 flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  <FaUsers className="text-blue-500" />
                  {category}
                </h3>
                <div className="space-y-4">
                  {fieldExplanations
                    .filter(field => field.category === category)
                    .map(field => (
                      <motion.div 
                        key={field.field} 
                        className="bg-[var(--card-bg)] rounded-lg p-3 sm:p-4 shadow-sm border border-[var(--card-border)] hover:shadow-md transition-shadow relative overflow-hidden"
                        whileHover={{ 
                          scale: 1.02,
                          y: -2,
                          boxShadow: "0 8px 25px rgba(0,0,0,0.1)"
                        }}
                        transition={{ type: "spring", stiffness: 300 }}
                      >
                        {/* Subtle background animation */}
                        <motion.div
                          className="absolute inset-0 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/10 dark:to-indigo-900/10 opacity-0"
                          whileHover={{ opacity: 1 }}
                          transition={{ duration: 0.3 }}
                        />
                        
                        <div className="relative z-10">
                          <div className="flex items-start gap-2 sm:gap-3">
                            <motion.div 
                              className="flex-shrink-0 mt-1"
                              whileHover={{ 
                                scale: 1.3,
                                rotate: 360
                              }}
                              transition={{ duration: 0.5 }}
                            >
                              {field.icon}
                            </motion.div>
                            <div className="flex-1 min-w-0">
                              <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 mb-1">
                                <motion.h4 
                                  className="font-semibold text-[var(--text-primary)] text-sm sm:text-base"
                                  whileHover={{ color: "var(--accent)" }}
                                >
                                  {field.title}
                                </motion.h4>
                                {field.required && (
                                  <motion.span 
                                    className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded-full dark:bg-red-900/30 dark:text-red-300 self-start"
                                    whileHover={{ 
                                      scale: 1.1,
                                      backgroundColor: "rgb(254, 226, 226)"
                                    }}
                                  >
                                    Required
                                  </motion.span>
                                )}
                              </div>
                              <motion.p 
                                className="text-xs sm:text-sm text-[var(--text-secondary)] mb-2"
                                whileHover={{ color: "var(--text-primary)" }}
                              >
                                {field.description}
                              </motion.p>
                              <motion.p 
                                className="text-xs text-[var(--text-secondary)] italic"
                                whileHover={{ color: "var(--accent)" }}
                              >
                                {field.example}
                              </motion.p>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                </div>
              </div>
            ))}
          </div>
          </div>

        {/* Quick Actions */}
        <div className="my-8">
                      <h2 className="text-lg sm:text-xl font-semibold mb-4 flex items-center gap-2">
            <FaRocket className="text-purple-500" />
            <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">Quick Actions</span>
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <motion.button 
              onClick={() => navigate('/business-data')} 
              className="bg-[var(--card-bg)] border border-[var(--card-border)] text-white p-4 sm:p-6 rounded-xl hover:shadow-md transition-all duration-200 flex items-center gap-3 relative overflow-hidden"
              whileHover={{ 
                scale: 1.05,
                y: -5,
                boxShadow: "0 15px 35px rgba(34, 197, 94, 0.3)"
              }}
              whileTap={{ scale: 0.95 }}
            >
              {/* Parallax background */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-green-400 to-green-500 opacity-0"
                whileHover={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              />
              
              <motion.div 
                className="text-xl sm:text-2xl relative z-10"
                whileHover={{ rotate: 360, scale: 1.2 }}
                transition={{ duration: 0.5 }}
              >
                <FaDatabase />
              </motion.div>
              <div className="text-left relative z-10">
                <motion.h3 
                  className="font-semibold text-base sm:text-lg"
                  whileHover={{ scale: 1.05 }}
                >
                  Enter Business Data
                </motion.h3>
                <motion.p 
                  className="text-green-100 text-xs sm:text-sm"
                  whileHover={{ color: "rgb(187, 247, 208)" }}
                >
                  Start tracking your products, sales, and performance metrics
                </motion.p>
              </div>
            </motion.button>
            <motion.button 
              onClick={() => navigate('/business-data')} 
              className="bg-[var(--card-bg)] border border-[var(--card-border)] text-white p-4 sm:p-6 rounded-xl hover:shadow-md transition-all duration-200 flex items-center gap-3 relative overflow-hidden"
              whileHover={{ 
                scale: 1.05,
                y: -5,
                boxShadow: "0 15px 35px rgba(59, 130, 246, 0.3)"
              }}
              whileTap={{ scale: 0.95 }}
            >
              {/* Parallax background */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-blue-400 to-blue-500 opacity-0"
                whileHover={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              />
              
              <motion.div 
                className="text-xl sm:text-2xl relative z-10"
                whileHover={{ rotate: 360, scale: 1.2 }}
                transition={{ duration: 0.5 }}
              >
                <FaChartLine />
              </motion.div>
              <div className="text-left relative z-10">
                <motion.h3 
                  className="font-semibold text-base sm:text-lg"
                  whileHover={{ scale: 1.05 }}
                >
                  View Analytics
                </motion.h3>
                <motion.p 
                  className="text-blue-100 text-xs sm:text-sm"
                  whileHover={{ color: "rgb(191, 219, 254)" }}
                >
                  See charts, insights, and AI-powered business recommendations
                </motion.p>
              </div>
            </motion.button>
            <motion.button 
              onClick={() => navigate('/profit-loss')} 
              className="bg-[var(--card-bg)] border border-[var(--card-border)] text-white p-4 sm:p-6 rounded-xl hover:shadow-md transition-all duration-200 flex items-center gap-3 relative overflow-hidden"
              whileHover={{ 
                scale: 1.05,
                y: -5,
                boxShadow: "0 15px 35px rgba(147, 51, 234, 0.3)"
              }}
              whileTap={{ scale: 0.95 }}
            >
              {/* Parallax background */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-purple-400 to-pink-500 opacity-0"
                whileHover={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              />
              
              <motion.div 
                className="text-xl sm:text-2xl relative z-10"
                whileHover={{ rotate: 360, scale: 1.2 }}
                transition={{ duration: 0.5 }}
              >
                <FaCalculator />
              </motion.div>
              <div className="text-left relative z-10">
                <motion.h3 
                  className="font-semibold text-base sm:text-lg"
                  whileHover={{ scale: 1.05 }}
                >
                  Profit & Loss
                </motion.h3>
                <motion.p 
                  className="text-purple-100 text-xs sm:text-sm"
                  whileHover={{ color: "rgb(233, 213, 255)" }}
                >
                  Analyze your business profitability and financial health
                </motion.p>
              </div>
            </motion.button>
            <motion.button 
              onClick={() => navigate('/goals')} 
              className="bg-[var(--card-bg)] border border-[var(--card-border)] text-white p-4 sm:p-6 rounded-xl hover:shadow-md transition-all duration-200 flex items-center gap-3 relative overflow-hidden"
              whileHover={{ 
                scale: 1.05,
                y: -5,
                boxShadow: "0 15px 35px rgba(249, 115, 22, 0.3)"
              }}
              whileTap={{ scale: 0.95 }}
            >
              {/* Parallax background */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-orange-400 to-red-500 opacity-0"
                whileHover={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              />
              
              <motion.div 
                className="text-xl sm:text-2xl relative z-10"
                whileHover={{ rotate: 360, scale: 1.2 }}
                transition={{ duration: 0.5 }}
              >
                <FaBullseye />
              </motion.div>
              <div className="text-left relative z-10">
                <motion.h3 
                  className="font-semibold text-base sm:text-lg"
                  whileHover={{ scale: 1.05 }}
                >
                  Set Goals
                </motion.h3>
                <motion.p 
                  className="text-orange-100 text-xs sm:text-sm"
                  whileHover={{ color: "rgb(254, 215, 170)" }}
                >
                  Track your business goals and celebrate achievements
                </motion.p>
              </div>
            </motion.button>
          </div>
        </div>
      </motion.div>
      
      {/* Floating Action Button with Parallax */}
      <motion.div
        className="fixed bottom-6 right-6 z-50"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 1, duration: 0.5 }}
      >
        <motion.button
          onClick={() => navigate('/business-data')}
          className="w-14 h-14 bg-gradient-to-r from-green-500 to-blue-600 rounded-full shadow-lg flex items-center justify-center text-white relative overflow-hidden"
          whileHover={{ 
            scale: 1.1,
            boxShadow: "0 10px 30px rgba(0,0,0,0.3)"
          }}
          whileTap={{ scale: 0.9 }}
        >
          {/* Parallax background elements */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-green-400 to-blue-500 opacity-0"
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
            <FaDatabase className="text-xl" />
          </motion.div>
        </motion.button>
      </motion.div>
    </motion.div>
  );
}

export default Dashboard;