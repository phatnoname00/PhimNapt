import React, { createContext, useState, useEffect, useContext } from 'react';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  
  // Fake database in localStorage
  const getUsers = () => JSON.parse(localStorage.getItem('users')) || [];

  useEffect(() => {
    // Check auto login
    const loggedInUser = localStorage.getItem('currentUser');
    if (loggedInUser) {
      setCurrentUser(JSON.parse(loggedInUser));
    }
  }, []);

  const login = (username, password) => {
    const users = getUsers();
    const user = users.find(u => u.username === username && u.password === password);
    if (user) {
      // Remove password from local state for security (even if fake)
      const { password: _, ...userWithoutPass } = user;
      setCurrentUser(userWithoutPass);
      localStorage.setItem('currentUser', JSON.stringify(userWithoutPass));
      return { success: true };
    }
    return { success: false, message: 'Sai tên đăng nhập hoặc mật khẩu!' };
  };

  const register = (username, password) => {
    const users = getUsers();
    if (users.find(u => u.username === username)) {
      return { success: false, message: 'Tên đăng nhập đã tồn tại!' };
    }
    
    const newUser = { 
      id: Date.now(), 
      username, 
      password, 
      favorites: [] 
    };
    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));
    
    // Auto login
    const { password: _, ...userWithoutPass } = newUser;
    setCurrentUser(userWithoutPass);
    localStorage.setItem('currentUser', JSON.stringify(userWithoutPass));
    
    return { success: true };
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem('currentUser');
  };

  const toggleFavorite = (movie) => {
    if (!currentUser) return false;
    
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
        year: movie.year
      });
    }

    users[userIndex].favorites = userFavs;
    localStorage.setItem('users', JSON.stringify(users));
    
    // Update current context user
    const updatedCurrentUser = { ...currentUser, favorites: userFavs };
    setCurrentUser(updatedCurrentUser);
    localStorage.setItem('currentUser', JSON.stringify(updatedCurrentUser));
    
    return true;
  };

  const isFavorite = (slug) => {
    if (!currentUser || !currentUser.favorites) return false;
    return currentUser.favorites.some(f => f.slug === slug);
  };

  return (
    <AuthContext.Provider value={{ currentUser, login, register, logout, toggleFavorite, isFavorite }}>
      {children}
    </AuthContext.Provider>
  );
};
