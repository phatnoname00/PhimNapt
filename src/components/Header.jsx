import React, { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaSearch, FaBars, FaTimes, FaSun, FaMoon, FaUser, FaHeart, FaSignOutAlt } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isDarkMode, setIsDarkMode] = useState(true);
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();

  // Khởi tạo theme
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'light') {
      setIsDarkMode(false);
      document.documentElement.classList.remove('dark');
    } else {
      setIsDarkMode(true);
      document.documentElement.classList.add('dark');
    }
  }, []);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
    if (isDarkMode) {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    } else {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    }
  };

  const handleSearch = useCallback((e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/tim-kiem?keyword=${encodeURIComponent(searchQuery.trim())}`);
      setIsMenuOpen(false);
    }
  }, [searchQuery, navigate]);

  return (
    <header className="fixed top-0 w-full z-50 glass transition-all duration-300">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent transition-transform hover:scale-105 inline-block">
          Phim NAPT
        </Link>

        {/* Desktop Menu */}
        <nav className="hidden md:flex items-center space-x-6">
          <Link to="/" className="text-gray-600 dark:text-gray-300 hover:text-primary dark:hover:text-primary transition font-medium">Trang Chủ</Link>
          <Link to="#" className="text-gray-600 dark:text-gray-300 hover:text-primary transition font-medium">Phim Lẻ</Link>
          <Link to="#" className="text-gray-600 dark:text-gray-300 hover:text-primary transition font-medium">Phim Bộ</Link>
          <Link to="#" className="text-gray-600 dark:text-gray-300 hover:text-primary transition font-medium">Chiếu Rạp</Link>
        </nav>

        {/* Auth / Mobile Toggle */}
        <div className="flex items-center space-x-4">
          <form onSubmit={handleSearch} className="hidden md:flex items-center bg-gray-200 dark:bg-darkBg rounded-full border border-gray-300 dark:border-slate-700 overflow-hidden px-3 py-1">
            <input 
              type="text" 
              placeholder="Tìm kiếm phim..." 
              className="bg-transparent text-sm text-gray-800 dark:text-white focus:outline-none px-2 w-48"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button type="submit" className="text-gray-500 dark:text-gray-400 hover:text-primary transition">
              <FaSearch />
            </button>
          </form>

          {/* Theme Toggle Button */}
          <button 
            onClick={toggleTheme} 
            className="text-gray-600 dark:text-gray-300 hover:text-primary transition p-2 rounded-full bg-gray-200 dark:bg-darkBg"
            title="Đổi giao diện Sáng/Tối"
          >
            {isDarkMode ? <FaSun size={18} className="text-yellow-400" /> : <FaMoon size={18} className="text-gray-600" />}
          </button>

          {/* User Section (Desktop) */}
          <div className="hidden md:flex items-center space-x-3">
            {currentUser ? (
              <div className="relative group flex items-center gap-4">
                <Link to="/yeu-thich" className="text-pink-500 hover:text-pink-400 transition flex items-center text-sm font-bold" title="Phim Yêu Thích">
                  <FaHeart size={18} />
                </Link>
                <Link to="/ho-so" className="flex items-center bg-white/10 dark:bg-darkCard/50 rounded-full pl-2 pr-4 py-1 border border-gray-300/40 dark:border-slate-700/50 hover:border-primary/50 transition">
                  <div className="w-6 h-6 rounded-full bg-gradient-to-r from-primary to-blue-500 flex items-center justify-center text-white text-xs font-bold mr-2">
                    {currentUser.username.charAt(0).toUpperCase()}
                  </div>
                  <span className="text-sm font-bold text-gray-800 dark:text-white">{currentUser.username}</span>
                </Link>
                {/* Dropdown */}
                <div className="absolute top-full right-0 mt-2 w-48 bg-white dark:bg-darkCard rounded-xl shadow-2xl border border-gray-200 dark:border-slate-700 opacity-0 group-hover:opacity-100 invisible group-hover:visible transition-all z-50 overflow-hidden">
                  <Link to="/ho-so" className="w-full text-left px-4 py-3 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-slate-700 flex items-center border-b border-gray-100 dark:border-slate-700/50">
                    <FaUser className="mr-2 text-primary" /> Hồ Sơ Cá Nhân
                  </Link>
                  <Link to="/yeu-thich" className="w-full text-left px-4 py-3 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-slate-700 flex items-center border-b border-gray-100 dark:border-slate-700/50">
                    <FaHeart className="mr-2 text-pink-500" /> Phim Yêu Thích
                  </Link>
                  <button onClick={logout} className="w-full text-left px-4 py-3 text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center">
                    <FaSignOutAlt className="mr-2" /> Đăng Xuất
                  </button>
                </div>
              </div>
            ) : (
              <>
                <Link to="/dang-nhap" className="text-sm font-bold text-gray-600 dark:text-gray-300 hover:text-primary transition">Đăng Nhập</Link>
                <Link to="/dang-ky" className="text-sm font-bold bg-primary hover:bg-emerald-600 text-white px-4 py-1.5 rounded-full transition shadow-lg hover:shadow-primary/40">Đăng Ký</Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button 
            className="md:hidden text-gray-800 dark:text-gray-300"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden glass absolute top-16 left-0 w-full p-4 border-t border-gray-300 dark:border-slate-700 flex flex-col space-y-4 shadow-xl">
          {currentUser ? (
            <div className="flex items-center justify-between border-b border-gray-200 dark:border-slate-700 pb-3">
              <span className="font-bold text-gray-800 dark:text-white">Chào, {currentUser.username}</span>
              <button onClick={() => {logout(); setIsMenuOpen(false);}} className="text-sm text-red-500 font-bold">Đăng xuất</button>
            </div>
          ) : (
            <div className="flex space-x-3 border-b border-gray-200 dark:border-slate-700 pb-3">
              <Link to="/dang-nhap" className="flex-1 text-center py-2 bg-gray-200 dark:bg-slate-800 rounded font-bold text-gray-800 dark:text-white" onClick={() => setIsMenuOpen(false)}>Đăng Nhập</Link>
              <Link to="/dang-ky" className="flex-1 text-center py-2 bg-primary rounded font-bold text-white" onClick={() => setIsMenuOpen(false)}>Đăng Ký</Link>
            </div>
          )}
          <Link to="/" className="text-gray-800 dark:text-gray-300 font-medium" onClick={() => setIsMenuOpen(false)}>Trang Chủ</Link>
          {currentUser && (
            <>
              <Link to="/ho-so" className="text-gray-800 dark:text-gray-300 font-bold" onClick={() => setIsMenuOpen(false)}>👤 Hồ Sơ Cá Nhân</Link>
              <Link to="/yeu-thich" className="text-pink-500 font-bold" onClick={() => setIsMenuOpen(false)}>❤️ Phim Yêu Thích</Link>
            </>
          )}
          <Link to="#" className="text-gray-800 dark:text-gray-300 font-medium">Phim Lẻ</Link>
          <Link to="#" className="text-gray-800 dark:text-gray-300 font-medium">Phim Bộ</Link>
          <Link to="#" className="text-gray-800 dark:text-gray-300 font-medium">Chiếu Rạp</Link>
          
          <form onSubmit={handleSearch} className="flex items-center bg-gray-200 dark:bg-darkBg rounded-full border border-gray-300 dark:border-slate-700 overflow-hidden px-3 py-2 mt-4">
            <input 
              type="text" 
              placeholder="Tìm kiếm phim..." 
              className="bg-transparent text-sm text-gray-800 dark:text-white focus:outline-none px-2 flex-grow"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button type="submit" className="text-gray-500 dark:text-gray-400 hover:text-primary">
              <FaSearch />
            </button>
          </form>
        </div>
      )}
    </header>
  );
};

export default Header;
