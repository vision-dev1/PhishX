import React, { useState, useEffect } from 'react';
import { motion, useSpring, useTransform } from 'framer-motion';

const Counter = ({ value, label, isPrimary }) => {
  const spring = useSpring(0, { mass: 1, stiffness: 100, damping: 30 });
  const display = useTransform(spring, (current) => Math.floor(current).toLocaleString());

  useEffect(() => {
    spring.set(value);
  }, [value, spring]);

  return (
    <div className="text-center px-8">
      <motion.p className={`text-4xl font-bold mb-1 ${isPrimary ? 'text-primary' : 'text-[#111418] dark:text-white'}`}>
        {display}
      </motion.p>
      <p className="text-sm font-medium text-[#617589] dark:text-gray-400 uppercase tracking-wider">
        {label}
      </p>
    </div>
  );
};

const Stats = ({ scanCount }) => {
  return (
    <section className="py-12 bg-white dark:bg-[#0d1117]">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-around items-center border border-[#f0f2f4] dark:border-gray-800 rounded-2xl py-10 px-6 shadow-sm bg-white dark:bg-[#161b22]">
          <Counter value={scanCount} label="Scans in the last 24 hours" isPrimary />
          <div className="w-px h-12 bg-[#f0f2f4] dark:bg-gray-800 hidden md:block"></div>
          <Counter value={8200} label="Active users" />
          <div className="w-px h-12 bg-[#f0f2f4] dark:bg-gray-800 hidden md:block"></div>
          <Counter value={450} label="Active organizations" />
        </div>
      </div>
    </section>
  );
};

export default Stats;

