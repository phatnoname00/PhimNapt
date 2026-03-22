import React from 'react';
import { Link, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import MovieCard from '../components/MovieCard';
import { IMAGE_URL } from '../services/api';

const Favorites = () => {
  const { currentUser } = useAuth();

  if (!currentUser) {
    return <Navigate to="/dang-nhap" />;
  }

  const favoriteMovies = currentUser.favorites || [];

  return (
    <div className="container mx-auto px-4 py-8 min-h-[70vh] relative z-10">
      <div className="mb-8 border-b border-gray-200 dark:border-slate-800 pb-4 transition-colors">
        <h1 className="text-3xl font-black text-gray-900 dark:text-white flex items-center transition-colors">
          <span className="w-1.5 h-8 bg-pink-500 mr-3 rounded-full"></span>
          Tủ Phim Của <span className="text-primary ml-2 uppercase">{currentUser.username}</span>
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2 transition-colors">
          Bạn đã lưu {favoriteMovies.length} bộ phim yêu thích.
        </p>
      </div>

      {favoriteMovies.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
          {favoriteMovies.map((movie) => (
            <MovieCard key={movie.slug} movie={movie} pathImage={IMAGE_URL} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-white dark:bg-darkCard rounded-2xl border border-gray-200 dark:border-slate-800 transition-colors glass">
          <div className="text-6xl mb-4">💔</div>
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">Tủ phim trống!</h2>
          <p className="text-gray-500 dark:text-gray-400 mb-6">Bạn chưa lưu bộ phim nào vào danh sách yêu thích.</p>
          <Link to="/" className="inline-block bg-primary hover:bg-emerald-600 text-white font-bold py-2 px-6 rounded-full transition-all shadow-lg hover:scale-105">
            Khám phá phim ngay
          </Link>
        </div>
      )}
    </div>
  );
};

export default Favorites;
