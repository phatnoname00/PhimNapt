import React, { memo } from 'react';
import { Link } from 'react-router-dom';
import { FaPlay } from 'react-icons/fa';

const MovieCard = memo(({ movie, pathImage }) => {
  // Xử lý ảnh — hỗ trợ URL đầy đủ hoặc tương đối từ KKPhim
  const imgUrl = movie.thumb_url?.startsWith('http') 
    ? movie.thumb_url 
    : `${pathImage || 'https://phimimg.com/'}${movie.thumb_url?.startsWith('/') ? movie.thumb_url.substring(1) : movie.thumb_url}`;

  return (
    <div className="group relative rounded-xl overflow-hidden cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-[0_0_20px_rgba(16,185,129,0.3)] bg-white dark:bg-darkCard border border-gray-200 dark:border-slate-800/50 block">
      {/* Poster container */}
      <div className="aspect-[2/3] w-full relative">
        <img 
          src={imgUrl}
          alt={movie.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          loading="lazy"
          decoding="async"
          onError={(e) => { e.target.src = 'https://via.placeholder.com/200x300/1a1a2e/10b981?text=No+Image'; }}
        />
        {/* Overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-80 transition-opacity duration-300 group-hover:opacity-100"></div>
        
        {/* Play Icon - shows on hover */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <Link to={`/phim/${movie.slug}`} className="w-12 h-12 bg-primary/90 rounded-full flex items-center justify-center text-white scale-0 group-hover:scale-100 transition-transform duration-300 delay-100 shadow-[0_0_15px_rgba(16,185,129,0.5)]">
            <FaPlay className="ml-1" />
          </Link>
        </div>

        {/* Year badge */}
        <div className="absolute top-2 right-2 bg-accent text-white text-xs font-bold px-2 py-1 rounded shadow-md z-10">
          {movie.year || 'Mới'}
        </div>
      </div>

      {/* Info section */}
      <div className="p-4 absolute bottom-0 left-0 right-0 z-20 pointer-events-none">
        <h3 className="text-white font-bold text-sm md:text-base truncate drop-shadow-md">
          {movie.name}
        </h3>
        <p className="text-gray-300 text-xs truncate mt-1 drop-shadow-md">
          {movie.origin_name}
        </p>
      </div>

      {/* Full card clickable link */}
      <Link to={`/phim/${movie.slug}`} className="absolute inset-0 z-10" aria-label={`Xem ${movie.name}`}></Link>
    </div>
  );
});

MovieCard.displayName = 'MovieCard';
export default MovieCard;
