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

    // Dynamically set <meta name="theme-color"> to match app theme
    const updateThemeColorMetaTag = (color) => {
      let meta = document.querySelector('meta[name="theme-color"]');
      if (!meta) {
        meta = document.createElement('meta');
        meta.name = 'theme-color';
        document.head.appendChild(meta);
      }
      meta.setAttribute('content', color);
    };
    if (theme === 'dark') {
      updateThemeColorMetaTag('#0f172a'); // dark bg
    } else {
      updateThemeColorMetaTag('#ffffff'); // light bg
    }
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