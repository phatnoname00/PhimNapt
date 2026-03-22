import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { api } from '../services/api';
import { FaPlay, FaCalendarAlt, FaClock, FaLanguage, FaTags, FaHeart, FaRegHeart, FaGlobe, FaSpinner } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import MovieNotifyButton from '../components/MovieNotifyButton';

const translateText = async (text) => {
  try {
    // Strip HTML tags first
    const plain = text.replace(/<[^>]*>/g, '').substring(0, 500);
    const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(plain)}&langpair=en|vi`;
    const res = await fetch(url);
    const data = await res.json();
    return data?.responseData?.translatedText || text;
  } catch {
    return text;
  }
};

const MovieDetails = () => {
  const { slug } = useParams();
  const [movieData, setMovieData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [translatedContent, setTranslatedContent] = useState(null);
  const [translating, setTranslating] = useState(false);
  const { currentUser, toggleFavorite, isFavorite } = useAuth();

  const handleTranslate = async (content) => {
    setTranslating(true);
    const result = await translateText(content);
    setTranslatedContent(result);
    setTranslating(false);
  };

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        setLoading(true);
        const data = await api.getMovieDetails(slug);
        if (data && data.status) {
          setMovieData(data);
        }
      } catch (error) {
        console.error('Lỗi khi lấy chi tiết phim:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchDetails();
    window.scrollTo(0, 0);
  }, [slug]);

  if (loading) return (
    <div className="flex h-screen items-center justify-center">
      <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-primary"></div>
    </div>
  );

  if (!movieData) return <div className="text-center text-white mt-20">Không tìm thấy thông tin phim.</div>;

  const { movie, episodes } = movieData;
  const hasEpisodes = episodes && episodes.length > 0 && episodes[0].server_data.length > 0;
  const firstEpisodeSlug = hasEpisodes ? episodes[0].server_data[0].slug : '';

  return (
    <div className="pb-16 min-h-screen">
      {/* Backdrop Section */}
      <div className="relative w-full h-[50vh] md:h-[60vh]">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${movie.poster_url})` }}
        >
          {/* Gradient Overlay for dark immersive feeling */}
          <div className="absolute inset-0 bg-gradient-to-t from-darkBg via-darkBg/80 to-transparent"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-darkBg/90 via-darkBg/40 to-transparent"></div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="container mx-auto px-4 -mt-32 md:-mt-48 relative z-10">
        <div className="flex flex-col md:flex-row gap-8">
          
          {/* Left Column - Poster */}
          <div className="w-full md:w-1/4 lg:w-1/5 flex-shrink-0">
            <div className="rounded-xl overflow-hidden shadow-[0_10px_30px_rgba(0,0,0,0.5)] border border-gray-200 dark:border-slate-700/50 bg-white dark:bg-darkCard group relative z-10 glass">
              <img 
                src={movie.thumb_url} 
                alt={movie.name} 
                className="w-full h-auto object-cover"
              />
              <div className="flex flex-col">
                {hasEpisodes && (
                  <Link 
                    to={`/xem-phim/${slug}?tap=${firstEpisodeSlug}`}
                    className="w-full text-center py-4 bg-primary hover:bg-emerald-600 text-white font-bold transition-all text-lg flex items-center justify-center"
                  >
                    <FaPlay className="mr-2" /> XEM PHIM
                  </Link>
                )}
                {currentUser ? (
                  <button
                    onClick={() => toggleFavorite(movie)}
                    className={`w-full py-3 flex items-center justify-center font-bold transition-all border-t border-gray-200 dark:border-slate-700 ${
                      isFavorite(slug) 
                      ? 'text-pink-500 bg-pink-500/10' 
                      : 'text-gray-600 dark:text-gray-300 hover:text-pink-500'
                    }`}
                  >
                    {isFavorite(slug) ? <FaHeart className="mr-2" /> : <FaRegHeart className="mr-2" />}
                    {isFavorite(slug) ? 'ĐÃ LƯU' : 'YÊU THÍCH'}
                  </button>
                ) : (
                  <Link
                    to="/dang-nhap"
                    className="w-full py-3 flex items-center justify-center font-bold transition-all border-t border-gray-200 dark:border-slate-700 text-gray-500 dark:text-gray-400 hover:text-primary text-sm"
                  >
                    <FaRegHeart className="mr-2" /> Đăng nhập để lưu yêu thích
                  </Link>
                )}
                {/* Notification for new episode */}
                <div className="px-3 py-2 border-t border-gray-200 dark:border-slate-700">
                  <MovieNotifyButton movie={movie} />
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Info */}
          <div className="w-full md:w-3/4 lg:w-4/5 pt-4 md:pt-16">
            <h1 className="text-3xl md:text-5xl font-black text-gray-900 dark:text-white mb-2 drop-shadow-md transition-colors">
              {movie.name}
            </h1>
            <h2 className="text-xl text-gray-600 dark:text-gray-400 mb-6 font-medium transition-colors">
              {movie.origin_name} ({movie.year})
            </h2>

            {/* Quick Stats */}
            <div className="flex flex-wrap gap-4 mb-8">
              <div className="bg-white/50 dark:bg-slate-800/80 backdrop-blur border border-gray-200 dark:border-slate-700 rounded-lg px-4 py-2 flex items-center text-sm text-gray-800 dark:text-white shadow-sm transition-colors">
                <FaClock className="text-primary mr-2" /> {movie.time || 'Đang cập nhật'}
              </div>
              <div className="bg-white/50 dark:bg-slate-800/80 backdrop-blur border border-gray-200 dark:border-slate-700 rounded-lg px-4 py-2 flex items-center text-sm text-gray-800 dark:text-white shadow-sm transition-colors">
                <FaCalendarAlt className="text-primary mr-2" /> {movie.episode_current || '?'} / {movie.episode_total || '?'} Tập
              </div>
              <div className="bg-white/50 dark:bg-slate-800/80 backdrop-blur border border-gray-200 dark:border-slate-700 rounded-lg px-4 py-2 flex items-center text-sm text-gray-800 dark:text-white shadow-sm transition-colors">
                <FaLanguage className="text-primary mr-2" /> {movie.quality} - {movie.lang}
              </div>
              <div className="bg-white/50 dark:bg-slate-800/80 backdrop-blur border border-gray-200 dark:border-slate-700 rounded-lg px-4 py-2 flex items-center text-sm text-gray-800 dark:text-white shadow-sm transition-colors">
                <FaTags className="text-primary mr-2" /> 
                {movie.category && movie.category.map(c => c.name).join(', ')}
              </div>
            </div>

            {/* Synopsis */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white flex items-center transition-colors">
                  <span className="w-1 h-6 bg-primary mr-2 rounded"></span>
                  Nội Dung Phim
                </h3>
                {movie.content && (
                  <button
                    onClick={() => translatedContent ? setTranslatedContent(null) : handleTranslate(movie.content)}
                    disabled={translating}
                    className="flex items-center gap-1.5 text-xs font-semibold text-primary border border-primary rounded-full px-3 py-1 hover:bg-primary hover:text-white transition-all disabled:opacity-60"
                  >
                    {translating ? <FaSpinner className="animate-spin" /> : <FaGlobe />}
                    {translating ? 'Đang dịch...' : translatedContent ? 'Xem gốc' : '🇻🇳 Dịch sang Tiếng Việt'}
                  </button>
                )}
              </div>
              <div 
                className="text-gray-700 dark:text-gray-300 leading-relaxed text-sm md:text-base opacity-90 transition-colors"
                dangerouslySetInnerHTML={{ __html: translatedContent || movie.content }}
              ></div>
            </div>

            {/* Cast & Crew */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="text-gray-600 dark:text-gray-400 font-semibold mb-2 transition-colors">Đạo diễn:</h4>
                <p className="text-gray-800 dark:text-white transition-colors">{movie.director?.join(', ') || 'Đang cập nhật'}</p>
              </div>
              <div>
                <h4 className="text-gray-600 dark:text-gray-400 font-semibold mb-2 transition-colors">Diễn viên:</h4>
                <p className="text-gray-800 dark:text-white transition-colors">{movie.actor?.join(', ') || 'Đang cập nhật'}</p>
              </div>
            </div>
            
          </div>
        </div>
      </div>
    </div>
  );
};

export default MovieDetails;
