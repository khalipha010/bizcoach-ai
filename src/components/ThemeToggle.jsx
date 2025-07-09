import { useContext } from 'react';
import ThemeContext from '../context/ThemeContext';

import { FaSun, FaMoon } from 'react-icons/fa';

import { useEffect } from 'react';
function ThemeToggle({ mobile = false }) {
  const { theme, toggleTheme } = useContext(ThemeContext);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, [theme]);

  return (
    <button
      onClick={toggleTheme}
      className={`${mobile ? 'p-2' : 'p-1.5'} rounded-full bg-[var(--toggle-bg)] text-[var(--toggle-icon)] hover:bg-[var(--toggle-hover)] transition-colors`}
      aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
    >
      {theme === 'dark' ? (
        <FaSun className={mobile ? "text-lg" : "text-base"} />
      ) : (
        <FaMoon className={mobile ? "text-lg" : "text-base"} />
      )}
    </button>
  );
}

export default ThemeToggle;