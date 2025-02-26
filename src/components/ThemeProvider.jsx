'use client';

import { createContext, useContext, useState, useEffect } from 'react';

// Create a context for the theme
export const ThemeContext = createContext({
  theme: 'light',
  setTheme: () => null,
});

// Custom hook to use the theme
export const useTheme = () => useContext(ThemeContext);

// ThemeProvider component
export default function ThemeProvider({ children }) {
  const [theme, setTheme] = useState('light');
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Get theme from localStorage on first load
    const storedTheme = localStorage.getItem('theme');

    if (storedTheme) {
      setTheme(storedTheme);
      document.documentElement.setAttribute('data-theme', storedTheme);
    } else if (
      window.matchMedia &&
      window.matchMedia('(prefers-color-scheme: dark)').matches
    ) {
      setTheme('dark');
      document.documentElement.setAttribute('data-theme', 'dark');
    }

    setIsLoaded(true);

    // Add transition class after initial load to prevent flash
    setTimeout(() => {
      document.body.classList.add('theme-transition');
    }, 100);
  }, []);

  // Update theme in localStorage and DOM when it changes
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem('theme', theme);
      document.documentElement.setAttribute('data-theme', theme);
    }
  }, [theme, isLoaded]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}
