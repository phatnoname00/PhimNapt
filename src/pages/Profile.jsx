import React from 'react';
import { Link, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useWatchHistory } from '../context/WatchHistoryContext';
import { FaHeart, FaHistory, FaUser, FaStar, FaFilm, FaSignOutAlt, FaTrash } from 'react-icons/fa';
import MovieCard from '../components/MovieCard';

const StatCard = ({ icon, label, value, color }) => (
  <div className={`bg-white dark:bg-darkCard border border-gray-200 dark:border-slate-700 rounded-2xl p-5 flex items-center gap-4 transition-colors shadow-sm hover:shadow-md`}>
    <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-white text-xl ${color}`}>
      {icon}
    </div>
    <div>
      <p className="text-2xl font-black text-gray-900 dark:text-white">{value}</p>
      <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">{label}</p>
    </div>
  </div>
);

const Profile = () => {
  const { currentUser, logout } = useAuth();
  const { history, clearHistory } = useWatchHistory();

  if (!currentUser) return <Navigate to="/dang-nhap" replace />;

  const favorites = currentUser.favorites || [];
  const joinDate = new Date(currentUser.id).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' });

  return (
    <div className="pb-20 min-h-screen">
      {/* Hero Banner */}
      <div className="relative w-full h-48 md:h-64 bg-gradient-to-r from-primary via-blue-600 to-purple-600 overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        {/* Decorative circles */}
        <div className="absolute -top-10 -right-10 w-48 h-48 rounded-full bg-white/5"></div>
        <div className="absolute -bottom-16 -left-10 w-64 h-64 rounded-full bg-white/5"></div>
        <div className="absolute bottom-0 left-0 right-0 container mx-auto px-6 pb-0 flex items-end gap-4">
          {/* Avatar */}
          <div className="w-20 h-20 md:w-24 md:h-24 rounded-2xl bg-white dark:bg-slate-900 border-4 border-white dark:border-slate-800 flex items-center justify-center shadow-xl text-3xl font-black text-primary mb-[-16px] z-10">
            {currentUser.username?.[0]?.toUpperCase() || '?'}
          </div>
          <div className="pb-5 text-white">
            <h1 className="text-xl md:text-2xl font-black drop-shadow">{currentUser.username}</h1>
            <p className="text-sm text-white/80">Thành viên từ {joinDate}</p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 pt-10 mt-4">
        {/* Stats Row */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-10">
          <StatCard icon={<FaHeart />} label="Phim Yêu Thích" value={favorites.length} color="bg-pink-500" />
          <StatCard icon={<FaHistory />} label="Đã Xem" value={history.length} color="bg-blue-500" />
          <StatCard icon={<FaFilm />} label="Tập Đã Xem" value={history.length} color="bg-purple-500" />
        </div>

        {/* Watch History */}
        {history.length > 0 && (
          <div className="mb-12">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <FaHistory className="text-blue-400" /> Lịch Sử Xem
              </h2>
              <button onClick={clearHistory} className="text-xs text-red-400 hover:text-red-500 flex items-center gap-1 transition-colors">
                <FaTrash size={10} /> Xóa tất cả
              </button>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
              {history.map(item => (
                <Link
                  key={item.slug}
                  to={`/xem-phim/${item.slug}?tap=${item.lastEpisodeSlug}`}
                  className="group bg-white dark:bg-darkCard border border-gray-200 dark:border-slate-800/60 rounded-xl overflow-hidden hover:border-primary/50 transition-all hover:shadow-md block"
                >
                  <div className="relative aspect-video overflow-hidden">
                    <img src={item.thumb_url} alt={item.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex items-end p-2">
                      <span className="text-xs font-bold text-white">{item.lastEpisode}</span>
                    </div>
                  </div>
                  <div className="p-2">
                    <p className="text-gray-800 dark:text-white text-xs font-bold truncate">{item.name}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Favorites */}
        {favorites.length > 0 && (
          <div className="mb-12">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2 mb-5">
              <FaHeart className="text-pink-400" /> Phim Yêu Thích
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
              {favorites.map(movie => (
                <MovieCard key={movie.slug} movie={movie} />
              ))}
            </div>
          </div>
        )}

        {favorites.length === 0 && history.length === 0 && (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">🎬</div>
            <h3 className="text-xl font-bold text-gray-700 dark:text-gray-300 mb-2">Hồ sơ còn trống!</h3>
            <p className="text-gray-500 mb-6">Hãy xem phim và thêm yêu thích để hiển thị ở đây.</p>
            <Link to="/" className="bg-primary text-white px-6 py-3 rounded-full font-bold hover:bg-emerald-600 transition">Khám Phá Phim Ngay</Link>
          </div>
        )}

        {/* Logout */}
        <div className="pt-6 border-t border-gray-200 dark:border-slate-800">
          <button
            onClick={logout}
            className="flex items-center gap-2 text-red-500 hover:text-red-600 font-semibold transition"
          >
            <FaSignOutAlt /> Đăng Xuất
          </button>
        </div>
      </div>
    </div>
  );
};

export default Profile;
