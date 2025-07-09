import { createContext, useState, useEffect } from 'react';

// Create the ThemeContext with a default value
const ThemeContext = createContext({
  theme: 'light',
  toggleTheme: () => console.log('ThemeContext not provided'),
});

console.log('ThemeContext created:', ThemeContext); // Debug log

// ThemeProvider component to wrap the app
export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(() => {
    const savedTheme = localStorage.getItem('theme');
    return savedTheme ? savedTheme : 'dark';
  });

  useEffect(() => {
    console.log('Applying theme:', theme); // Debug log
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export default ThemeContext;