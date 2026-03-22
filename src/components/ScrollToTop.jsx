import React, { useState, useEffect } from 'react';
import { FaArrowUp } from 'react-icons/fa';

const ScrollToTop = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 400);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const scrollUp = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  if (!visible) return null;

  return (
    <button
      onClick={scrollUp}
      className="fixed bottom-24 left-6 z-[9998] w-11 h-11 rounded-full bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 text-gray-600 dark:text-gray-300 hover:text-primary hover:border-primary shadow-lg transition-all hover:scale-110 flex items-center justify-center animate-[fadeInUp_0.3s_ease-out]"
      title="Lên đầu trang"
    >
      <FaArrowUp size={14} />
    </button>
  );
};

export default ScrollToTop;
