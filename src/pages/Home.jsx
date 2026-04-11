import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api, IMAGE_URL } from '../services/api';
import MovieCard from '../components/MovieCard';
import { FaPlay, FaInfoCircle, FaHistory, FaTrash, FaStar, FaFilm } from 'react-icons/fa';
import { useWatchHistory } from '../context/WatchHistoryContext';

// Import Swiper
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, EffectFade } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/effect-fade';

// ==================== Skeleton Card ====================
const SkeletonCard = () => (
  <div className="bg-gray-200 dark:bg-slate-800 rounded-xl overflow-hidden animate-pulse">
    <div className="aspect-[2/3] bg-gray-300 dark:bg-slate-700" />
    <div className="p-2 space-y-1">
      <div className="h-3 bg-gray-300 dark:bg-slate-700 rounded w-4/5" />
      <div className="h-2 bg-gray-300 dark:bg-slate-700 rounded w-3/5" />
    </div>
  </div>
);

const SkeletonGrid = ({ count = 7 }) => (
  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 xl:grid-cols-7 gap-4">
    {Array.from({ length: count }).map((_, i) => <SkeletonCard key={i} />)}
  </div>
);

// ==================== Section Header ====================
const SectionHeader = ({ color = 'bg-primary', children, right }) => (
  <div className="flex items-center justify-between mb-6">
    <h2 className="text-2xl md:text-3xl font-bold flex items-center text-gray-900 dark:text-white transition-colors">
      <span className={`w-1.5 h-8 ${color} mr-3 rounded-full`} />
      {children}
    </h2>
    {right}
  </div>
);

// ==================== HOME ====================
const Home = () => {
  const [movies, setMovies] = useState([]);
  const [anime, setAnime] = useState([]);
  const [animePath, setAnimePath] = useState(IMAGE_URL);
  const [pathImage, setPathImage] = useState(IMAGE_URL);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [loadingMore, setLoadingMore] = useState(false);
  const [topRated, setTopRated] = useState([]);
  const [topRatedPath, setTopRatedPath] = useState(IMAGE_URL);
  const { history, clearHistory } = useWatchHistory();

  // ✅ Fetch homepage data song song (parallel)
  useEffect(() => {
    const loadHome = async () => {
      setLoading(true);
      try {
        const data = await api.getHomepageData();

        // Phim mới
        if (data.newMovies?.items) {
          setMovies(data.newMovies.items);
          if (data.newMovies.pathImage) setPathImage(data.newMovies.pathImage);
        }

        // Anime
        if (data.anime?.data?.items) {
          setAnime(data.anime.data.items.slice(0, 12));
          const cdnAnime = data.anime.data.APP_DOMAIN_CDN_IMAGE;
          if (cdnAnime) setAnimePath(cdnAnime + '/');
        }

        // Top rated
        if (data.topRatedRaw?.data?.items) {
          const items = data.topRatedRaw.data.items
            .filter(m => m.tmdb?.vote_average > 0)
            .sort((a, b) => (b.tmdb?.vote_average || 0) - (a.tmdb?.vote_average || 0))
            .slice(0, 10);
          const cdnImage = data.topRatedRaw.data.APP_DOMAIN_CDN_IMAGE || IMAGE_URL;
          setTopRated(items);
          if (cdnImage) setTopRatedPath(cdnImage + '/');
        }
      } catch (err) {
        console.error('Lỗi load homepage:', err);
      } finally {
        setLoading(false);
      }
    };
    loadHome();
  }, []);

  // Load more phim
  useEffect(() => {
    if (page === 1) return;
    const fetchMore = async () => {
      setLoadingMore(true);
      try {
        const data = await api.getNewMovies(page);
        if (data?.items) {
          setMovies(prev => [...prev, ...data.items]);
        }
      } catch (err) {
        console.error('Lỗi tải thêm phim:', err);
      } finally {
        setLoadingMore(false);
      }
    };
    fetchMore();
  }, [page]);

  // Skeleton loading toàn trang
  if (loading) {
    return (
      <div className="pb-12">
        {/* Hero skeleton */}
        <div className="w-full h-[45vh] md:h-[60vh] bg-gray-200 dark:bg-slate-800 animate-pulse" />
        <div className="container mx-auto px-4 mt-12 space-y-10">
          <SkeletonGrid count={10} />
          <SkeletonGrid count={7} />
        </div>
      </div>
    );
  }

  const featuredMovies = movies.slice(0, 5);
  const gridMovies = movies.slice(5);

  return (
    <div className="pb-12">
      {/* ==================== Hero Slider ==================== */}
      <div className="w-full relative h-[45vh] md:h-[60vh]">
        <Swiper
          modules={[Autoplay, Pagination, EffectFade]}
          effect="fade"
          autoplay={{ delay: 5000, disableOnInteraction: false }}
          pagination={{ clickable: true }}
          loop={true}
          className="w-full h-full"
        >
          {featuredMovies.map((movie) => {
            const bgUrl = (() => {
              if (movie.thumb_url?.startsWith('http')) return movie.thumb_url;
              const base = pathImage || 'https://phimimg.com/';
              const path = movie.thumb_url || movie.poster_url || '';
              const finalBase = base.endsWith('/') ? base : `${base}/`;
              const cleanPath = path.startsWith('/') ? path.substring(1) : path;
              if (cleanPath.startsWith('upload/') || cleanPath.includes('uploads/movies/')) {
                const rootBase = finalBase.includes('/uploads/movies/') ? finalBase.split('/uploads/')[0] + '/' : finalBase;
                return `${rootBase}${cleanPath}`;
              }
              if (!finalBase.includes('uploads/movies')) {
                return `${finalBase}uploads/movies/${cleanPath}`;
              }
              return `${finalBase}${cleanPath}`;
            })();
            return (
              <SwiperSlide key={movie.slug}>
                <div className="relative w-full h-full">
                  <div
                    className="absolute inset-0 bg-cover bg-center"
                    style={{ backgroundImage: `url(${bgUrl})` }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-t from-darkBg via-darkBg/60 to-transparent" />
                    <div className="absolute inset-0 bg-gradient-to-r from-darkBg/90 via-darkBg/50 to-transparent" />
                  </div>
                  <div className="absolute bottom-0 left-0 w-full p-8 md:p-16 flex flex-col justify-end h-full">
                    <div className="container mx-auto">
                      <div className="max-w-2xl">
                        <div className="bg-primary text-white text-xs font-bold uppercase tracking-wider py-1 px-3 inline-block rounded mb-4 shadow-lg">
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

      {/* ==================== Đang Xem Dở ==================== */}
      {history.length > 0 && (
        <div className="container mx-auto px-4 mt-10">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-xl md:text-2xl font-bold flex items-center text-gray-900 dark:text-white transition-colors">
              <FaHistory className="text-primary mr-3" /> Đang Xem Dở
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

      {/* ==================== Top Rated ==================== */}
      {topRated.length > 0 && (
        <div className="container mx-auto px-4 mt-12">
          <SectionHeader color="bg-yellow-400" right={<span className="text-xs text-gray-500 dark:text-gray-400 font-medium">Theo TMDB</span>}>
            ⭐ Phim Đánh Giá Cao
          </SectionHeader>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 xl:grid-cols-7 gap-4 md:gap-5">
            {topRated.map((movie) => (
              <div key={movie.slug} className="relative">
                <div className="absolute top-2 left-2 z-20 bg-yellow-400 text-black text-xs font-black px-2 py-0.5 rounded-full flex items-center gap-1 shadow-lg">
                  <FaStar size={10} />{movie.tmdb?.vote_average?.toFixed(1)}
                </div>
                <MovieCard movie={movie} pathImage={topRatedPath} />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ==================== 🎌 Anime Section ==================== */}
      {anime.length > 0 && (
        <div className="container mx-auto px-4 mt-12">
          <SectionHeader color="bg-purple-500" right={
            <Link to="/danh-sach/hoat-hinh" className="text-purple-400 hover:text-purple-300 transition font-medium hidden md:block text-sm">
              Xem Tất Cả »
            </Link>
          }>
            🎌 Anime Mới Nhất
          </SectionHeader>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-5">
            {anime.map((movie) => (
              <MovieCard key={movie.slug} movie={movie} pathImage={animePath} />
            ))}
          </div>
        </div>
      )}

      {/* ==================== Phim Mới Cập Nhật ==================== */}
      <div className="container mx-auto px-4 mt-12 md:mt-16">
        <SectionHeader right={
          <Link to="#" className="text-primary hover:text-emerald-500 transition font-medium hidden md:block">
            Xem Tất Cả »
          </Link>
        }>
          <FaFilm className="text-primary mr-3 text-2xl" /> Phim Mới Cập Nhật
        </SectionHeader>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 xl:grid-cols-7 gap-4 md:gap-5">
          {gridMovies.map((movie) => (
            <MovieCard key={movie.slug} movie={movie} pathImage={pathImage} />
          ))}
        </div>

        <div className="flex justify-center mt-12 mb-8">
          <button
            onClick={() => setPage(prev => prev + 1)}
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
