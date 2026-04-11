import React, { useEffect, useState, useRef } from 'react';
import { useParams, useSearchParams, Link } from 'react-router-dom';
import { api } from '../services/api';
import ReactPlayer from 'react-player';
import { FaPlay, FaServer, FaInfoCircle } from 'react-icons/fa';
import { useWatchHistory } from '../context/WatchHistoryContext';

const WatchMovie = () => {
  const { slug } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const [movieData, setMovieData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentEpisode, setCurrentEpisode] = useState(null);
  const [currentServer, setCurrentServer] = useState(0);
  const [playerType, setPlayerType] = useState('embed'); // 'embed' | 'm3u8'
  const [langFilter, setLangFilter] = useState('all');
  const [source, setSource] = useState('kkphim'); // 'kkphim' | 'ophim'
  const [hlsLevels, setHlsLevels] = useState([]);
  const [currentLevel, setCurrentLevel] = useState(-1); // -1 = Auto

  const { addToHistory } = useWatchHistory();
  const playerRef = useRef(null);
  const watchSectionRef = useRef(null);

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        setLoading(true);
        const data = source === 'kkphim' 
          ? await api.getMovieDetails(slug)
          : await api.getMovieDetailsOphim(slug);
        
        if (data && data.status === true && data.movie) {
          setMovieData(data);
          
          const epSlugFromUrl = searchParams.get('tap');
          const servers = data.episodes;
          
          if (servers && servers.length > 0) {
            const serverData = servers[0].server_data;
            if (serverData && serverData.length > 0) {
              const ep = epSlugFromUrl 
                ? serverData.find(e => e.slug === epSlugFromUrl) || serverData[0] 
                : serverData[0];
              setCurrentEpisode(ep);
              // Auto save to history on first load
              addToHistory(data.movie, ep);
            }
          }
        } else {
          console.error('KKPhim trả về kết quả lỗi:', data);
        }
      } catch (error) {
        console.error('Lỗi khi lấy chi tiết phim:', error);
      } finally {
        setLoading(false);
        setTimeout(() => {
          if (watchSectionRef.current) {
            watchSectionRef.current.scrollIntoView({ behavior: 'smooth' });
          }
        }, 100);
      }
    };
    fetchDetails();
  }, [slug, source]); // Refetch khi slug hoặc source thay đổi

  const handleEpisodeChange = (ep) => {
    setCurrentEpisode(ep);
    setSearchParams({ tap: ep.slug });
    if (movieData?.movie) addToHistory(movieData.movie, ep);
    if (watchSectionRef.current) {
      watchSectionRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  if (loading) return (
    <div className="flex h-screen items-center justify-center bg-gray-100 dark:bg-darkBg">
      <div className="flex flex-col items-center gap-4">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-primary"></div>
        <p className="text-gray-600 dark:text-gray-400 font-medium">Đang tải phim...</p>
      </div>
    </div>
  );

  if (!movieData || !currentEpisode) return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
      <div className="text-5xl mb-4">🎬</div>
      <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-2">Không tìm thấy tập phim!</h2>
      <p className="text-gray-500 dark:text-gray-400">Phim này có thể chưa có sẵn hoặc đường link bị lỗi.</p>
    </div>
  );

  const { movie, episodes } = movieData;
  const currentServerName = episodes[currentServer]?.server_name || '';

  // Language filter helpers
  const LANG_OPTIONS = [
    { key: 'all', label: 'Đầy đủ', color: 'bg-slate-700 text-gray-200' },
    { key: 'vietsub', label: '🇻🇳 Vietsub', matchFn: (name) => name.toLowerCase().includes('vietsub') },
    { key: 'engsub', label: '🇺🇸 Engsub', matchFn: (name) => name.toLowerCase().includes('engsub') || name.toLowerCase().includes('eng') },
    { key: 'thuyet-minh', label: '🔊 Thuyết Minh', matchFn: (name) => name.toLowerCase().includes('thuyết minh') || name.toLowerCase().includes('thuyet minh') || name.toLowerCase().includes('lồng tiếng') },
    { key: 'raw', label: '🎙️ Raw (Gốc)', matchFn: (name) => name.toLowerCase().includes('raw') || name.toLowerCase().includes('góc') || name.toLowerCase().includes('origin') },
  ];

  const filteredServers = langFilter === 'all'
    ? episodes
    : episodes.filter(s => {
        const option = LANG_OPTIONS.find(o => o.key === langFilter);
        return option?.matchFn ? option.matchFn(s.server_name) : true;
      });

  const activeEpisodeList = filteredServers.length > 0 ? filteredServers : episodes;

  return (
    <div className="pb-16 min-h-screen bg-gray-100 dark:bg-darkBg transition-colors" ref={watchSectionRef}>
      
      {/* Video Player Section */}
      <div className="w-full bg-black shadow-2xl relative border-b border-primary/20">
        <div className="container mx-auto max-w-6xl aspect-video lg:py-6">
          <div className="w-full h-full bg-black rounded-lg overflow-hidden border border-slate-800 shadow-[0_0_30px_rgba(0,0,0,0.8)] relative">
            {playerType === 'embed' ? (
              <iframe 
                key={currentEpisode.slug + source}
                src={currentEpisode.link_embed} 
                width="100%" 
                height="100%" 
                frameBorder="0" 
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen={true}
                title={`${movieData.movie.name} - Tập ${currentEpisode.name}`}
                className="absolute inset-0 w-full h-full"
                referrerPolicy="no-referrer"
              ></iframe>
            ) : (
              <ReactPlayer 
                ref={playerRef}
                key={currentEpisode.slug + source}
                url={currentEpisode.link_m3u8}
                width="100%"
                height="100%"
                controls={true}
                playing={true}
                onReady={(player) => {
                  const hls = player.getInternalPlayer('hls');
                  if (hls) {
                    setHlsLevels(hls.levels || []);
                    setCurrentLevel(hls.currentLevel);
                  }
                }}
                config={{
                  file: {
                    forceHLS: true,
                    attributes: {
                      crossOrigin: 'anonymous'
                    }
                  }
                }}
              />
            )}
          </div>
          
          {/* Quality & Source & Player Type Controls */}
          <div className="mt-4 px-2 lg:px-0 space-y-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-center gap-3 flex-wrap">
                <span className="text-xs text-gray-400 font-semibold uppercase tracking-widest">🚀 Nguồn:</span>
                <button 
                  onClick={() => setSource('kkphim')}
                  className={`px-3 py-1 text-xs rounded-full font-bold transition-all ${source === 'kkphim' ? 'bg-indigo-600 text-white' : 'bg-gray-800 text-gray-400'}`}
                >
                  Server #1 (KKPhim)
                </button>
                <button 
                  onClick={() => setSource('ophim')}
                  className={`px-3 py-1 text-xs rounded-full font-bold transition-all ${source === 'ophim' ? 'bg-orange-600 text-white' : 'bg-gray-800 text-gray-400'}`}
                >
                  Server #2 (Ophim)
                </button>
              </div>

              <div className="flex items-center gap-2">
                <button 
                  onClick={() => setPlayerType('embed')}
                  className={`px-3 py-1 text-xs rounded font-medium transition ${playerType === 'embed' ? 'bg-primary text-white' : 'bg-gray-800 text-gray-400 hover:text-white'}`}
                >
                  Dùng Iframe (Gốc)
                </button>
                <button 
                  onClick={() => setPlayerType('m3u8')}
                  className={`px-3 py-1 text-xs rounded font-medium transition ${playerType === 'm3u8' ? 'bg-primary text-white' : 'bg-gray-800 text-gray-400 hover:text-white'}`}
                >
                  Dùng M3U8 (Tùy chỉnh)
                </button>
              </div>
            </div>

            {/* Quality Selector (Only for M3U8) */}
            {playerType === 'm3u8' && hlsLevels.length > 0 && (
              <div className="flex items-center gap-2 flex-wrap bg-darkCard/50 p-2 rounded-lg border border-slate-800">
                <span className="text-xs text-gray-400 font-semibold uppercase tracking-widest shrink-0">🎬 Chất lượng:</span>
                <button
                  onClick={() => {
                    const hls = playerRef.current?.getInternalPlayer('hls');
                    if (hls) hls.currentLevel = -1;
                    setCurrentLevel(-1);
                  }}
                  className={`px-2 py-1 text-[10px] md:text-xs rounded font-bold transition-all ${currentLevel === -1 ? 'bg-emerald-500 text-white' : 'bg-slate-700 text-gray-400'}`}
                >
                  Tự động
                </button>
                {hlsLevels.map((level, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      const hls = playerRef.current?.getInternalPlayer('hls');
                      if (hls) hls.currentLevel = idx;
                      setCurrentLevel(idx);
                    }}
                    className={`px-2 py-1 text-[10px] md:text-xs rounded font-bold transition-all ${currentLevel === idx ? 'bg-emerald-500 text-white' : 'bg-slate-700 text-gray-400'}`}
                  >
                    {level.height}p
                  </button>
                ))}
              </div>
            )}

            {/* Language Subtitle Filter */}
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs text-gray-400 font-semibold uppercase tracking-widest shrink-0">🌐 Ngôn ngữ:</span>
              {LANG_OPTIONS.map(opt => (
                <button
                  key={opt.key}
                  onClick={() => setLangFilter(opt.key)}
                  className={`px-3 py-1 text-xs rounded-full font-semibold transition-all ${
                    langFilter === opt.key
                      ? 'bg-primary text-white shadow-md shadow-primary/30'
                      : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
              {langFilter !== 'all' && filteredServers.length === 0 && (
                <span className="text-xs text-yellow-400 ml-2">⚠️ Không có server phù hợp, hiển thị tất cả</span>
              )}
            </div>
            {/* Player Switcher */}
            <div className="flex justify-end gap-2">
              <button 
                onClick={() => setPlayerType('embed')}
                className={`px-3 py-1 text-xs md:text-sm rounded font-medium transition ${playerType === 'embed' ? 'bg-primary text-white' : 'bg-gray-800 text-gray-400 hover:text-white'}`}
              >
                Server Iframe (Ổn định)
              </button>
              <button 
                onClick={() => setPlayerType('m3u8')}
                className={`px-3 py-1 text-xs md:text-sm rounded font-medium transition ${playerType === 'm3u8' ? 'bg-primary text-white' : 'bg-gray-800 text-gray-400 hover:text-white'}`}
              >
                Server M3U8 (Dự phòng)
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Info & Episode List */}
      <div className="container mx-auto max-w-6xl px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* Info Side */}
          <div className="lg:w-2/3">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-2 leading-snug transition-colors">
              {movie.name} - Tập {currentEpisode.name}
            </h1>
            <h2 className="text-lg text-gray-600 dark:text-gray-400 mb-6 font-medium transition-colors">
              {movie.origin_name} ({movie.year})
            </h2>

            <div className="glass p-4 rounded-xl mb-8 flex items-center justify-between">
              <div className="flex items-center text-sm md:text-base">
                <FaServer className="text-primary mr-2" />
                <span className="text-gray-700 dark:text-gray-300 mr-2 transition-colors">Đang phát:</span> 
                <span className="text-gray-900 dark:text-white font-bold transition-colors">{currentServerName}</span>
              </div>
              <Link to={`/phim/${slug}`} className="text-primary hover:text-emerald-500 flex items-center transition-colors text-sm font-medium">
                <FaInfoCircle className="mr-1" /> Thông tin phim
              </Link>
            </div>

            {/* Server Selection - uses language filtered servers */}
            {activeEpisodeList.length > 1 && (
              <div className="mb-6">
                <h3 className="text-gray-900 dark:text-white font-semibold mb-3 transition-colors">Chọn Server:</h3>
                <div className="flex flex-wrap gap-2">
                  {activeEpisodeList.map((server, idx) => (
                    <button
                      key={idx}
                      onClick={() => setCurrentServer(episodes.indexOf(server))}
                      className={`px-4 py-2 rounded text-sm font-medium transition ${
                        episodes.indexOf(server) === currentServer
                          ? 'bg-primary text-white shadow-lg' 
                          : 'bg-white dark:bg-slate-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700 border border-gray-200 dark:border-transparent'
                      }`}
                    >
                      {server.server_name}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Episode List Side */}
          <div className="lg:w-1/3">
            <div className="bg-white dark:bg-darkCard border border-gray-200 dark:border-slate-700/60 shadow-xl rounded-xl p-5 sticky top-24 transition-colors">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center border-b border-gray-200 dark:border-slate-700 pb-3 transition-colors">
                <FaPlay className="text-primary mr-2 text-sm" /> Danh Sách Tập
              </h3>
              
              <div className="max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-4 gap-2">
                  {episodes[currentServer]?.server_data.map((ep) => (
                    <button
                      key={ep.slug}
                      onClick={() => handleEpisodeChange(ep)}
                      className={`py-2 px-1 text-center rounded text-sm font-semibold transition-all ${
                        currentEpisode.slug === ep.slug
                          ? 'bg-primary text-white shadow-[0_0_10px_rgba(16,185,129,0.5)]'
                          : 'bg-gray-50 dark:bg-slate-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-slate-700 hover:text-gray-900 dark:hover:text-white border border-gray-200 dark:border-slate-700'
                      }`}
                    >
                      {ep.name}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default WatchMovie;
