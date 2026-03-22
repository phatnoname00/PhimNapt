import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Register = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError('Mật khẩu nhập lại không khớp!');
      return;
    }
    
    const result = register(username, password);
    if (result.success) {
      navigate('/');
    } else {
      setError(result.message);
    }
  };

  return (
    <div className="flex-grow flex items-center justify-center p-4 min-h-[70vh]">
      <div className="bg-white dark:bg-darkCard w-full max-w-md p-8 rounded-2xl shadow-2xl border border-gray-200 dark:border-slate-800 transition-colors relative z-10 glass">
        <h2 className="text-3xl font-black text-center text-gray-900 dark:text-white mb-6">Đăng Ký</h2>
        {error && <div className="bg-red-500/20 text-red-600 dark:text-red-400 p-3 rounded mb-4 text-sm font-medium border border-red-500/30">{error}</div>}
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2">Tên đăng nhập</label>
            <input 
              type="text" 
              required
              minLength="3"
              className="w-full bg-gray-50 dark:bg-slate-800/50 border border-gray-300 dark:border-slate-700 text-gray-900 dark:text-white rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary transition-colors"
              placeholder="Chọn tên đăng nhập..."
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2">Mật khẩu</label>
            <input 
              type="password" 
              required
              minLength="6"
              className="w-full bg-gray-50 dark:bg-slate-800/50 border border-gray-300 dark:border-slate-700 text-gray-900 dark:text-white rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary transition-colors"
              placeholder="Nhập mật khẩu (ít nhất 6 ký tự)..."
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2">Nhập lại mật khẩu</label>
            <input 
              type="password" 
              required
              className="w-full bg-gray-50 dark:bg-slate-800/50 border border-gray-300 dark:border-slate-700 text-gray-900 dark:text-white rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary transition-colors"
              placeholder="Xác nhận mật khẩu..."
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>
          <button 
            type="submit" 
            className="w-full bg-primary hover:bg-emerald-600 text-white font-bold py-3 rounded-lg transition-all shadow-lg hover:shadow-primary/40 mt-6"
          >
            TẠO TÀI KHOẢN
          </button>
        </form>
        
        <div className="mt-6 text-center text-sm text-gray-600 dark:text-gray-400">
          Đã có tài khoản? <Link to="/dang-nhap" className="text-primary font-bold hover:underline">Đăng nhập</Link>
        </div>
      </div>
    </div>
  );
};

export default Register;
