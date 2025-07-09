import { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import AuthContext from '../context/AuthContext';
import { db } from '../firebase/firebase';
import {
  collection,
  addDoc,
  getDocs,
  query,
  orderBy,
  deleteDoc,
  doc
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
  FaLightbulb, 
  FaChartLine, 
  FaStar, 
  FaBoxOpen, 
  FaExclamationTriangle, 
  FaCheckCircle, 
  FaChartPie,
  FaRocket,
  FaBrain,
  FaMagic,
  FaUsers,
  FaDatabase,
  FaArrowRight,
  FaSignOutAlt,
  FaPlus,
  FaUndo,
  FaWarehouse,
  FaBullhorn,
  FaDollarSign,
  FaTag,
  FaInfoCircle,
  FaMapMarkerAlt,
  FaPercent,
  FaShoppingCart,
  FaChartBar,
  FaGraduationCap,
  FaCalculator,
  FaBullseye
} from 'react-icons/fa';
import { reAuthAndDeleteUser } from '../utils/reAuthAndDeleteUser';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#845EC2'];

// Helper function to format numbers with commas
const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-NG', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(amount);
};

function BusinessData() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [entries, setEntries] = useState([]);
  const [error, setError] = useState('');

  const [products, setProducts] = useState([
    { productName: '', price: '', sales: '', expenses: '', marketingSpend: '', unitsReturned: '', stockLeft: '', category: '', rating: '', region: '', discount: '' }
  ]);

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
      }
    };
    fetchData();
  }, [user]);

  const handleProductChange = (index, field, value) => {
    const newProducts = [...products];
    newProducts[index][field] = value;
    setProducts(newProducts);
  };

  const addProductField = () => {
    setProducts([...products, {
      productName: '', price: '', sales: '', expenses: '', marketingSpend: '', unitsReturned: '', stockLeft: '', category: '', rating: '', region: '', discount: ''
    }]);
  };

  const clearAllData = async () => {
    if (window.confirm('Clear all business data?')) {
      try {
        const q = query(collection(db, `businessData/${user.uid}/entries`));
        const snapshot = await getDocs(q);
        for (let docSnap of snapshot.docs) {
          await deleteDoc(doc(db, `businessData/${user.uid}/entries/${docSnap.id}`));
        }
        setEntries([]);
      } catch (err) {
        console.error('Error clearing data:', err);
        setError('Failed to clear data. Try again.');
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      for (let product of products) {
        if (!product.productName || !product.price || !product.sales) continue; // skip incomplete required entries
        await addDoc(collection(db, `businessData/${user.uid}/entries`), {
          ...product,
          price: parseFloat(product.price),
          sales: parseInt(product.sales),
          expenses: product.expenses ? parseFloat(product.expenses) : 0,
          marketingSpend: product.marketingSpend ? parseFloat(product.marketingSpend) : 0,
          unitsReturned: product.unitsReturned ? parseInt(product.unitsReturned) : 0,
          stockLeft: product.stockLeft ? parseInt(product.stockLeft) : 0,
          rating: product.rating ? parseFloat(product.rating) : 0,
          discount: product.discount ? parseFloat(product.discount) : 0,
          date: new Date().toISOString()
        });
      }
      setProducts([{ productName: '', price: '', sales: '', expenses: '', marketingSpend: '', unitsReturned: '', stockLeft: '', category: '', rating: '', region: '', discount: '' }]);
      const q = query(collection(db, `businessData/${user.uid}/entries`), orderBy('date', 'desc'));
      const snapshot = await getDocs(q);
      setEntries(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    } catch (err) {
      console.error(err);
      setError('Submission failed');
    }
  };

  const getInsights = () => {
    if (entries.length === 0) return [];
    const totalRevenue = entries.reduce((acc, e) => acc + (e.price * e.sales), 0);
    const totalMarketing = entries.reduce((acc, e) => acc + (e.marketingSpend || 0), 0);
    const avgRating = (entries.reduce((a, e) => a + (e.rating || 0), 0) / entries.length).toFixed(1);
    const topProduct = entries.reduce((top, current) => current.sales > top.sales ? current : top, entries[0]);
    const topCategory = [...new Set(entries.map(e => e.category))][0];
    const lowSatisfaction = entries.filter(e => e.unitsReturned > 0.2 * e.sales);

    return [
      {
        icon: <FaLightbulb className="text-yellow-400" />,
        text: `${user.displayName?.split(' ')[0]}, your total revenue is ₦${formatCurrency(totalRevenue)}.`,
        type: 'insight'
      },
      totalMarketing > 0 ? {
        icon: <FaChartLine className="text-blue-400" />,
        text: `Your marketing ROI is ${(totalRevenue / totalMarketing).toFixed(2)}.`,
        type: 'metric'
      } : null,
      {
        icon: <FaStar className="text-yellow-400" />,
        text: `Your average customer rating is ${avgRating}.`,
        type: 'rating'
      },
      {
        icon: <FaBoxOpen className="text-green-400" />,
        text: `Top selling product: ${topProduct.productName} (${topProduct.sales} units).`,
        type: 'product'
      },
      lowSatisfaction.length > 0 ? {
        icon: <FaExclamationTriangle className="text-red-400" />,
        text: `High return rate detected for some products. Consider reviewing quality.`,
        type: 'warning'
      } : {
        icon: <FaCheckCircle className="text-green-400" />,
        text: `No major return issues detected.`,
        type: 'success'
      },
      topCategory ? {
        icon: <FaChartPie className="text-purple-400" />,
        text: `Consider focusing more on the '${topCategory}' category for higher sales.`,
        type: 'strategy'
      } : null
    ].filter(Boolean);
  };

  const handleLogout = async () => {
    if (typeof logout === 'function') await logout();
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
          </div>
          {user && (
            <div className="flex gap-4 items-center ml-4">
              <button onClick={handleLogout} className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 flex items-center gap-2 text-sm sm:text-base">
                <FaSignOutAlt /> <span className="hidden sm:inline">Logout</span>
              </button>
            </div>
          )}
        </motion.nav>

        {/* Header / Welcome Section */}
        <motion.div 
          className="max-w-6xl mx-auto rounded-xl p-4 sm:p-6 mb-8 border relative overflow-hidden"
          style={{ background: 'var(--card-bg)', borderColor: 'var(--card-border)' }}
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.6 }}
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
                <FaDatabase className="text-2xl sm:text-3xl text-green-400" />
              </motion.div>
              <motion.h1 
                className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-green-400 via-blue-400 to-purple-400 bg-clip-text text-transparent"
                whileHover={{ scale: 1.05 }}
              >
                Business Data Entry & Analytics
              </motion.h1>
            </div>
            <motion.p 
              className="text-[var(--text-primary)] mb-4 text-sm sm:text-base"
              whileHover={{ color: "var(--accent)" }}
            >
              Enter your business data below to unlock powerful analytics and AI-driven insights. Track your products, sales, and performance in Naira with ease!
            </motion.p>
            <motion.button 
              onClick={() => navigate('/dashboard')} 
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center justify-center gap-2 text-sm sm:text-base"
              whileHover={{ 
                scale: 1.05, 
                y: -3,
                boxShadow: "0 10px 25px rgba(59, 130, 246, 0.3)"
              }}
              whileTap={{ scale: 0.95 }}
            >
              <FaBoxOpen /> 
              <span>Go to Dashboard</span>
            </motion.button>
          </div>
        </motion.div>

        {/* Business Data Form Card */}
        <motion.div 
          className="max-w-6xl mx-auto bg-[var(--secondary-bg)] rounded-xl shadow p-4 sm:p-6 mb-8 border border-[var(--border)]"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.5 }}
        >
          <div className="flex items-center gap-3 mb-6">
            <FaPlus className="text-xl sm:text-2xl text-blue-400" />
            <h2 className="text-lg sm:text-xl font-semibold bg-gradient-to-r from-blue-400 to-green-500 bg-clip-text text-transparent">Add Product Data</h2>
          </div>
          {error && <p className="text-red-400 mb-4">{error}</p>}
          <form onSubmit={handleSubmit} className="space-y-6">
            {products.map((product, index) => (
              <div key={index} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4">
                {Object.entries(product).map(([key, value]) => (
                  <motion.div 
                    key={key}
                    whileHover={{ scale: 1.02 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <motion.label 
                      className="block text-xs sm:text-sm mb-1 capitalize text-[var(--text-primary)] flex items-center gap-1"
                      whileHover={{ color: "var(--accent)" }}
                    >
                      <motion.div
                        whileHover={{ rotate: 360, scale: 1.2 }}
                        transition={{ duration: 0.5 }}
                      >
                        {key === 'productName' && <FaTag className="text-blue-400" />} 
                        {key === 'price' && <FaDollarSign className="text-green-400" />} 
                        {key === 'sales' && <FaShoppingCart className="text-purple-400" />} 
                        {key === 'expenses' && <FaChartBar className="text-red-400" />} 
                        {key === 'marketingSpend' && <FaBullhorn className="text-orange-400" />} 
                        {key === 'unitsReturned' && <FaUndo className="text-red-300" />} 
                        {key === 'stockLeft' && <FaWarehouse className="text-gray-400" />} 
                        {key === 'category' && <FaInfoCircle className="text-indigo-400" />} 
                        {key === 'rating' && <FaStar className="text-yellow-400" />} 
                        {key === 'region' && <FaMapMarkerAlt className="text-pink-400" />} 
                        {key === 'discount' && <FaPercent className="text-teal-400" />} 
                      </motion.div>
                      <span className="hidden sm:inline">
                        {key === 'price' ? 'Price (₦)' :
                         key === 'expenses' ? 'Expenses (₦)' :
                         key === 'marketingSpend' ? 'Marketing Spend (₦)' :
                         key.replace(/([A-Z])/g, ' $1')}
                      </span>
                      <span className="sm:hidden">
                        {key === 'price' ? 'Price (₦)' :
                         key === 'expenses' ? 'Expenses (₦)' :
                         key === 'marketingSpend' ? 'Marketing (₦)' :
                         key.replace(/([A-Z])/g, ' $1').split(' ')[0]}
                      </span>
                    </motion.label>
                    <motion.input
                      type="text"
                      value={value}
                      onChange={(e) => handleProductChange(index, key, e.target.value)}
                      className="w-full p-2 rounded bg-[var(--secondary-bg)] text-[var(--text-primary)] border border-[var(--border)] focus:ring-2 focus:ring-[var(--accent)] text-sm"
                      placeholder={
                        key === 'price' ? 'e.g., ₦29,999' :
                        key === 'expenses' ? 'e.g., ₦15,000' :
                        key === 'marketingSpend' ? 'e.g., ₦200,000' :
                        key === 'productName' ? 'e.g., Premium Coffee Blend' :
                        key === 'sales' ? 'e.g., 50 units' :
                        key === 'unitsReturned' ? 'e.g., 2 returns' :
                        key === 'stockLeft' ? 'e.g., 25 units' :
                        key === 'category' ? 'e.g., Electronics' :
                        key === 'rating' ? 'e.g., 4.5 out of 5' :
                        key === 'region' ? 'e.g., Lagos' :
                        key === 'discount' ? 'e.g., 10% off' : ''
                      }
                      required={['productName', 'price', 'sales'].includes(key)}
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
                ))}
              </div>
            ))}
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
              <motion.button 
                type="button" 
                onClick={addProductField} 
                className="bg-blue-600 text-white px-3 py-2 rounded hover:bg-blue-700 flex items-center justify-center gap-2 text-sm sm:text-base"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <FaPlus /> <span className="hidden sm:inline">Add Another Product</span>
                <span className="sm:hidden">Add Product</span>
              </motion.button>
              <motion.button 
                type="submit" 
                className="bg-[var(--accent)] text-white px-4 py-2 rounded flex-1 text-sm sm:text-base"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Submit All
              </motion.button>
              <motion.button 
                type="button" 
                onClick={clearAllData} 
                className="bg-red-600 text-white px-3 py-2 rounded hover:bg-red-700 flex items-center justify-center gap-2 text-sm sm:text-base"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <FaUndo /> <span className="hidden sm:inline">Clear All</span>
                <span className="sm:hidden">Clear</span>
              </motion.button>
            </div>
          </form>
        </motion.div>

        {/* AI Insights Section */}
        <motion.div 
          className="max-w-6xl mx-auto my-8"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.5 }}
        >
          <div className="flex items-center gap-3 mb-4">
            <FaBrain className="text-xl sm:text-2xl text-purple-400" />
            <h2 className="text-lg sm:text-xl font-semibold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">AI Business Insights</h2>
            <FaMagic className="text-base sm:text-lg text-blue-400" />
          </div>
          <div className="space-y-3">
            {getInsights().map((insight, idx) => (
              <motion.div 
                key={idx} 
                className={`flex items-start gap-3 p-4 rounded-lg border-l-4 ${
                  insight.type === 'warning' ? 'bg-red-900/20 border-red-400' :
                  insight.type === 'success' ? 'bg-green-900/20 border-green-400' :
                  insight.type === 'insight' ? 'bg-yellow-900/20 border-yellow-400' :
                  insight.type === 'metric' ? 'bg-blue-900/20 border-blue-400' :
                  insight.type === 'rating' ? 'bg-yellow-900/20 border-yellow-400' :
                  insight.type === 'product' ? 'bg-green-900/20 border-green-400' :
                  'bg-purple-900/20 border-purple-400'
                }`}
                whileHover={{ 
                  scale: 1.02,
                  y: -2
                }}
              >
                <div className="flex-shrink-0 mt-1">
                  {insight.icon}
                </div>
                <div className="flex-1">
                  <p className="text-[var(--text-primary)] font-medium">{insight.text}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Charts Section */}
        <motion.div 
          className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 my-8"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.5 }}
        >
          {/* Sales by Product Chart */}
          <motion.div 
            className="bg-[var(--secondary-bg)] rounded-xl shadow p-4 sm:p-6 border border-[var(--border)]"
            whileHover={{ scale: 1.02 }}
          >
            <h3 className="text-base sm:text-lg font-semibold mb-2 flex items-center gap-2">
              <FaChartLine className="text-blue-400" /> 
              <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">Sales by Product</span>
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={entries}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="productName" stroke="var(--text-primary)" />
                <YAxis stroke="var(--text-primary)" />
                <Tooltip 
                  contentStyle={{ 
                    background: 'var(--secondary-bg)',
                    borderColor: 'var(--border)',
                    color: 'var(--text-primary)'
                  }}
                />
                <Bar dataKey="sales" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </motion.div>

          {/* Category Distribution Chart */}
          <motion.div 
            className="bg-[var(--secondary-bg)] rounded-xl shadow p-4 sm:p-6 border border-[var(--border)]"
            whileHover={{ scale: 1.02 }}
          >
            <h3 className="text-base sm:text-lg font-semibold mb-2 flex items-center gap-2">
              <FaChartPie className="text-green-400" /> 
              <span className="bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent">Category Distribution</span>
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie 
                  data={entries} 
                  dataKey="sales" 
                  nameKey="category" 
                  cx="50%" 
                  cy="50%" 
                  outerRadius={80}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {entries.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ 
                    background: 'var(--secondary-bg)',
                    borderColor: 'var(--border)',
                    color: 'var(--text-primary)'
                  }}
                />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </motion.div>
        </motion.div>

        {/* Floating Action Button */}
        <motion.div
          className="fixed bottom-6 right-6 z-50"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 1, duration: 0.5 }}
        >
          <motion.button
            onClick={() => navigate('/dashboard')}
            className="w-14 h-14 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full shadow-lg flex items-center justify-center text-white relative overflow-hidden"
            whileHover={{ 
              scale: 1.1,
              boxShadow: "0 10px 30px rgba(0,0,0,0.3)"
            }}
            whileTap={{ scale: 0.9 }}
          >
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-500 opacity-0"
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
              <FaBoxOpen className="text-xl" />
            </motion.div>
          </motion.button>
        </motion.div>
      </motion.div>
    </div>
  );
}

export default BusinessData;