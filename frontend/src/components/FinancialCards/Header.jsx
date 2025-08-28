import React from 'react';
import { FaSyncAlt, FaMoon, FaSun } from 'react-icons/fa';

const Header = ({ darkMode, toggleTheme, loading, onRefresh }) => {
  return (
    <div className="flex justify-between items-center mb-10">
      <h2 className="text-4xl font-bold text-gray-800 dark:text-gray-200">Indicadores Financeiros</h2>
      <div className="flex gap-2">
        <button
          onClick={toggleTheme}
          className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-dark-200 transition-colors"
          aria-label={darkMode ? 'Modo claro' : 'Modo escuro'}
        >
          {darkMode ? <FaSun className="text-yellow-400" /> : <FaMoon className="text-gray-600" />}
        </button>
        <button 
          onClick={onRefresh}
          className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 p-1 rounded-full hover:bg-indigo-50 dark:hover:bg-dark-200 transition-colors"
        >
          <FaSyncAlt className={`text-lg ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>
    </div>
  );
};

export default Header;