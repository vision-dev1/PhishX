import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import Analyzer from './components/Analyzer';
import Stats from './components/Stats';
import Education from './components/Education';
import Footer from './components/Footer';

function App() {
  const [isDark, setIsDark] = useState(() => {
    const saved = localStorage.getItem('color-theme');
    if (saved) return saved === 'dark';
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });
  
  const [scanCount, setScanCount] = useState(12482);

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('color-theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('color-theme', 'light');
    }
  }, [isDark]);

  const handleScanComplete = () => {
    setScanCount(prev => prev + 1);
  };

  return (
    <div className="min-h-screen bg-white dark:bg-[#0d1117] text-[#111418] dark:text-gray-100 transition-colors duration-300">
      <Header isDark={isDark} setIsDark={setIsDark} />
      
      <main>
        <Hero />
        <Analyzer onScanComplete={handleScanComplete} />
        <Stats scanCount={scanCount} />
        <Education />
      </main>
      
      <Footer />
    </div>
  );
}

export default App;

