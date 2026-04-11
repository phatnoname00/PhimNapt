import React, { useEffect, useState } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import { api, IMAGE_URL } from '../services/api';
import MovieCard from '../components/MovieCard';
import { FaLayerGroup, FaChevronRight } from 'react-icons/fa';

const CategoryPage = () => {
  const { category, type } = useParams();
  const location = useLocation();
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [loadingMore, setLoadingMore] = useState(false);
  const [title, setTitle] = useState('');
  const [pathImage, setPathImage] = useState(IMAGE_URL);

  const isGenre = location.pathname.includes('/the-loai/');

  useEffect(() => {
    // Reset when category changes
    setMovies([]);
    setPage(1);
    
    // Set Title
    if (isGenre) {
      const genreMap = {
        'hanh-dong': 'Phim Hành Động',
        'tinh-cam': 'Phim Tình Cảm',
        'hai-huoc': 'Phim Hài Hước',
        'co-trang': 'Phim Cổ Trang',
        'tam-ly': 'Phim Tâm Lý',
        'hinh-su': 'Phim Hình Sự',
        'vien-tuong': 'Phim Viễn Tưởng',
        'kinh-di': 'Phim Kinh Dị',
        'hoat-hinh': 'Phim Hoạt Hình',
        'vo-thuat': 'Phim Võ Thuật'
      };
      setTitle(genreMap[category] || 'Thể Loại Phim');
    } else {
      const typeMap = {
        'phim-le': 'Phim Lẻ Mới',
        'phim-bo': 'Phim Bộ Mới',
        'hoat-hinh': 'Phim Anime - Hoạt Hình'
      };
      setTitle(typeMap[type] || 'Danh Sách Phim');
    }
  }, [category, type, isGenre]);

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        if (page === 1) setLoading(true);
        else setLoadingMore(true);

        let data;
        if (isGenre) {
          data = await api.getMoviesByCategory(category, page);
        } else {
          data = await api.getMoviesByType(type, page);
        }

        if (data && data.data?.items) {
          if (page === 1) {
            setMovies(data.data.items);
            if (data.data.APP_DOMAIN_CDN_IMAGE) {
                // Chỉ lấy domain gốc, MovieCard sẽ tự thêm /uploads/movies/
                setPathImage(data.data.APP_DOMAIN_CDN_IMAGE);
            }
          } else {
            setMovies(prev => [...prev, ...data.data.items]);
          }
        }
      } catch (error) {
        console.error('Error fetching movies:', error);
      } finally {
        setLoading(false);
        setLoadingMore(false);
      }
    };

    fetchMovies();
  }, [category, type, page, isGenre]);

  const handleLoadMore = () => {
    setPage(prev => prev + 1);
  };

  if (loading && page === 1) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumb / Title */}
      <div className="flex items-center gap-2 text-sm text-gray-500 mb-6 bg-white/5 dark:bg-darkCard/50 p-3 rounded-lg border border-gray-200 dark:border-slate-800">
        <FaLayerGroup className="text-primary" />
        <span>Trang chủ</span>
        <FaChevronRight size={10} />
        <span className="text-gray-900 dark:text-white font-bold">{title}</span>
      </div>

      <h1 className="text-3xl font-black text-gray-900 dark:text-white mb-8 flex items-center">
        <span className="w-1.5 h-8 bg-primary mr-3 rounded-full"></span>
        {title}
      </h1>

      {movies.length > 0 ? (
        <>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-7 gap-4 md:gap-5">
            {movies.map((movie) => (
              <MovieCard key={movie.slug} movie={movie} pathImage={pathImage} />
            ))}
          </div>

          {/* Load More */}
          <div className="flex justify-center mt-12 mb-8">
            <button 
              onClick={handleLoadMore}
              disabled={loadingMore}
              className="px-8 py-3 rounded-full font-bold bg-darkCard border border-primary text-primary hover:bg-primary hover:text-white transition-all duration-300 disabled:opacity-50 shadow-lg"
            >
              {loadingMore ? 'Đang tải...' : 'Xem Thêm Kết Quả'}
            </button>
          </div>
        </>
      ) : (
        <div className="text-center py-20 bg-white/5 dark:bg-darkCard/30 rounded-2xl border border-dashed border-gray-300 dark:border-slate-800">
          <p className="text-gray-500 mb-4 whitespace-pre-line">
            Hiện chưa có phim nào trong mục này.{'\n'}Vui lòng quay lại sau!
          </p>
        </div>
      )}
    </div>
  );
};

export default CategoryPage;
