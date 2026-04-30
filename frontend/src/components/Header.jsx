import React from 'react';
import { Sun, Moon, Shield } from 'lucide-react';
import logo from '../assets/logo.png';

const Header = ({ isDark, setIsDark }) => {
  return (
    <header className="flex items-center justify-between border-b border-[#f0f2f4] dark:border-gray-800 bg-white dark:bg-[#0d1117] px-10 py-4 sticky top-0 z-50 transition-colors duration-300">
      <div className="flex items-center gap-2">
        <img src={logo} alt="PhishX Logo" className="size-8 rounded-lg" />
        <h2 className="text-xl font-bold tracking-tight font-display dark:text-white">PhishX</h2>
      </div>
      
      <nav className="flex items-center gap-8">
        <a className="text-sm font-medium hover:text-primary transition-colors dark:text-gray-300 dark:hover:text-primary" href="#tools">Analyzer</a>
        <a className="text-sm font-medium hover:text-primary transition-colors dark:text-gray-300 dark:hover:text-primary" href="#education">Learn</a>
        
        <button 
          onClick={() => setIsDark(!isDark)}
          className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
          aria-label="Toggle theme"
        >
          {isDark ? <Sun className="size-5" /> : <Moon className="size-5" />}
        </button>
        
        <button className="bg-primary text-white text-sm font-bold py-2 px-5 rounded-lg hover:bg-primary/90 transition-all">
          Get Started
        </button>
      </nav>
    </header>
  );
};

export default Header;

