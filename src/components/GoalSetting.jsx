// 🎯 GOAL SETTING & PROGRESS TRACKING WITH PREMIUM STYLING
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
  doc,
  updateDoc
} from 'firebase/firestore';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  Legend
} from 'recharts';
import { 
  FaBullseye, 
  FaChartLine, 
  FaTrophy, 
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
  FaMinus,
  FaEquals,
  FaLightbulb,
  FaChartBar,
  FaGraduationCap,
  FaBullhorn,
  FaShoppingCart,
  FaUndo,
  FaWarehouse,
  FaTag,
  FaInfoCircle,
  FaMapMarkerAlt,
  FaPercent,
  FaCalculator,
  FaCalendarAlt,
  FaFlag,
  FaMedal,
  FaCrown,
  FaFire,
  FaHeart,
  FaGift,
  FaAward,
  FaGem
} from 'react-icons/fa';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#845EC2'];

function GoalSetting() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [goals, setGoals] = useState([]);
  const [businessData, setBusinessData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showAddGoal, setShowAddGoal] = useState(false);
  const [newGoal, setNewGoal] = useState({
    title: '',
    type: 'revenue',
    target: '',
    deadline: '',
    description: '',
    priority: 'medium'
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch goals
        const goalsQuery = query(collection(db, `goals/${user.uid}/entries`), orderBy('createdAt', 'desc'));
        const goalsSnapshot = await getDocs(goalsQuery);
        const goalsData = goalsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setGoals(goalsData);

        // Fetch business data for progress calculation
        const businessQuery = query(collection(db, `businessData/${user.uid}/entries`), orderBy('date', 'desc'));
        const businessSnapshot = await getDocs(businessQuery);
        const businessData = businessSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setBusinessData(businessData);
      } catch (err) {
        console.error(err);
        setError('Could not fetch data');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [user]);

  const calculateProgress = (goal) => {
    if (!businessData.length) return 0;

    const now = new Date();
    const deadline = new Date(goal.deadline);
    const timeProgress = Math.max(0, Math.min(100, ((deadline - now) / (deadline - new Date(goal.createdAt))) * 100));

    let actualProgress = 0;
    const currentData = businessData.filter(entry => new Date(entry.date) >= new Date(goal.createdAt));

    switch (goal.type) {
      case 'revenue':
        const totalRevenue = currentData.reduce((acc, e) => acc + (e.price * e.sales), 0);
        actualProgress = goal.target > 0 ? Math.min(100, (totalRevenue / goal.target) * 100) : 0;
        break;
      case 'sales':
        const totalSales = currentData.reduce((acc, e) => acc + e.sales, 0);
        actualProgress = goal.target > 0 ? Math.min(100, (totalSales / goal.target) * 100) : 0;
        break;
      case 'customers':
        const uniqueCustomers = new Set(currentData.map(e => e.region)).size;
        actualProgress = goal.target > 0 ? Math.min(100, (uniqueCustomers / goal.target) * 100) : 0;
        break;
      case 'rating':
        const avgRating = currentData.reduce((acc, e) => acc + (e.rating || 0), 0) / currentData.length;
        actualProgress = goal.target > 0 ? Math.min(100, (avgRating / goal.target) * 100) : 0;
        break;
      default:
        actualProgress = 0;
    }

    return Math.round(actualProgress);
  };

  const getGoalStatus = (goal) => {
    const progress = calculateProgress(goal);
    const now = new Date();
    const deadline = new Date(goal.deadline);
    const isOverdue = now > deadline;

    if (progress >= 100) return 'completed';
    if (isOverdue) return 'overdue';
    if (progress >= 75) return 'on-track';
    if (progress >= 50) return 'in-progress';
    return 'at-risk';
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'text-[var(--accent)]';
      case 'overdue': return 'text-[var(--warning)]';
      case 'on-track': return 'text-[var(--info)]';
      case 'in-progress': return 'text-[var(--caution)]';
      case 'at-risk': return 'text-[var(--highlight)]';
      default: return 'text-[var(--text-secondary)]';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed': return <FaTrophy className="text-[var(--accent)]" />;
      case 'overdue': return <FaExclamationTriangle className="text-[var(--warning)]" />;
      case 'on-track': return <FaCheckCircle className="text-[var(--info)]" />;
      case 'in-progress': return <FaChartLine className="text-[var(--caution)]" />;
      case 'at-risk': return <FaExclamationTriangle className="text-[var(--highlight)]" />;
      default: return <FaBullseye className="text-[var(--text-secondary)]" />;
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'text-[var(--warning)]';
      case 'medium': return 'text-[var(--caution)]';
      case 'low': return 'text-[var(--accent)]';
      default: return 'text-[var(--text-secondary)]';
    }
  };

  const getAchievementBadge = (progress) => {
    if (progress >= 100) return { icon: <FaCrown className="text-[var(--caution)]" />, text: 'Goal Master', color: 'bg-[var(--badge-bg-caution)] text-[var(--badge-caution)]' };
    if (progress >= 90) return { icon: <FaGem className="text-[var(--purple)]" />, text: 'Almost There', color: 'bg-[var(--badge-bg-purple)] text-[var(--badge-purple)]' };
    if (progress >= 75) return { icon: <FaAward className="text-[var(--info)]" />, text: 'On Fire', color: 'bg-[var(--badge-bg-info)] text-[var(--badge-info)]' };
    if (progress >= 50) return { icon: <FaAward className="text-[var(--accent)]" />, text: 'Halfway Hero', color: 'bg-[var(--badge-bg-success)] text-[var(--badge-success)]' };
    if (progress >= 25) return { icon: <FaStar className="text-[var(--highlight)]" />, text: 'Getting Started', color: 'bg-[var(--badge-bg-highlight)] text-[var(--badge-highlight)]' };
    return { icon: <FaBullseye className="text-[var(--text-secondary)]" />, text: 'Just Beginning', color: 'bg-[var(--badge-bg-default)] text-[var(--badge-default)]' };
  };

  const handleAddGoal = async (e) => {
    e.preventDefault();
    try {
      const goalData = {
        ...newGoal,
        target: parseFloat(newGoal.target),
        createdAt: new Date().toISOString(),
        status: 'active'
      };
      
      await addDoc(collection(db, `goals/${user.uid}/entries`), goalData);
      
      // Refresh goals
      const goalsQuery = query(collection(db, `goals/${user.uid}/entries`), orderBy('createdAt', 'desc'));
      const goalsSnapshot = await getDocs(goalsQuery);
      const goalsData = goalsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setGoals(goalsData);
      
      setNewGoal({
        title: '',
        type: 'revenue',
        target: '',
        deadline: '',
        description: '',
        priority: 'medium'
      });
      setShowAddGoal(false);
    } catch (err) {
      console.error(err);
      setError('Failed to add goal');
    }
  };

  const handleDeleteGoal = async (goalId) => {
    if (window.confirm('Delete this goal?')) {
      try {
        await deleteDoc(doc(db, `goals/${user.uid}/entries/${goalId}`));
        setGoals(goals.filter(goal => goal.id !== goalId));
      } catch (err) {
        console.error(err);
        setError('Failed to delete goal');
      }
    }
  };

  const handleLogout = async () => {
    if (typeof logout === 'function') await logout();
  };

  const getGoalInsights = () => {
    if (goals.length === 0) return [];
    
    const completedGoals = goals.filter(goal => getGoalStatus(goal) === 'completed');
    const overdueGoals = goals.filter(goal => getGoalStatus(goal) === 'overdue');
    const avgProgress = goals.reduce((acc, goal) => acc + calculateProgress(goal), 0) / goals.length;
    
    return [
      {
        icon: <FaBullseye className="text-[var(--info)]" />,
        text: `You have ${goals.length} active goals with ${avgProgress.toFixed(1)}% average progress.`,
        type: 'overview'
      },
      completedGoals.length > 0 ? {
        icon: <FaTrophy className="text-[var(--accent)]" />,
        text: `Congratulations! You've completed ${completedGoals.length} goal${completedGoals.length > 1 ? 's' : ''}!`,
        type: 'success'
      } : null,
      overdueGoals.length > 0 ? {
        icon: <FaExclamationTriangle className="text-[var(--warning)]" />,
        text: `You have ${overdueGoals.length} overdue goal${overdueGoals.length > 1 ? 's' : ''}. Consider adjusting targets.`,
        type: 'warning'
      } : null,
      avgProgress > 75 ? {
        icon: <FaFire className="text-[var(--highlight)]" />,
        text: `Amazing progress! You're on fire with ${avgProgress.toFixed(1)}% average completion.`,
        type: 'motivation'
      } : null
    ].filter(Boolean);
  };

  const getChartData = () => {
    return goals.map(goal => ({
      goal: goal.title,
      target: goal.target,
      progress: calculateProgress(goal),
      status: getGoalStatus(goal)
    }));
  };

  if (loading) {
    return (
      <div className="dark">
        <motion.div 
          className="p-4 min-h-screen bg-[var(--primary-bg)] text-[var(--text-primary)] flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-400 mx-auto mb-4"></div>
            <p className="text-[var(--text-secondary)]">Loading your goals...</p>
          </div>
        </motion.div>
      </div>
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
        {/* Navigation Bar - Centered */}
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
            {user && (
              <button onClick={handleLogout} className="text-red-400 hover:underline font-semibold flex items-center gap-1 text-sm sm:text-base">
                <FaSignOutAlt /> <span className="hidden sm:inline">Logout</span>
              </button>
            )}
          </div>
        </motion.nav>

        {/* Welcome Section with Animation */}
        <motion.div 
          className="max-w-6xl mx-auto rounded-xl p-4 sm:p-6 mb-8 border relative overflow-hidden" 
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
                <FaBullseye className="text-2xl sm:text-3xl text-orange-400 flex-shrink-0" />
              </motion.div>
              <motion.h1 
                className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-orange-400 via-red-400 to-pink-400 bg-clip-text text-transparent"
                whileHover={{ scale: 1.05 }}
              >
                Goal Setting & Progress Tracking
              </motion.h1>
            </div>
            <motion.p 
              className="text-[var(--text-primary)] mb-4 text-sm sm:text-base"
              whileHover={{ color: "var(--accent)" }}
            >
              Set ambitious business goals and track your progress with visual indicators, milestone celebrations, and achievement badges. Turn your dreams into reality!
            </motion.p>
            <div className="flex gap-4 flex-wrap">
              <button onClick={() => navigate('/dashboard')} className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2 text-sm sm:text-base">
                <FaBoxOpen /> <span className="hidden sm:inline">Go to Dashboard</span>
                <span className="sm:hidden">Dashboard</span>
              </button>
            </div>
          </div>
        </motion.div>

        {/* Add Goal Button */}
        <div className="max-w-6xl mx-auto mb-8">
          <motion.button
            onClick={() => setShowAddGoal(true)}
            className="w-full bg-gradient-to-r from-orange-500 to-red-600 text-white p-4 rounded-xl hover:from-orange-600 hover:to-red-700 transition-all duration-200 flex items-center justify-center gap-3 font-semibold"
            whileHover={{ 
              scale: 1.02,
              y: -2,
              boxShadow: "0 10px 25px rgba(249, 115, 22, 0.3)"
            }}
            whileTap={{ scale: 0.98 }}
          >
            <FaPlus className="text-xl" />
            <span className="hidden sm:inline">Set New Goal</span>
            <span className="sm:hidden">New Goal</span>
            <FaBullseye />
          </motion.button>
        </div>

        {/* Add Goal Modal */}
        {showAddGoal && (
          <motion.div 
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div 
              className="bg-[var(--secondary-bg)] rounded-xl p-6 w-full max-w-md"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold bg-gradient-to-r from-orange-500 to-red-600 bg-clip-text text-transparent">Set New Goal</h2>
                <button onClick={() => setShowAddGoal(false)} className="text-[var(--text-secondary)] hover:text-gray-700">
                  <FaMinus className="text-xl" />
                </button>
              </div>
              
              <form onSubmit={handleAddGoal} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-[var(--text-primary)] mb-2">Goal Title</label>
                  <input
                    type="text"
                    value={newGoal.title}
                    onChange={(e) => setNewGoal({...newGoal, title: e.target.value})}
                    className="w-full p-3 border border-[var(--border)] rounded-lg text-[var(--text-primary)] bg-[var(--secondary-bg)] focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    placeholder="e.g., Reach ₦1M Monthly Revenue"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-[var(--text-primary)] mb-2">Goal Type</label>
                  <select
                    value={newGoal.type}
                    onChange={(e) => setNewGoal({...newGoal, type: e.target.value})}
                    className="w-full p-3 border border-[var(--border)] rounded-lg text-[var(--text-primary)] bg-[var(--secondary-bg)] focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  >
                    <option value="revenue">Revenue (₦)</option>
                    <option value="sales">Sales Quantity</option>
                    <option value="customers">Number of Customers</option>
                    <option value="rating">Average Rating</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-[var(--text-primary)] mb-2">Target Value</label>
                  <input
                    type="number"
                    value={newGoal.target}
                    onChange={(e) => setNewGoal({...newGoal, target: e.target.value})}
                    className="w-full p-3 border border-[var(--border)] rounded-lg text-[var(--text-primary)] bg-[var(--secondary-bg)] focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    placeholder="e.g., 1000000"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-[var(--text-primary)] mb-2">Deadline</label>
                  <input
                    type="date"
                    value={newGoal.deadline}
                    onChange={(e) => setNewGoal({...newGoal, deadline: e.target.value})}
                    className="w-full p-3 border border-[var(--border)] rounded-lg text-[var(--text-primary)] bg-[var(--secondary-bg)] focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-[var(--text-primary)] mb-2">Priority</label>
                  <select
                    value={newGoal.priority}
                    onChange={(e) => setNewGoal({...newGoal, priority: e.target.value})}
                    className="w-full p-3 border border-[var(--border)] rounded-lg text-[var(--text-primary)] bg-[var(--secondary-bg)] focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-[var(--text-primary)] mb-2">Description (Optional)</label>
                  <textarea
                    value={newGoal.description}
                    onChange={(e) => setNewGoal({...newGoal, description: e.target.value})}
                    className="w-full p-3 border border-[var(--border)] rounded-lg text-[var(--text-primary)] bg-[var(--secondary-bg)] focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    placeholder="Describe your goal..."
                    rows="3"
                  />
                </div>
                
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => setShowAddGoal(false)}
                    className="flex-1 bg-gray-500 text-white p-3 rounded-lg hover:bg-gray-600 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 bg-gradient-to-r from-orange-500 to-red-600 text-white p-3 rounded-lg hover:from-orange-600 hover:to-red-700 transition-all duration-200"
                  >
                    Set Goal
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}

        {/* Goals Overview with Gradient Cards */}
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <motion.div 
            className="rounded-xl p-6 border relative overflow-hidden bg-gradient-to-br from-purple-900/20 to-purple-800/20 border-purple-700"
            whileHover={{ scale: 1.02, y: -5 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <div className="flex items-center gap-3 mb-4">
              <FaBullseye className="text-2xl text-purple-400" />
              <h3 className="text-lg font-semibold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">Total Goals</h3>
            </div>
            <div className="text-3xl font-bold text-[var(--text-primary)] mb-2">{goals.length}</div>
            <p className="text-purple-300 text-sm">Active goals set</p>
          </motion.div>

          <motion.div 
            className="rounded-xl p-6 border relative overflow-hidden bg-gradient-to-br from-green-900/20 to-green-800/20 border-green-700"
            whileHover={{ scale: 1.02, y: -5 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <div className="flex items-center gap-3 mb-4">
              <FaTrophy className="text-2xl text-green-400" />
              <h3 className="text-lg font-semibold bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">Completed</h3>
            </div>
            <div className="text-3xl font-bold text-[var(--text-primary)] mb-2">
              {goals.filter(goal => getGoalStatus(goal) === 'completed').length}
            </div>
            <p className="text-green-300 text-sm">Goals achieved</p>
          </motion.div>

          <motion.div 
            className="rounded-xl p-6 border relative overflow-hidden bg-gradient-to-br from-blue-900/20 to-blue-800/20 border-blue-700"
            whileHover={{ scale: 1.02, y: -5 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <div className="flex items-center gap-3 mb-4">
              <FaChartLine className="text-2xl text-blue-400" />
              <h3 className="text-lg font-semibold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">Avg Progress</h3>
            </div>
            <div className="text-3xl font-bold text-[var(--text-primary)] mb-2">
              {goals.length > 0 ? Math.round(goals.reduce((acc, goal) => acc + calculateProgress(goal), 0) / goals.length) : 0}%
            </div>
            <p className="text-blue-300 text-sm">Average completion</p>
          </motion.div>
        </div>

        {/* Goals List */}
        <div className="max-w-6xl mx-auto mb-8">
          <h2 className="text-xl font-semibold mb-6 flex items-center gap-3">
            <FaBullseye className="text-[var(--highlight)]" />
            <span className="bg-gradient-to-r from-orange-500 to-red-600 bg-clip-text text-transparent">Your Goals</span>
          </h2>
          
          {goals.length === 0 ? (
            <motion.div 
              className="text-center py-12 bg-[var(--secondary-bg)] rounded-xl border border-[var(--border)]"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <FaBullseye className="text-4xl text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-2">No Goals Set Yet</h3>
              <p className="text-[var(--text-secondary)] mb-4">Start by setting your first business goal!</p>
              <button
                onClick={() => setShowAddGoal(true)}
                className="bg-gradient-to-r from-orange-500 to-red-600 text-white px-6 py-3 rounded-lg hover:from-orange-600 hover:to-red-700 transition-all duration-200 flex items-center gap-2 mx-auto"
              >
                <FaPlus /> Set Your First Goal
              </button>
            </motion.div>
          ) : (
            <div className="space-y-4">
              {goals.map((goal, index) => {
                const progress = calculateProgress(goal);
                const status = getGoalStatus(goal);
                const badge = getAchievementBadge(progress);
                
                return (
                  <motion.div 
                    key={goal.id}
                    className="bg-[var(--secondary-bg)] rounded-xl p-6 border border-[var(--border)] relative overflow-hidden"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ 
                      scale: 1.02,
                      boxShadow: "0 10px 25px rgba(0,0,0,0.1)"
                    }}
                  >
                    {/* Progress bar background */}
                    <div className="absolute top-0 left-0 h-1 bg-gradient-to-r from-orange-500 to-red-600" 
                         style={{ width: `${progress}%` }}></div>
                    
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-lg font-semibold text-[var(--text-primary)]">{goal.title}</h3>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(goal.priority)}`}>
                            {goal.priority}
                          </span>
                          <div className={`px-2 py-1 rounded-full text-xs font-medium ${badge.color}`}>
                            {badge.icon} {badge.text}
                          </div>
                        </div>
                        
                        <p className="text-[var(--text-secondary)] mb-3">{goal.description}</p>
                        
                        <div className="flex items-center gap-4 text-sm">
                          <div className="flex items-center gap-1">
                            <FaBullseye className="text-[var(--highlight)]" />
                            <span>Target: {goal.type === 'revenue' ? '₦' : ''}{goal.target.toLocaleString()}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <FaCalendarAlt className="text-[var(--info)]" />
                            <span>Due: {new Date(goal.deadline).toLocaleDateString()}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            {getStatusIcon(status)}
                            <span className={getStatusColor(status)}>{status.replace('-', ' ')}</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex flex-col items-end gap-3">
                        <div className="text-right">
                          <div className="text-2xl font-bold text-[var(--text-primary)]">{progress}%</div>
                          <div className="text-sm text-[var(--text-secondary)]">Complete</div>
                        </div>
                        
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleDeleteGoal(goal.id)}
                            className="bg-red-500 text-white p-2 rounded-lg hover:bg-red-600 transition-colors"
                            title="Delete Goal"
                          >
                            <FaUndo className="text-sm" />
                          </button>
                        </div>
                      </div>
                    </div>
                    
                    {/* Progress bar */}
                    <div className="mt-4">
                      <div className="flex justify-between text-sm text-[var(--text-secondary)] mb-1">
                        <span>Progress</span>
                        <span>{progress}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <motion.div 
                          className="bg-gradient-to-r from-orange-500 to-red-600 h-2 rounded-full"
                          initial={{ width: 0 }}
                          animate={{ width: `${progress}%` }}
                          transition={{ duration: 1, delay: 0.5 }}
                        ></motion.div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>

        {/* AI Insights */}
        <div className="max-w-6xl mx-auto mb-8">
          <div className="flex items-center gap-3 mb-4">
            <FaBrain className="text-xl sm:text-2xl text-[var(--purple)]" />
            <h2 className="text-lg sm:text-xl font-semibold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">Goal Insights</h2>
            <FaMagic className="text-base sm:text-lg text-[var(--info)]" />
          </div>
          <div className="space-y-3">
            {getGoalInsights().map((insight, idx) => (
              <motion.div 
                key={idx} 
                className={`flex items-start gap-3 p-4 rounded-lg border-l-4 transition-all duration-200 hover:shadow-md ${
                  insight.type === 'warning' ? 'bg-[var(--warning-bg)] border-[var(--warning-border)]' :
                  insight.type === 'success' ? 'bg-[var(--success-bg)] border-[var(--success-border)]' :
                  insight.type === 'overview' ? 'bg-[var(--info-bg)] border-[var(--info-border)]' :
                  insight.type === 'motivation' ? 'bg-[var(--highlight-bg)] border-[var(--highlight-border)]' :
                  'bg-[var(--purple-bg)] border-[var(--purple-border)]'
                }`}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.1 }}
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
        </div>

        {/* Progress Chart */}
        {goals.length > 0 && (
          <div className="max-w-6xl mx-auto mb-8">
            <div className="bg-[var(--secondary-bg)] rounded-xl shadow p-4 sm:p-6 border border-[var(--border)]">
              <h3 className="text-base sm:text-lg font-semibold mb-4 flex items-center gap-2">
                <FaChartBar /> 
                <span className="bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">Goal Progress Overview</span>
              </h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={getChartData()}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="goal" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="progress" fill="#f97316" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}
        
        {/* Floating Action Button */}
        <motion.div
          className="fixed bottom-6 right-6 z-50"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 1, duration: 0.5 }}
        >
          <motion.button
            onClick={() => setShowAddGoal(true)}
            className="w-14 h-14 bg-gradient-to-r from-orange-500 to-red-600 rounded-full shadow-lg flex items-center justify-center text-white relative overflow-hidden"
            whileHover={{ 
              scale: 1.1,
              boxShadow: "0 10px 30px rgba(0,0,0,0.3)"
            }}
            whileTap={{ scale: 0.9 }}
          >
            {/* Parallax background elements */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-orange-400 to-red-500 opacity-0"
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
              <FaBullseye className="text-xl" />
            </motion.div>
          </motion.button>
        </motion.div>
      </motion.div>
    </div>
  );
}

export default GoalSetting;