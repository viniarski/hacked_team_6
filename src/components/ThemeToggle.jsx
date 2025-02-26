'use client';

import { useState, useEffect } from 'react';
import { Moon, Sun } from 'lucide-react';

const ThemeToggle = () => {
  // Initialize state with 'light' as default
  const [theme, setTheme] = useState('light');

  // On mount, check if a theme is stored in localStorage
  useEffect(() => {
    const storedTheme = localStorage.getItem('theme');

    // If a theme is stored or system preference is dark, use that
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

    // Add transition class after initial load to prevent flash
    setTimeout(() => {
      document.body.classList.add('theme-transition');
    }, 100);
  }, []);

  // Toggle theme function
  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
  };

  return (
    <button
      onClick={toggleTheme}
      className="flex items-center justify-center w-10 h-10 rounded-full hover:bg-black/5 transition-colors"
      aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
      title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
    >
      {theme === 'light' ? (
        <Moon className="h-5 w-5 text-gray-700" />
      ) : (
        <Sun className="h-5 w-5 text-gray-700" />
      )}
    </button>
  );
};

export default ThemeToggle;
