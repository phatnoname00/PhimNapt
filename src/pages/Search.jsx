import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { api, IMAGE_URL } from '../services/api';
import MovieCard from '../components/MovieCard';

const Search = () => {
  const [searchParams] = useSearchParams();
  const keyword = searchParams.get('keyword');
  
  const [movies, setMovies] = useState([]);
  const [pathImage, setPathImage] = useState(IMAGE_URL);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchSearchResults = async () => {
      if (!keyword) return;
      
      try {
        setLoading(true);
        const data = await api.searchMovies(keyword);
        if (data && data.data && data.data.items) {
          setMovies(data.data.items);
          if (data.data.APP_DOMAIN_CDN_IMAGE) setPathImage(data.data.APP_DOMAIN_CDN_IMAGE + '/');
        } else {
          setMovies([]);
        }
      } catch (error) {
        console.error('Lỗi khi tìm kiếm phim:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSearchResults();
  }, [keyword]);

  return (
    <div className="container mx-auto px-4 py-8 min-h-[70vh]">
      <div className="mb-8 border-b border-gray-200 dark:border-slate-800 pb-4 transition-colors relative z-10">
        <h1 className="text-2xl md:text-4xl font-black text-gray-900 dark:text-white transition-colors">
          Kết Quả: <span className="text-primary tracking-tight">"{keyword}"</span>
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2 font-medium transition-colors">
          Tìm thấy <span className="text-primary">{movies.length}</span> bộ phim phù hợp với từ khóa của bạn.
        </p>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center my-32">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-primary mb-4"></div>
          <p className="text-gray-500 font-medium">Đang lục tìm kho phim...</p>
        </div>
      ) : movies.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-8 relative z-10 px-0.5">
          {movies.map((movie) => (
            <MovieCard key={movie.slug} movie={movie} pathImage={pathImage} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-white dark:bg-darkCard rounded-2xl border border-gray-200 dark:border-slate-800 transition-colors">
          <h2 className="text-xl text-gray-800 dark:text-white mb-2">Không tìm thấy bộ phim nào!</h2>
          <p className="text-gray-500 dark:text-gray-400">Vui lòng thử lại với từ khóa khác.</p>
        </div>
      )}
    </div>
  );
};

export default Search;
