
import { motion } from 'framer-motion';
import { useContext, useEffect, useState } from 'react';
import ThemeContext from '../context/ThemeContext';

const LoadingSpinner = ({ size = 'md', text = 'Loading...' }) => {
  const { theme, isThemeLoaded } = useContext(ThemeContext);
  const [resolvedTheme, setResolvedTheme] = useState('dark');

  useEffect(() => {
    // Use context theme if loaded, otherwise check data-theme attribute
    if (isThemeLoaded) {
      setResolvedTheme(theme);
    } else {
      const domTheme = document.documentElement.getAttribute('data-theme') || 'dark';
      setResolvedTheme(domTheme);
    }
  }, [theme, isThemeLoaded]);

  const sizeClasses = {
    sm: 'w-6 h-6',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16'
  };

  return (
    <div className={`fixed inset-0 flex flex-col items-center justify-center gap-4 z-50 spinner-container ${
      resolvedTheme === 'dark' ? 'bg-[#111827]' : 'bg-white'
    }`}>
      <motion.div
        className={`${sizeClasses[size]} relative`}
        animate={{ rotate: 360 }}
        transition={{
          duration: 1,
          repeat: Infinity,
          ease: "linear"
        }}
      >
        <div className={`absolute inset-0 border-4 rounded-full ${
          resolvedTheme === 'dark' ? 'border-blue-800' : 'border-blue-200'
        }`}></div>
        <motion.div
          className={`absolute inset-0 border-4 border-transparent rounded-full ${
            resolvedTheme === 'dark' ? 'border-t-blue-400' : 'border-t-blue-600'
          }`}
          animate={{ rotate: 360 }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </motion.div>
      
      {text && (
        <motion.p
          className={`text-sm font-medium ${
            resolvedTheme === 'dark' ? 'text-gray-200' : 'text-gray-800'
          }`}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          {text}
        </motion.p>
      )}
    </div>
  );
};

export default LoadingSpinner;
