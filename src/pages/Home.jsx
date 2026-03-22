import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api, IMAGE_URL } from '../services/api';
import MovieCard from '../components/MovieCard';
import { FaPlay, FaInfoCircle, FaHistory, FaTrash, FaStar } from 'react-icons/fa';
import { useWatchHistory } from '../context/WatchHistoryContext';

// Import Swiper React components
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, EffectFade } from 'swiper/modules';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/effect-fade';

const Home = () => {
  const [movies, setMovies] = useState([]);
  const [pathImage, setPathImage] = useState(IMAGE_URL);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [loadingMore, setLoadingMore] = useState(false);
  const [topRated, setTopRated] = useState([]);
  const [topRatedPath, setTopRatedPath] = useState(IMAGE_URL);
  const { history, clearHistory } = useWatchHistory();

  useEffect(() => {
    api.getTopRatedMovies('phim-bo', 10).then(res => {
      if (res.items.length > 0) {
        setTopRated(res.items);
        if (res.cdnImage) setTopRatedPath(res.cdnImage + '/');
      }
    });
  }, []);

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        if (page === 1) setLoading(true);
        else setLoadingMore(true);
        
        const data = await api.getNewMovies(page);
        if (data && data.items) {
          if (page === 1) {
            setMovies(data.items);
            if (data.pathImage) setPathImage(data.pathImage);
          } else {
            setMovies(prev => [...prev, ...data.items]);
          }
        }
      } catch (error) {
        console.error('Lỗi khi lấy danh sách phim:', error);
      } finally {
        setLoading(false);
        setLoadingMore(false);
      }
    };

    fetchMovies();
  }, [page]);

  const handleLoadMore = () => {
    setPage(prev => prev + 1);
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-primary"></div>
      </div>
    );
  }

  // Sử dụng 5 phim đầu tiên cho Slider nổi bật
  const featuredMovies = movies.slice(0, 5);
  // Danh sách phim còn lại
  const gridMovies = movies.slice(5);

  return (
    <div className="pb-12">
      {/* Hero Slider */}
      <div className="w-full relative h-[60vh] md:h-[80vh]">
        <Swiper
          modules={[Autoplay, Pagination, EffectFade]}
          effect="fade"
          autoplay={{ delay: 5000, disableOnInteraction: false }}
          pagination={{ clickable: true }}
          loop={true}
          className="w-full h-full"
        >
          {featuredMovies.map((movie) => {
            const bgUrl = movie.thumb_url.startsWith('http') 
              ? movie.thumb_url 
              : `${pathImage}${movie.poster_url || movie.thumb_url}`;
            
            return (
              <SwiperSlide key={movie.slug}>
                <div className="relative w-full h-full">
                  {/* Background Image */}
                  <div 
                    className="absolute inset-0 bg-cover bg-center"
                    style={{ backgroundImage: `url(${bgUrl})` }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-t from-darkBg via-darkBg/60 to-transparent"></div>
                    <div className="absolute inset-0 bg-gradient-to-r from-darkBg/90 via-darkBg/50 to-transparent divide-y-0"></div>
                  </div>

                  {/* Content */}
                  <div className="absolute bottom-0 left-0 w-full p-8 md:p-16 flex flex-col justify-end h-full">
                    <div className="container mx-auto">
                      <div className="max-w-2xl">
                        <div className="bg-primary text-white text-xs font-bold uppercase tracking-wider py-1 px-3 inline-block rounded mb-4 animate-[fadeInUp_1s_ease-out] shadow-lg">
                          Phim NAPT Thịnh Hành
                        </div>
                        <h1 className="text-4xl md:text-6xl font-black text-white mb-2 leading-tight drop-shadow-2xl">
                          {movie.name}
                        </h1>
                        <h2 className="text-xl md:text-2xl text-gray-200 font-medium mb-6 drop-shadow-lg">
                          {movie.origin_name} ({movie.year || '2026'})
                        </h2>
                        
                        <div className="flex space-x-4">
                          <Link 
                            to={`/xem-phim/${movie.slug}`} 
                            className="bg-primary hover:bg-emerald-600 text-white px-6 py-3 rounded-full font-bold flex items-center transition-all hover:scale-105 shadow-[0_4px_15px_rgba(16,185,129,0.4)]"
                          >
                            <FaPlay className="mr-2" /> Xem Ngay
                          </Link>
                          <Link 
                            to={`/phim/${movie.slug}`}
                            className="glass text-white px-6 py-3 rounded-full font-bold flex items-center hover:bg-white/20 transition-all hover:scale-105"
                          >
                            <FaInfoCircle className="mr-2" /> Chi Tiết
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </SwiperSlide>
            );
          })}
        </Swiper>
      </div>

      {/* Continue Watching Section */}
      {history.length > 0 && (
        <div className="container mx-auto px-4 mt-10">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-xl md:text-2xl font-bold flex items-center text-gray-900 dark:text-white transition-colors">
              <FaHistory className="text-primary mr-3" />
              Đang Xem Dở
            </h2>
            <button onClick={clearHistory} className="text-xs text-red-400 hover:text-red-500 flex items-center gap-1 transition-colors">
              <FaTrash size={10} /> Xóa lịch sử
            </button>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
            {history.slice(0, 6).map(item => (
              <Link 
                key={item.slug} 
                to={`/xem-phim/${item.slug}?tap=${item.lastEpisodeSlug}`}
                className="group bg-white dark:bg-darkCard border border-gray-200 dark:border-slate-800/60 rounded-xl overflow-hidden hover:border-primary/50 transition-all hover:shadow-lg hover:shadow-primary/10 hover:scale-[1.02] block"
              >
                <div className="relative aspect-video overflow-hidden">
                  <img src={item.thumb_url} alt={item.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex items-end p-2">
                    <span className="text-xs font-bold text-white">{item.lastEpisode}</span>
                  </div>
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="w-10 h-10 bg-primary/90 rounded-full flex items-center justify-center">
                      <FaPlay className="text-white ml-0.5" size={14} />
                    </div>
                  </div>
                </div>
                <div className="p-2">
                  <p className="text-gray-800 dark:text-white text-xs font-bold truncate">{item.name}</p>
                  <p className="text-gray-500 dark:text-gray-400 text-[10px] truncate mt-0.5">{item.origin_name}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Top Rated Movies Section */}
      {topRated.length > 0 && (
        <div className="container mx-auto px-4 mt-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl md:text-3xl font-bold flex items-center text-gray-900 dark:text-white transition-colors">
              <span className="w-1.5 h-8 bg-yellow-400 mr-3 rounded-full"></span>
              ⭐ Phim Đánh Giá Cao
            </h2>
            <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">Theo TMDB</span>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
            {topRated.map((movie) => (
              <div key={movie.slug} className="relative">
                {/* Rating badge */}
                <div className="absolute top-2 left-2 z-20 bg-yellow-400 text-black text-xs font-black px-2 py-0.5 rounded-full flex items-center gap-1 shadow-lg">
                  <FaStar size={10} />{movie.tmdb?.vote_average?.toFixed(1)}
                </div>
                <MovieCard movie={movie} pathImage={topRatedPath} />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Movie Grid Section */}
      <div className="container mx-auto px-4 mt-12 md:mt-20">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl md:text-3xl font-bold flex items-center text-gray-900 dark:text-white transition-colors">
            <span className="w-1.5 h-8 bg-primary mr-3 rounded-full"></span>
            Phim Mới Cập Nhật
          </h2>
          <Link to="#" className="text-primary hover:text-emerald-500 transition font-medium hidden md:block">
            Xem Tất Cả &raquo;
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
          {gridMovies.map((movie) => (
            <MovieCard key={movie.slug} movie={movie} pathImage={pathImage} />
          ))}
        </div>

        {/* Load More Button */}
        <div className="flex justify-center mt-12 mb-8">
          <button 
            onClick={handleLoadMore}
            disabled={loadingMore}
            className="px-8 py-3 rounded-full font-bold bg-darkCard border border-primary text-primary hover:bg-primary hover:text-white transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_4px_15px_rgba(16,185,129,0.2)]"
          >
            {loadingMore ? 'Đang tải...' : 'Tải Thêm Phim'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Home;
