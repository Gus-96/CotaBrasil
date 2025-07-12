import { useState, useEffect } from 'react';

export default function useTheme() {
  const [darkMode, setDarkMode] = useState(true); // Alterado para true como padrão

  useEffect(() => {
    // Verifica se há preferência salva, caso contrário mantém dark mode ativo
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      setDarkMode(savedTheme === 'dark');
    }
  }, []);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [darkMode]);

  const toggleTheme = () => setDarkMode(!darkMode);

  return { darkMode, toggleTheme };
}