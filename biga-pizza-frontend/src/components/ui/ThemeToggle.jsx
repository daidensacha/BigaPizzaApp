import { useEffect, useState } from 'react';
import { Sun, Moon } from 'lucide-react';
import { getStoredTheme, setTheme } from '@/utils/theme';

export default function ThemeToggle() {
  const [theme, setLocalTheme] = useState('light');

  useEffect(() => {
    const stored = getStoredTheme();
    setTheme(stored);
    setLocalTheme(stored);
  }, []);

  const toggleTheme = () => {
    const next = theme === 'light' ? 'dark' : 'light';
    setTheme(next);
    setLocalTheme(next);
  };

  return (
    <button
      onClick={toggleTheme}
      className="flex items-center space-x-1 border border-yellow-700 dark:border-yellow-600 px-3 py-1 rounded text-sm bg-stone-100  text-yellow-700 dark:text-yellow-300 hover:bg-stone-100 hover:text-red-700 dark:bg-stone-800 dark:hover:bg-stone-900 transition"
    >
      {theme === 'light' ? (
        <Moon className="w-4 h-4" />
      ) : (
        <Sun className="w-4 h-4" />
      )}
      <span>{theme === 'light' ? 'Dark' : 'Light'} Mode</span>
    </button>
  );
}
