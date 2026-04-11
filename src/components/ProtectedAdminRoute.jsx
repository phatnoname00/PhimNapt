import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedAdminRoute = ({ children }) => {
  const { currentUser, isAdmin } = useAuth();
  // ✅ Đợi AuthContext hydrate từ localStorage (tránh redirect sai khi refresh trang)
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    // Sau 1 tick, AuthContext đã đọc xong localStorage
    const timer = setTimeout(() => setChecking(false), 100);
    return () => clearTimeout(timer);
  }, []);

  if (checking) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-t-4 border-b-4 border-emerald-500" />
      </div>
    );
  }

  if (!currentUser) {
    return <Navigate to="/dang-nhap" replace />;
  }

  if (!isAdmin()) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] p-8 text-center">
        <div className="text-8xl mb-6">🚫</div>
        <h1 className="text-4xl font-black text-red-500 mb-3">403 — Truy Cập Bị Từ Chối</h1>
        <p className="text-gray-400 text-lg mb-6">
          Bạn không có quyền truy cập vào trang quản trị.
        </p>
        <a
          href="/"
          className="bg-primary text-white px-8 py-3 rounded-full font-bold hover:bg-emerald-600 transition"
        >
          Về Trang Chủ
        </a>
      </div>
    );
  }

  return children;
};

export default ProtectedAdminRoute;
