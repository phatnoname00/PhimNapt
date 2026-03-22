import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-darkBg border-t border-slate-800 mt-12 py-8 text-sm text-gray-400">
      <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center relative z-10">
        <div className="mb-4 md:mb-0 text-center md:text-left">
          <Link to="/" className="text-xl font-black text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent block mb-2 transition-transform hover:scale-105 inline-block">
            Phim NAPT
          </Link>
          <p>© 2026 Phim NAPT. All rights reserved.</p>
          <p className="text-xs mt-1 text-gray-500">Website sử dụng API miễn phí từ mạng internet để mục đích giáo dục & thử nghiệm.</p>
        </div>
        <div className="flex space-x-6">
          <Link to="#" className="hover:text-primary transition">Điều khoản</Link>
          <Link to="#" className="hover:text-primary transition">Bản quyền</Link>
          <Link to="#" className="hover:text-primary transition">Liên hệ</Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
