import React, { useState } from 'react';
import { FaBell, FaTimes, FaCheckCircle, FaEnvelope } from 'react-icons/fa';

// Simulate email notification subscription with localStorage
const NOTIFY_KEY = 'movie_notifications';

const getNotifications = () => JSON.parse(localStorage.getItem(NOTIFY_KEY) || '[]');

const MovieNotifyButton = ({ movie }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(() => {
    const list = getNotifications();
    return list.some(n => n.slug === movie?.slug);
  });
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState('');

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (!email.includes('@')) {
      setMsg('Vui lòng nhập email hợp lệ!');
      return;
    }
    setLoading(true);
    setTimeout(() => {
      const list = getNotifications().filter(n => n.slug !== movie?.slug);
      list.push({
        slug: movie.slug,
        name: movie.name,
        email,
        episode_current: movie.episode_current,
        subscribedAt: Date.now()
      });
      localStorage.setItem(NOTIFY_KEY, JSON.stringify(list));
      setSubscribed(true);
      setLoading(false);
      setMsg(`Đăng ký thành công! Bạn sẽ nhận thông báo qua ${email} khi có tập mới.`);
    }, 1000);
  };

  const handleUnsubscribe = () => {
    const list = getNotifications().filter(n => n.slug !== movie?.slug);
    localStorage.setItem(NOTIFY_KEY, JSON.stringify(list));
    setSubscribed(false);
    setMsg('');
    setIsOpen(false);
  };

  if (!movie) return null;

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(o => !o)}
        className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold transition-all border ${ 
          subscribed 
            ? 'bg-yellow-400/20 border-yellow-400 text-yellow-500 hover:bg-yellow-400/30' 
            : 'bg-white dark:bg-slate-800 border-gray-200 dark:border-slate-700 text-gray-700 dark:text-gray-300 hover:border-primary hover:text-primary'
        }`}
        title={subscribed ? 'Đang theo dõi phim này' : 'Nhận thông báo tập mới'}
      >
        <FaBell className={subscribed ? 'text-yellow-400 animate-pulse' : ''} />
        {subscribed ? 'Đang Theo Dõi' : 'Thông Báo Tập Mới'}
      </button>

      {isOpen && (
        <div className="absolute top-full right-0 mt-2 w-72 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-2xl shadow-2xl p-5 z-50">
          <div className="flex items-center justify-between mb-4">
            <h4 className="font-bold text-gray-900 dark:text-white text-sm">
              🔔 Thông Báo Tập Mới
            </h4>
            <button onClick={() => setIsOpen(false)} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
              <FaTimes size={14} />
            </button>
          </div>

          {subscribed ? (
            <div className="text-center py-2">
              <FaCheckCircle className="text-green-400 text-3xl mx-auto mb-2" />
              <p className="text-gray-700 dark:text-gray-300 text-sm mb-3">
                Bạn đang theo dõi <strong>{movie.name}</strong>
              </p>
              <button
                onClick={handleUnsubscribe}
                className="text-xs text-red-500 hover:text-red-600 border border-red-200 dark:border-red-800 rounded-full px-3 py-1 transition"
              >
                Hủy theo dõi
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubscribe}>
              <p className="text-gray-600 dark:text-gray-400 text-xs mb-3">
                Nhập email để nhận thông báo khi <strong>{movie.name}</strong> ra tập mới.
              </p>
              <div className="flex gap-2">
                <div className="flex-1 flex items-center bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-lg px-3 overflow-hidden">
                  <FaEnvelope className="text-gray-400 text-xs mr-2" />
                  <input
                    type="email"
                    required
                    placeholder="example@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="flex-1 bg-transparent text-sm text-gray-900 dark:text-white py-2 focus:outline-none"
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-primary hover:bg-emerald-600 text-white rounded-lg px-3 text-sm font-bold transition disabled:opacity-60"
                >
                  {loading ? '...' : 'Đăng Ký'}
                </button>
              </div>
              {msg && <p className="text-xs text-green-500 mt-2">{msg}</p>}
            </form>
          )}
        </div>
      )}
    </div>
  );
};

export default MovieNotifyButton;
