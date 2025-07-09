import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';
import Login from './components/Login';
import Register from './components/Register';
import Dashboard from './components/Dashboard';
import PasswordReset from './components/PasswordReset';
import BusinessData from './components/BusinessData';
import ProfitLossCalculator from './components/ProfitLossCalculator';
import GoalSetting from './components/GoalSetting';
import CustomerDetails from './components/CustomerDetails';

import ProtectedRoute from './components/ProtectedRoute';
import PublicRoute from './components/PublicRoute';

function AnimatedRoutes() {
  const location = useLocation();
  
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={
          <PublicRoute>
            <Login />
          </PublicRoute>
        } />
        <Route path="/login" element={
          <PublicRoute>
            <Login />
          </PublicRoute>
        } />
        <Route path="/register" element={
          <PublicRoute>
            <Register />
          </PublicRoute>
        } />
        <Route path="/reset-password" element={
          <PublicRoute>
            <PasswordReset />
          </PublicRoute>
        } />
        <Route path="/dashboard" element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        } />
        <Route path="/business-data" element={
          <ProtectedRoute>
            <BusinessData />
          </ProtectedRoute>
        } />
        <Route path="/profit-loss" element={
          <ProtectedRoute>
            <ProfitLossCalculator />
          </ProtectedRoute>
        } />
        <Route path="/goals" element={
          <ProtectedRoute>
            <GoalSetting />
          </ProtectedRoute>
        } />

        <Route path="/customer/:id" element={
          <ProtectedRoute>
            <CustomerDetails />
          </ProtectedRoute>
        } />
      </Routes>
    </AnimatePresence>
  );
}

function App() {
  return (
    <Router>
      <ThemeProvider>
        <AuthProvider>
          <AnimatedRoutes />
        </AuthProvider>
      </ThemeProvider>
    </Router>
  );
}

export default App;