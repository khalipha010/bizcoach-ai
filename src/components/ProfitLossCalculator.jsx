// 💰 PROFIT/LOSS CALCULATOR - DARK MODE ONLY WITH GRADIENT CARDS
import { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import AuthContext from '../context/AuthContext';
import { db } from '../firebase/firebase';
import {
  collection,
  getDocs,
  query,
  orderBy
} from 'firebase/firestore';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
  Legend
} from 'recharts';
import { 
  FaCalculator, 
  FaChartLine, 
  FaDollarSign, 
  FaArrowUp, 
  FaArrowDown,
  FaBoxOpen,
  FaDatabase,
  FaArrowRight,
  FaSignOutAlt,
  FaPlus,
  FaMinus,
  FaEquals,
  FaLightbulb,
  FaExclamationTriangle,
  FaCheckCircle,
  FaChartBar,
  FaChartPie,
  FaRocket,
  FaBrain,
  FaMagic,
  FaUsers,
  FaGraduationCap,
  FaBullhorn,
  FaShoppingCart,
  FaUndo,
  FaWarehouse,
  FaTag,
  FaInfoCircle,
  FaMapMarkerAlt,
  FaPercent,
  FaStar,
  FaBullseye
} from 'react-icons/fa';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#845EC2'];

// Helper function to format numbers with commas
const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-NG', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(amount);
};

function ProfitLossCalculator() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const q = query(collection(db, `businessData/${user.uid}/entries`), orderBy('date', 'desc'));
        const querySnapshot = await getDocs(q);
        const data = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setEntries(data);
      } catch (err) {
        console.error(err);
        setError('Could not fetch data');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [user]);

  const calculateProfitLoss = () => {
    if (entries.length === 0) return null;

    const totalRevenue = entries.reduce((acc, e) => acc + (e.price * e.sales), 0);
    const totalExpenses = entries.reduce((acc, e) => acc + (e.expenses || 0) * e.sales, 0);
    const totalMarketing = entries.reduce((acc, e) => acc + (e.marketingSpend || 0), 0);
    const totalCosts = totalExpenses + totalMarketing;
    const netProfit = totalRevenue - totalCosts;
    const profitMargin = totalRevenue > 0 ? (netProfit / totalRevenue) * 100 : 0;
    const isProfitable = netProfit > 0;

    return {
      totalRevenue,
      totalExpenses,
      totalMarketing,
      totalCosts,
      netProfit,
      profitMargin,
      isProfitable
    };
  };

  const getProfitInsights = (data) => {
    if (!data) return [];
    
    const insights = [];
    
    if (data.isProfitable) {
      insights.push({
        icon: <FaArrowUp className="text-green-400" />,
        text: `Great! Your business is profitable with a net profit of ₦${formatCurrency(data.netProfit)}.`,
        type: 'success',
        color: 'green'
      });
    } else {
      insights.push({
        icon: <FaArrowDown className="text-red-400" />,
        text: `Your business is currently operating at a loss of ₦${formatCurrency(Math.abs(data.netProfit))}.`,
        type: 'warning',
        color: 'red'
      });
    }

    if (data.profitMargin > 20) {
      insights.push({
        icon: <FaCheckCircle className="text-green-400" />,
        text: `Excellent profit margin of ${data.profitMargin.toFixed(1)}%!`,
        type: 'success',
        color: 'green'
      });
    } else if (data.profitMargin > 10) {
      insights.push({
        icon: <FaLightbulb className="text-yellow-400" />,
        text: `Good profit margin of ${data.profitMargin.toFixed(1)}%. Consider optimizing costs.`,
        type: 'info',
        color: 'yellow'
      });
    } else if (data.profitMargin > 0) {
      insights.push({
        icon: <FaExclamationTriangle className="text-orange-400" />,
        text: `Low profit margin of ${data.profitMargin.toFixed(1)}%. Focus on increasing revenue or reducing costs.`,
        type: 'warning',
        color: 'orange'
      });
    }

    if (data.totalMarketing > data.totalRevenue * 0.3) {
      insights.push({
        icon: <FaBullhorn className="text-blue-400" />,
        text: `Marketing spend is ${((data.totalMarketing / data.totalRevenue) * 100).toFixed(1)}% of revenue. Consider optimizing marketing ROI.`,
        type: 'info',
        color: 'blue'
      });
    }

    return insights;
  };

  const getChartData = () => {
    if (entries.length === 0) return [];
    
    return entries.map(entry => ({
      product: entry.productName,
      revenue: entry.price * entry.sales,
      expenses: (entry.expenses || 0) * entry.sales,
      profit: (entry.price * entry.sales) - ((entry.expenses || 0) * entry.sales)
    }));
  };

  const getPieData = (data) => {
    if (!data) return [];
    
    return [
      { name: 'Net Profit', value: Math.max(0, data.netProfit), color: '#10B981' },
      { name: 'Total Costs', value: data.totalCosts, color: '#EF4444' }
    ].filter(item => item.value > 0);
  };

  const handleLogout = async () => {
    if (typeof logout === 'function') await logout();
  };

  const profitData = calculateProfitLoss();
  const insights = getProfitInsights(profitData);
  const chartData = getChartData();
  const pieData = getPieData(profitData);

  if (loading) {
    return (
      <motion.div 
        className="p-4 min-h-screen bg-[var(--primary-bg)] text-[var(--text-primary)] flex items-center justify-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400"></div>
      </motion.div>
    );
  }

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
          </div>
          {user && (
            <div className="flex gap-4 items-center ml-4">
              <button onClick={handleLogout} className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 flex items-center gap-2 text-sm sm:text-base">
                <FaSignOutAlt /> <span className="hidden sm:inline">Logout</span>
              </button>
            </div>
          )}
        </motion.nav>

        {/* Header Section */}
        <motion.div 
          className="max-w-6xl mx-auto bg-gradient-to-br from-purple-900/30 to-indigo-900/30 rounded-xl shadow p-4 sm:p-6 mb-8 border border-[var(--card-border)] relative overflow-hidden"
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          whileHover={{ 
            scale: 1.01,
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
                <FaCalculator className="text-2xl sm:text-3xl text-purple-400 flex-shrink-0" />
              </motion.div>
              <motion.h1 
                className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-indigo-400 bg-clip-text text-transparent"
                whileHover={{ scale: 1.05 }}
              >
                Profit & Loss Calculator
              </motion.h1>
            </div>
            <motion.p 
              className="text-[var(--text-primary)] mb-4 text-sm sm:text-base"
              whileHover={{ color: "var(--accent)" }}
            >
              Analyze your business profitability with detailed breakdowns and AI-powered insights. All calculations are based on your business data in Nigerian Naira (₦).
            </motion.p>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
              <motion.button 
                onClick={() => navigate('/business-data')} 
                className="bg-gradient-to-r from-green-600 to-emerald-600 text-white px-4 py-2 rounded-lg hover:from-green-700 hover:to-emerald-700 flex items-center justify-center gap-2 text-sm sm:text-base relative overflow-hidden"
                whileHover={{ 
                  scale: 1.05, 
                  y: -3,
                  boxShadow: "0 10px 25px rgba(34, 197, 94, 0.3)"
                }}
                whileTap={{ scale: 0.95 }}
              >
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-green-400 to-emerald-500 opacity-0"
                  whileHover={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                />
                <span className="relative z-10 flex items-center gap-2">
                  <motion.div
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 0.5 }}
                  >
                    <FaDatabase />
                  </motion.div>
                  Add More Data
                </span>
              </motion.button>
              <motion.button 
                onClick={() => navigate('/dashboard')} 
                className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-4 py-2 rounded-lg hover:from-blue-700 hover:to-indigo-700 flex items-center justify-center gap-2 text-sm sm:text-base relative overflow-hidden"
                whileHover={{ 
                  scale: 1.05, 
                  y: -3,
                  boxShadow: "0 10px 25px rgba(59, 130, 246, 0.3)"
                }}
                whileTap={{ scale: 0.95 }}
              >
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-blue-400 to-indigo-500 opacity-0"
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
                  Back to Dashboard
                </span>
              </motion.button>
            </div>
          </div>
        </motion.div>

        {error && (
          <motion.div 
            className="max-w-6xl mx-auto mb-8 bg-red-900/20 border border-red-700 text-red-300 px-4 py-3 rounded-lg"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            {error}
          </motion.div>
        )}

        {entries.length === 0 ? (
          <motion.div 
            className="max-w-6xl mx-auto bg-[var(--card-bg)] text-[var(--text-primary)] rounded-xl shadow p-8 border border-[var(--border)] text-center"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.5 }}
          >
            <motion.div
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
              className="text-6xl text-gray-400 mb-4"
            >
              📊
            </motion.div>
            <h2 className="text-xl font-semibold mb-4 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              No Business Data Available
            </h2>
            <p className="text-[var(--text-secondary)] mb-6">
              Add some business data first to see your profit and loss calculations.
            </p>
            <motion.button 
              onClick={() => navigate('/business-data')} 
              className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-lg hover:from-purple-700 hover:to-pink-700 flex items-center justify-center gap-2 mx-auto"
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
            >
              <FaDatabase />
              Add Business Data
            </motion.button>
          </motion.div>
        ) : (
          <>
            {/* Profit/Loss Summary Cards */}
            <motion.div 
              className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.5 }}
            >
              {/* Total Revenue Card */}
              <motion.div 
                className="bg-gradient-to-br from-emerald-500 to-green-600 text-white p-4 sm:p-6 rounded-xl shadow-lg relative overflow-hidden"
                whileHover={{ 
                  scale: 1.05,
                  y: -5,
                  boxShadow: "0 15px 35px rgba(34, 197, 94, 0.3)"
                }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <motion.div
                  className="absolute inset-0 bg-gradient-to-br from-emerald-400 to-green-500 opacity-0"
                  whileHover={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                />
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-2">
                    <motion.div
                      whileHover={{ rotate: 360, scale: 1.2 }}
                      transition={{ duration: 0.5 }}
                    >
                      <FaArrowUp className="text-2xl" />
                    </motion.div>
                    <span className="text-sm opacity-90">Total Revenue</span>
                  </div>
                  <div className="text-2xl sm:text-3xl font-bold">
                    ₦{formatCurrency(profitData.totalRevenue)}
                  </div>
                </div>
              </motion.div>

              {/* Total Costs Card */}
              <motion.div 
                className="bg-gradient-to-br from-red-500 to-pink-600 text-white p-4 sm:p-6 rounded-xl shadow-lg relative overflow-hidden"
                whileHover={{ 
                  scale: 1.05,
                  y: -5,
                  boxShadow: "0 15px 35px rgba(239, 68, 68, 0.3)"
                }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <motion.div
                  className="absolute inset-0 bg-gradient-to-br from-red-400 to-pink-500 opacity-0"
                  whileHover={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                />
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-2">
                    <motion.div
                      whileHover={{ rotate: 360, scale: 1.2 }}
                      transition={{ duration: 0.5 }}
                    >
                      <FaArrowDown className="text-2xl" />
                    </motion.div>
                    <span className="text-sm opacity-90">Total Costs</span>
                  </div>
                  <div className="text-2xl sm:text-3xl font-bold">
                    ₦{formatCurrency(profitData.totalCosts)}
                  </div>
                </div>
              </motion.div>

              {/* Net Profit/Loss Card */}
              <motion.div 
                className={`text-white p-4 sm:p-6 rounded-xl shadow-lg relative overflow-hidden ${
                  profitData.isProfitable 
                    ? 'bg-gradient-to-br from-teal-500 to-emerald-600' 
                    : 'bg-gradient-to-br from-rose-500 to-pink-600'
                }`}
                whileHover={{ 
                  scale: 1.05,
                  y: -5,
                  boxShadow: profitData.isProfitable 
                    ? "0 15px 35px rgba(20, 184, 166, 0.3)"
                    : "0 15px 35px rgba(244, 63, 94, 0.3)"
                }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <motion.div
                  className={`absolute inset-0 opacity-0 ${
                    profitData.isProfitable 
                      ? 'bg-gradient-to-br from-teal-400 to-emerald-500' 
                      : 'bg-gradient-to-br from-rose-400 to-pink-500'
                  }`}
                  whileHover={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                />
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-2">
                    <motion.div
                      whileHover={{ rotate: 360, scale: 1.2 }}
                      transition={{ duration: 0.5 }}
                    >
                      {profitData.isProfitable ? (
                        <FaArrowUp className="text-2xl" />
                      ) : (
                        <FaArrowDown className="text-2xl" />
                      )}
                    </motion.div>
                    <span className="text-sm opacity-90">Net Profit/Loss</span>
                  </div>
                  <div className="text-2xl sm:text-3xl font-bold">
                    ₦{formatCurrency(profitData.netProfit)}
                  </div>
                </div>
              </motion.div>

              {/* Profit Margin Card */}
              <motion.div 
                className={`text-white p-4 sm:p-6 rounded-xl shadow-lg relative overflow-hidden ${
                  profitData.profitMargin > 10 
                    ? 'bg-gradient-to-br from-blue-500 to-indigo-600' 
                    : profitData.profitMargin > 0
                    ? 'bg-gradient-to-br from-amber-500 to-orange-600'
                    : 'bg-gradient-to-br from-red-500 to-rose-600'
                }`}
                whileHover={{ 
                  scale: 1.05,
                  y: -5,
                  boxShadow: "0 15px 35px rgba(59, 130, 246, 0.3)"
                }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <motion.div
                  className={`absolute inset-0 opacity-0 ${
                    profitData.profitMargin > 10 
                      ? 'bg-gradient-to-br from-blue-400 to-indigo-500' 
                      : profitData.profitMargin > 0
                      ? 'bg-gradient-to-br from-amber-400 to-orange-500'
                      : 'bg-gradient-to-br from-red-400 to-rose-500'
                  }`}
                  whileHover={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                />
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-2">
                    <motion.div
                      whileHover={{ rotate: 360, scale: 1.2 }}
                      transition={{ duration: 0.5 }}
                    >
                      <FaPercent className="text-2xl" />
                    </motion.div>
                    <span className="text-sm opacity-90">Profit Margin</span>
                  </div>
                  <div className="text-2xl sm:text-3xl font-bold">
                    {profitData.profitMargin.toFixed(1)}%
                  </div>
                </div>
              </motion.div>
            </motion.div>

            {/* AI Insights Section */}
            <motion.div 
              className="max-w-6xl mx-auto mb-8"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.5 }}
            >
              <div className="flex items-center gap-3 mb-4">
                <FaBrain className="text-xl sm:text-2xl text-purple-400" />
                <h2 className="text-lg sm:text-xl font-semibold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">AI Profitability Insights</h2>
                <FaMagic className="text-base sm:text-lg text-blue-400" />
              </div>
              <div className="space-y-3">
                {insights.map((insight, idx) => (
                  <motion.div 
                    key={idx} 
                    className={`flex items-start gap-3 p-4 rounded-lg border-l-4 transition-all duration-200 hover:shadow-md ${
                      insight.type === 'warning' ? 'bg-red-900/30 border-red-700' :
                      insight.type === 'success' ? 'bg-green-900/30 border-green-700' :
                      insight.type === 'info' ? 'bg-blue-900/30 border-blue-700' :
                      'bg-purple-900/30 border-purple-700'
                    }`}
                    whileHover={{ scale: 1.02, y: -2 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <div className="flex-shrink-0 mt-1">
                      {insight.icon}
                    </div>
                    <div className="flex-1">
                      <p className="text-gray-200 font-medium">{insight.text}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Charts Section */}
            <motion.div 
              className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 mb-8"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.5 }}
            >
              <div className="bg-[var(--card-bg)] text-[var(--text-primary)] rounded-xl shadow p-4 sm:p-6 border border-[var(--border)]">
                <h3 className="text-base sm:text-lg font-semibold mb-4 flex items-center gap-2">
                  <FaChartBar /> 
                  <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                    Product Profitability
                  </span>
                </h3>
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#4B5563" />
                    <XAxis dataKey="product" stroke="#9CA3AF" />
                    <YAxis stroke="#9CA3AF" />
                    <Tooltip 
                      formatter={(value) => `₦${formatCurrency(value)}`}
                      contentStyle={{
                        backgroundColor: '#1F2937',
                        borderColor: '#4B5563',
                        borderRadius: '0.5rem',
                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                        color: '#F3F4F6'
                      }}
                    />
                    <Bar dataKey="revenue" fill="#10B981" name="Revenue" />
                    <Bar dataKey="expenses" fill="#EF4444" name="Expenses" />
                    <Bar dataKey="profit" fill="#3B82F6" name="Profit" />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <div className="bg-[var(--card-bg)] text-[var(--text-primary)] rounded-xl shadow p-4 sm:p-6 border border-[var(--border)]">
                <h3 className="text-base sm:text-lg font-semibold mb-4 flex items-center gap-2">
                  <FaChartPie /> 
                  <span className="bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent">
                    Revenue vs Costs
                  </span>
                </h3>
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie 
                      data={pieData} 
                      dataKey="value" 
                      nameKey="name" 
                      cx="50%" 
                      cy="50%" 
                      outerRadius={80}
                      label={({ name, value }) => `${name}: ₦${formatCurrency(value)}`}
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip 
                      formatter={(value) => `₦${formatCurrency(value)}`}
                      contentStyle={{
                        backgroundColor: '#1F2937',
                        borderColor: '#4B5563',
                        borderRadius: '0.5rem',
                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                        color: '#F3F4F6'
                      }}
                    />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </motion.div>

            {/* Detailed Breakdown */}
            <motion.div 
              className="max-w-6xl mx-auto bg-[var(--card-bg)] text-[var(--text-primary)] rounded-xl shadow p-4 sm:p-6 border border-[var(--border)]"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.7, duration: 0.5 }}
            >
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <FaCalculator /> 
                <span className="bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
                  Detailed Breakdown
                </span>
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="bg-gradient-to-br from-green-900/30 to-emerald-900/30 rounded-lg p-4 border border-green-700">
                  <h4 className="font-semibold text-green-300 mb-2">Revenue Breakdown</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-[var(--text-secondary)]">Total Revenue:</span>
                      <span className="font-bold text-gray-200">₦{formatCurrency(profitData.totalRevenue)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[var(--text-secondary)]">Products/Services:</span>
                      <span className="font-bold text-gray-200">{entries.length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[var(--text-secondary)]">Avg. Price:</span>
                      <span className="font-bold text-gray-200">₦{formatCurrency(profitData.totalRevenue / entries.reduce((acc, e) => acc + e.sales, 0))}</span>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-red-900/30 to-rose-900/30 rounded-lg p-4 border border-red-700">
                  <h4 className="font-semibold text-red-300 mb-2">Cost Breakdown</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-[var(--text-secondary)]">Production Costs:</span>
                      <span className="font-bold text-gray-200">₦{formatCurrency(profitData.totalExpenses)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[var(--text-secondary)]">Marketing:</span>
                      <span className="font-bold text-gray-200">₦{formatCurrency(profitData.totalMarketing)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[var(--text-secondary)]">Total Costs:</span>
                      <span className="font-bold text-gray-200">₦{formatCurrency(profitData.totalCosts)}</span>
                    </div>
                  </div>
                </div>

                <div className={`rounded-lg p-4 border ${
                  profitData.isProfitable 
                    ? 'bg-gradient-to-br from-green-900/30 to-emerald-900/30 border-green-700' 
                    : 'bg-gradient-to-br from-red-900/30 to-rose-900/30 border-red-700'
                }`}>
                  <h4 className={`font-semibold mb-2 ${
                    profitData.isProfitable 
                      ? 'text-green-300' 
                      : 'text-red-300'
                  }`}>
                    Profitability Summary
                  </h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-[var(--text-secondary)]">Net Profit/Loss:</span>
                      <span className={`font-semibold ${
                        profitData.isProfitable ? 'text-green-400' : 'text-red-400'
                      }`}>
                        ₦{formatCurrency(profitData.netProfit)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[var(--text-secondary)]">Profit Margin:</span>
                      <span className={`font-semibold ${
                        profitData.profitMargin > 10 ? 'text-green-400' : 
                        profitData.profitMargin > 0 ? 'text-yellow-400' : 'text-red-400'
                      }`}>
                        {profitData.profitMargin.toFixed(1)}%
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[var(--text-secondary)]">Status:</span>
                      <span className={`font-semibold ${
                        profitData.isProfitable ? 'text-green-400' : 'text-red-400'
                      }`}>
                        {profitData.isProfitable ? 'Profitable' : 'Loss Making'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}

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
              <FaDatabase className="text-xl" />
            </motion.div>
          </motion.button>
        </motion.div>
      </motion.div>
    </div>
  );
}

export default ProfitLossCalculator;