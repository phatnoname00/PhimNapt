import React, { createContext, useState, useEffect, useContext } from 'react';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

// ===== Tài khoản Admin cứng (hardcoded) =====
const ADMIN_ACCOUNT = {
  id: 'admin_root',
  username: 'admin',
  password: 'admin',
  role: 'admin',
  displayName: 'Administrator',
  favorites: [],
};

export const AuthProvider = ({ children }) => {
  // ✅ Lazy init: đọc ngay từ localStorage, tránh flash/redirect sai
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const stored = localStorage.getItem('currentUser');
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  // Fake database in localStorage
  const getUsers = () => JSON.parse(localStorage.getItem('users')) || [];

  const login = (username, password) => {
    // ✅ Kiểm tra tài khoản admin trước
    if (username === ADMIN_ACCOUNT.username && password === ADMIN_ACCOUNT.password) {
      const adminUser = {
        id: ADMIN_ACCOUNT.id,
        username: ADMIN_ACCOUNT.username,
        displayName: ADMIN_ACCOUNT.displayName,
        role: 'admin',
        favorites: [],
      };
      setCurrentUser(adminUser);
      localStorage.setItem('currentUser', JSON.stringify(adminUser));
      return { success: true, role: 'admin' };
    }

    // Kiểm tra user thường
    const users = getUsers();
    const user = users.find(u => u.username === username && u.password === password);
    if (user) {
      const { password: _, ...userWithoutPass } = user;
      const userWithRole = { ...userWithoutPass, role: 'user' };
      setCurrentUser(userWithRole);
      localStorage.setItem('currentUser', JSON.stringify(userWithRole));
      return { success: true, role: 'user' };
    }
    return { success: false, message: 'Sai tên đăng nhập hoặc mật khẩu!' };
  };

  const register = (username, password) => {
    // Không cho đăng ký trùng tên admin
    if (username === ADMIN_ACCOUNT.username) {
      return { success: false, message: 'Tên đăng nhập đã tồn tại!' };
    }

    const users = getUsers();
    if (users.find(u => u.username === username)) {
      return { success: false, message: 'Tên đăng nhập đã tồn tại!' };
    }

    const newUser = {
      id: Date.now(),
      username,
      password,
      role: 'user',
      favorites: [],
    };
    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));

    // Auto login
    const { password: _, ...userWithoutPass } = newUser;
    const userWithRole = { ...userWithoutPass, role: 'user' };
    setCurrentUser(userWithRole);
    localStorage.setItem('currentUser', JSON.stringify(userWithRole));

    return { success: true };
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem('currentUser');
  };

  const isAdmin = () => currentUser?.role === 'admin';

  const toggleFavorite = (movie) => {
    if (!currentUser) return false;

    // Admin không lưu yêu thích
    if (currentUser.role === 'admin') return false;

    const users = getUsers();
    const userIndex = users.findIndex(u => u.id === currentUser.id);
    if (userIndex === -1) return false;

    let userFavs = users[userIndex].favorites || [];
    const isExist = userFavs.find(f => f.slug === movie.slug);

    if (isExist) {
      userFavs = userFavs.filter(f => f.slug !== movie.slug);
    } else {
      userFavs.push({
        slug: movie.slug,
        name: movie.name,
        thumb_url: movie.thumb_url,
        poster_url: movie.poster_url,
        origin_name: movie.origin_name,
        year: movie.year,
      });
    }

    users[userIndex].favorites = userFavs;
    localStorage.setItem('users', JSON.stringify(users));

    const updatedCurrentUser = { ...currentUser, favorites: userFavs };
    setCurrentUser(updatedCurrentUser);
    localStorage.setItem('currentUser', JSON.stringify(updatedCurrentUser));

    return true;
  };

  const isFavorite = (slug) => {
    if (!currentUser || !currentUser.favorites) return false;
    return currentUser.favorites.some(f => f.slug === slug);
  };

  // ===== Admin: Quản lý user =====
  const adminGetAllUsers = () => {
    if (!isAdmin()) return [];
    return getUsers().map(({ password: _, ...u }) => u);
  };

  const adminDeleteUser = (userId) => {
    if (!isAdmin()) return false;
    const users = getUsers().filter(u => u.id !== userId);
    localStorage.setItem('users', JSON.stringify(users));
    return true;
  };

  const adminResetPassword = (userId, newPassword) => {
    if (!isAdmin()) return false;
    const users = getUsers();
    const idx = users.findIndex(u => u.id === userId);
    if (idx === -1) return false;
    users[idx].password = newPassword;
    localStorage.setItem('users', JSON.stringify(users));
    return true;
  };

  return (
    <AuthContext.Provider value={{
      currentUser,
      login,
      register,
      logout,
      isAdmin,
      toggleFavorite,
      isFavorite,
      adminGetAllUsers,
      adminDeleteUser,
      adminResetPassword,
    }}>
      {children}
    </AuthContext.Provider>
  );
};
