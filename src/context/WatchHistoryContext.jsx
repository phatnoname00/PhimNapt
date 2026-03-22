import React, { createContext, useState, useContext, useEffect } from 'react';
import { useAuth } from './AuthContext';

const WatchHistoryContext = createContext();
export const useWatchHistory = () => useContext(WatchHistoryContext);

const MAX_HISTORY = 20;

// Lấy key lưu trữ dựa trên user
const getHistoryKey = (userId) => userId ? `watchHistory_${userId}` : null;

export const WatchHistoryProvider = ({ children }) => {
  const { currentUser } = useAuth();
  const [history, setHistory] = useState([]);

  // Khi user thay đổi (login/logout) → tải lịch sử của user đó
  useEffect(() => {
    const key = getHistoryKey(currentUser?.id);
    if (key) {
      try {
        const saved = JSON.parse(localStorage.getItem(key) || '[]');
        setHistory(saved);
      } catch {
        setHistory([]);
      }
    } else {
      // Đăng xuất → xóa lịch sử khỏi UI (không xóa dữ liệu lưu)
      setHistory([]);
    }
  }, [currentUser?.id]);

  const addToHistory = (movie, episode) => {
    // Chỉ lưu khi đã đăng nhập
    if (!currentUser) return;
    const key = getHistoryKey(currentUser.id);
    if (!key) return;

    setHistory(prev => {
      const filtered = prev.filter(h => h.slug !== movie.slug);
      const newEntry = {
        slug: movie.slug,
        name: movie.name,
        origin_name: movie.origin_name,
        thumb_url: movie.thumb_url,
        year: movie.year,
        lastEpisode: episode?.name || 'Tập 1',
        lastEpisodeSlug: episode?.slug || '',
        watchedAt: Date.now()
      };
      const updated = [newEntry, ...filtered].slice(0, MAX_HISTORY);
      localStorage.setItem(key, JSON.stringify(updated));
      return updated;
    });
  };

  const clearHistory = () => {
    if (!currentUser) return;
    const key = getHistoryKey(currentUser.id);
    if (key) localStorage.removeItem(key);
    setHistory([]);
  };

  return (
    <WatchHistoryContext.Provider value={{ history, addToHistory, clearHistory }}>
      {children}
    </WatchHistoryContext.Provider>
  );
};
