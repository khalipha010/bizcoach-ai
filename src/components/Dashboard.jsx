import { useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import AuthContext from '../context/AuthContext';
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
  const navigate = useNavigate();
  const [loggingOut, setLoggingOut] = useState(false);

  const handleLogout = async () => {
    setLoggingOut(true);
    if (typeof logout === 'function') await logout();
  };

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
      icon: <FaTag className="text-blue-400" />,
      title: 'Product Name',
      description: 'Enter the name of your product or service',
      example: 'e.g., Premium Coffee Blend, Consulting Service',
      required: true,
      category: 'Basic Info'
    },
    {
      field: 'price',
      icon: <FaDollarSign className="text-green-400" />,
      title: 'Price',
      description: 'The selling price of your product/service in Naira',
      example: 'e.g., ₦29,999, ₦150,000',
      required: true,
      category: 'Financial'
    },
    {
      field: 'sales',
      icon: <FaShoppingCart className="text-purple-400" />,
      title: 'Sales Quantity',
      description: 'Number of units sold or services provided',
      example: 'e.g., 50 units, 10 sessions',
      required: true,
      category: 'Performance'
    },
    {
      field: 'expenses',
      icon: <FaChartBar className="text-red-400" />,
      title: 'Expenses',
      description: 'Total cost to produce/deliver the product/service in Naira',
      example: 'e.g., ₦15,000 per unit, ₦80,000 per session',
      required: false,
      category: 'Financial'
    },
    {
      field: 'marketingSpend',
      icon: <FaBullhorn className="text-orange-400" />,
      title: 'Marketing Spend',
      description: 'Amount spent on advertising and promotion in Naira',
      example: 'e.g., ₦200,000 for ads, ₦50,000 for social media',
      required: false,
      category: 'Marketing'
    },
    {
      field: 'unitsReturned',
      icon: <FaUndo className="text-red-300" />,
      title: 'Units Returned',
      description: 'Number of products returned by customers',
      example: 'e.g., 2 returns out of 50 sold',
      required: false,
      category: 'Quality'
    },
    {
      field: 'stockLeft',
      icon: <FaWarehouse className="text-gray-400" />,
      title: 'Stock Left',
      description: 'Remaining inventory after sales',
      example: 'e.g., 25 units remaining in stock',
      required: false,
      category: 'Inventory'
    },
    {
      field: 'category',
      icon: <FaInfoCircle className="text-indigo-400" />,
      title: 'Category',
      description: 'Product category or business segment',
      example: 'e.g., Electronics, Food & Beverage, Services',
      required: false,
      category: 'Organization'
    },
    {
      field: 'rating',
      icon: <FaStar className="text-yellow-400" />,
      title: 'Customer Rating',
      description: 'Average customer satisfaction rating (1-5)',
      example: 'e.g., 4.5 out of 5 stars',
      required: false,
      category: 'Customer'
    },
    {
      field: 'region',
      icon: <FaMapMarkerAlt className="text-pink-400" />,
      title: 'Region',
      description: 'Geographic market or sales region',
      example: 'e.g., North America, Lagos, Online',
      required: false,
      category: 'Market'
    },
    {
      field: 'discount',
      icon: <FaPercent className="text-teal-400" />,
      title: 'Discount',
      description: 'Percentage discount offered on the product',
      example: 'e.g., 10% off, 0 for no discount',
      required: false,
      category: 'Pricing'
    }
  ];

  const categories = [...new Set(fieldExplanations.map(field => field.category))];

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
            {!user && (
              <button onClick={() => navigate('/login')} className="text-blue-400 hover:underline font-semibold flex items-center gap-1 text-sm sm:text-base">
                <FaUsers /> <span className="hidden sm:inline">Login</span>
              </button>
            )}
          </div>
          {user && (
            <div className="flex gap-4 items-center ml-4">
              <button onClick={handleLogout} className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 flex items-center gap-2 text-sm sm:text-base">
                <FaSignOutAlt /> <span className="hidden sm:inline">Logout</span>
              </button>
              <button
                onClick={handleDeleteProfile}
                className="bg-gradient-to-r from-red-600 to-pink-600 text-white px-3 py-1 rounded hover:from-red-700 hover:to-pink-700 flex items-center gap-2 text-sm sm:text-base border border-red-700"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                <span className="hidden sm:inline">Delete Profile</span>
              </button>
            </div>
          )}
        </motion.nav>

        {/* Main Content */}
        <motion.div 
          className="max-w-6xl mx-auto"
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
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                <div className="flex items-center gap-3">
                  <motion.div
                    animate={{ rotate: [0, 10, -10, 0] }}
                    transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                    whileHover={{ 
                      scale: 1.2,
                      rotate: [0, 15, -15, 0]
                    }}
                  >
                    <FaRocket className="text-2xl sm:text-3xl text-purple-400" />
                  </motion.div>
                  <motion.h1 
                    className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-indigo-400 bg-clip-text text-transparent"
                    whileHover={{ scale: 1.05 }}
                  >
                    Business Coach AI Dashboard
                  </motion.h1>
                </div>
                {user && (
                  <div className="flex items-center gap-3 bg-[var(--secondary-bg)] rounded-lg p-2 border border-[var(--border)]">
                    {user.photoURL ? (
                      <img 
                        src={user.photoURL} 
                        alt="Profile" 
                        className="w-8 h-8 rounded-full object-cover border-2 border-blue-400"
                      />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center text-white font-semibold">
                        {user.displayName ? user.displayName.charAt(0).toUpperCase() : user.email?.charAt(0).toUpperCase() || 'U'}
                      </div>
                    )}
                    <div className="text-sm">
                      <div className="font-semibold">{user.displayName || 'User'}</div>
                      <div className="text-xs text-[var(--text-secondary)]">{user.email}</div>
                    </div>
                  </div>
                )}
              </div>
              
              <motion.p 
                className="text-[var(--text-primary)] mb-6 text-sm sm:text-base"
                whileHover={{ color: "var(--accent)" }}
              >
                Track your business performance with AI-powered insights and analytics. All financial data is tracked in Nigerian Naira (₦).
              </motion.p>
              
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                <motion.button 
                  onClick={() => navigate('/business-data')} 
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center justify-center gap-2 text-sm sm:text-base relative overflow-hidden"
                  whileHover={{ 
                    scale: 1.05, 
                    y: -3,
                    boxShadow: "0 10px 25px rgba(59, 130, 246, 0.3)"
                  }}
                  whileTap={{ scale: 0.95 }}
                >
                  <FaDatabase /> 
                  <span>Enter Business Data</span>
                  <FaArrowRight />
                </motion.button>
                
                <motion.button 
                  onClick={() => document.getElementById('field-guide').scrollIntoView({ behavior: 'smooth' })} 
                  className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 flex items-center justify-center gap-2 text-sm sm:text-base relative overflow-hidden"
                  whileHover={{ 
                    scale: 1.05, 
                    y: -3,
                    boxShadow: "0 10px 25px rgba(147, 51, 234, 0.3)"
                  }}
                  whileTap={{ scale: 0.95 }}
                >
                  <FaGraduationCap /> 
                  <span>Learn About Fields</span>
                </motion.button>
              </div>
            </div>
          </motion.div>

          {/* Quick Actions Section */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-6">
              <FaRocket className="text-xl sm:text-2xl text-purple-400" />
              <h2 className="text-lg sm:text-xl font-semibold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                Quick Actions
              </h2>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              {/* Business Data Card */}
              <motion.div 
                className="rounded-xl p-4 sm:p-6 border relative overflow-hidden cursor-pointer" 
                style={{ background: 'var(--card-bg)', borderColor: 'var(--card-border)' }}
                onClick={() => navigate('/business-data')}
                whileHover={{ 
                  scale: 1.03,
                  y: -3,
                  boxShadow: "0 10px 25px rgba(34, 197, 94, 0.2)"
                }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="flex items-center gap-3">
                  <motion.div
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 0.5 }}
                  >
                    <FaDatabase className="text-xl sm:text-2xl text-green-400" />
                  </motion.div>
                  <div>
                    <h3 className="font-semibold text-sm sm:text-base">Business Data</h3>
                    <p className="text-xs sm:text-sm text-[var(--text-secondary)]">Enter your business metrics</p>
                  </div>
                </div>
              </motion.div>

              {/* Profit & Loss Card */}
              <motion.div 
                className="rounded-xl p-4 sm:p-6 border relative overflow-hidden cursor-pointer" 
                style={{ background: 'var(--card-bg)', borderColor: 'var(--card-border)' }}
                onClick={() => navigate('/profit-loss')}
                whileHover={{ 
                  scale: 1.03,
                  y: -3,
                  boxShadow: "0 10px 25px rgba(59, 130, 246, 0.2)"
                }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="flex items-center gap-3">
                  <motion.div
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 0.5 }}
                  >
                    <FaCalculator className="text-xl sm:text-2xl text-blue-400" />
                  </motion.div>
                  <div>
                    <h3 className="font-semibold text-sm sm:text-base">Profit & Loss</h3>
                    <p className="text-xs sm:text-sm text-[var(--text-secondary)]">Analyze financial performance</p>
                  </div>
                </div>
              </motion.div>

              {/* Goals Card */}
              <motion.div 
                className="rounded-xl p-4 sm:p-6 border relative overflow-hidden cursor-pointer" 
                style={{ background: 'var(--card-bg)', borderColor: 'var(--card-border)' }}
                onClick={() => navigate('/goals')}
                whileHover={{ 
                  scale: 1.03,
                  y: -3,
                  boxShadow: "0 10px 25px rgba(234, 88, 12, 0.2)"
                }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="flex items-center gap-3">
                  <motion.div
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 0.5 }}
                  >
                    <FaBullseye className="text-xl sm:text-2xl text-orange-400" />
                  </motion.div>
                  <div>
                    <h3 className="font-semibold text-sm sm:text-base">Goals</h3>
                    <p className="text-xs sm:text-sm text-[var(--text-secondary)]">Track business objectives</p>
                  </div>
                </div>
              </motion.div>

              {/* Customer Records Card */}
              <motion.div 
                className="rounded-xl p-4 sm:p-6 border relative overflow-hidden cursor-pointer" 
                style={{ background: 'var(--card-bg)', borderColor: 'var(--card-border)' }}
                onClick={() => navigate('/customers')}
                whileHover={{ 
                  scale: 1.03,
                  y: -3,
                  boxShadow: "0 10px 25px rgba(219, 39, 119, 0.2)"
                }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="flex items-center gap-3">
                  <motion.div
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 0.5 }}
                  >
                    <FaUsers className="text-xl sm:text-2xl text-pink-400" />
                  </motion.div>
                  <div>
                    <h3 className="font-semibold text-sm sm:text-base">Customers</h3>
                    <p className="text-xs sm:text-sm text-[var(--text-secondary)]">Manage customer records</p>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>

          {/* Field Guide Section */}
          <div id="field-guide" className="mb-8">
            <div className="flex items-center gap-3 mb-6">
              <FaGraduationCap className="text-xl sm:text-2xl text-purple-400" />
              <h2 className="text-lg sm:text-xl font-semibold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                Field Guide & Data Requirements
              </h2>
            </div>
            
            <p className="mb-6 text-sm sm:text-base text-[var(--text-primary)]">
              Understanding what data to collect is crucial for business success. Here's a comprehensive guide to all the fields you can track in your business dashboard.
            </p>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {categories.map(category => (
                <motion.div 
                  key={category}
                  className="rounded-xl p-4 sm:p-6 border relative overflow-hidden"
                  style={{ background: 'var(--card-bg)', borderColor: 'var(--card-border)' }}
                  whileHover={{ 
                    scale: 1.02,
                    boxShadow: "0 10px 20px rgba(0,0,0,0.1)"
                  }}
                >
                  <h3 className="font-semibold mb-4 flex items-center gap-2 text-sm sm:text-base">
                    <FaInfoCircle className="text-purple-400" />
                    {category}
                  </h3>
                  <div className="space-y-4">
                    {fieldExplanations
                      .filter(field => field.category === category)
                      .map(field => (
                        <motion.div 
                          key={field.field} 
                          className="p-3 rounded-lg bg-[var(--secondary-bg)] border border-[var(--border)]"
                          whileHover={{ 
                            scale: 1.01,
                            y: -2,
                            boxShadow: "0 8px 25px rgba(0,0,0,0.1)"
                          }}
                          transition={{ type: "spring", stiffness: 300 }}
                        >
                          <div className="flex items-start gap-3">
                            <motion.div
                              whileHover={{ scale: 1.2 }}
                              transition={{ duration: 0.3 }}
                            >
                              {field.icon}
                            </motion.div>
                            <div>
                              <div className="flex items-center gap-2 mb-1">
                                <h4 className="font-medium text-sm sm:text-base">{field.title}</h4>
                                {field.required && (
                                  <span className="bg-red-900/20 text-red-300 text-xs px-2 py-1 rounded-full">
                                    Required
                                  </span>
                                )}
                              </div>
                              <p className="text-xs sm:text-sm text-[var(--text-secondary)] mb-1">
                                {field.description}
                              </p>
                              <p className="text-xs text-[var(--text-secondary)] italic">
                                {field.example}
                              </p>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                  </div>
                </motion.div>
              ))}
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
            onClick={() => navigate('/business-data')}
            className="w-14 h-14 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full shadow-lg flex items-center justify-center text-white relative overflow-hidden"
            whileHover={{ 
              scale: 1.1,
              boxShadow: "0 10px 30px rgba(0,0,0,0.3)"
            }}
            whileTap={{ scale: 0.9 }}
          >
            <FaDatabase className="text-xl" />
          </motion.button>
        </motion.div>
      </motion.div>
    </div>
  );
}

export default Dashboard;