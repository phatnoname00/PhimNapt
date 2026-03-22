import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaRobot, FaTimes, FaPaperPlane, FaSearch, FaHome, FaHeart, FaSignInAlt } from 'react-icons/fa';
import { api } from '../services/api';

// Bộ câu trả lời dự phòng (offline)
const QUICK_REPLIES = [
  { label: '🎬 Tìm phim hay', query: 'phim hay' },
  { label: '🔥 Phim mới nhất', query: 'xem phim mới' },
  { label: '❤️ Phim yêu thích', query: 'xem phim yêu thích' },
  { label: '🏠 Về trang chủ', query: 'trang chủ' },
];

const SITE_COMMANDS = {
  'trang chủ': '/',
  'đăng nhập': '/dang-nhap',
  'đăng ký': '/dang-ky',
  'yêu thích': '/yeu-thich',
  'phim yêu thích': '/yeu-thich',
};

const BOT_INTRO = `Xin chào! Tôi là **NAPT Bot** 🤖\n\nTôi có thể giúp bạn:\n- 🎬 **Tìm phim** theo thể loại, nhân vật, nội dung\n- 🧭 **Điều hướng** trang web\n- 💡 Gợi ý phim hay\n\nHãy mô tả phim bạn muốn xem!`;

const ChatBubble = ({ msg }) => (
  <div className={`flex ${msg.from === 'user' ? 'justify-end' : 'justify-start'} mb-3`}>
    {msg.from === 'bot' && (
      <div className="w-7 h-7 rounded-full bg-gradient-to-br from-primary to-blue-500 flex items-center justify-center text-white text-xs mr-2 flex-shrink-0 mt-1">
        <FaRobot />
      </div>
    )}
    <div className={`max-w-[80%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
      msg.from === 'user' 
        ? 'bg-primary text-white rounded-tr-sm' 
        : 'bg-white dark:bg-slate-800 text-gray-800 dark:text-gray-200 border border-gray-200 dark:border-slate-700 rounded-tl-sm shadow-sm'
    }`}>
      {msg.type === 'movies' ? (
        <div>
          <p className="font-bold text-primary mb-2">🎬 Tìm thấy phim phù hợp:</p>
          {msg.movies.map((m, i) => (
            <a 
              key={i} 
              href={`/phim/${m.slug}`}
              className="block py-1.5 border-b border-gray-100 dark:border-slate-700 last:border-0 hover:text-primary transition-colors"
            >
              <span className="font-semibold">{m.name}</span>
              <span className="text-xs text-gray-500 dark:text-gray-400 ml-1">({m.year})</span>
            </a>
          ))}
        </div>
      ) : (
        <p style={{ whiteSpace: 'pre-wrap' }} dangerouslySetInnerHTML={{ __html: msg.text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }} />
      )}
    </div>
  </div>
);

const FloatingChatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([{ from: 'bot', text: BOT_INTRO }]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [hasUnread, setHasUnread] = useState(true);
  const navigate = useNavigate();
  const bottomRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      setHasUnread(false);
      bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
      setTimeout(() => inputRef.current?.focus(), 200);
    }
  }, [isOpen, messages]);

  const addMessage = (msg) => setMessages(prev => [...prev, msg]);

  const handleSend = async (text = input.trim()) => {
    if (!text) return;
    setInput('');
    addMessage({ from: 'user', text });

    const lower = text.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/đ/g, 'd');

    // --- Điều hướng web ---
    for (const [key, path] of Object.entries(SITE_COMMANDS)) {
      const keyNorm = key.normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/đ/g, 'd');
      if (lower.includes(keyNorm)) {
        addMessage({ from: 'bot', text: `Đang chuyển bạn đến **${key}**...` });
        setTimeout(() => navigate(path), 800);
        return;
      }
    }

    // --- Tìm phim ---
    const movieKeywords = ['phim', 'film', 'xem', 'tìm', 'goi y', 'de xuat', 'hay'];
    const isMovieSearch = movieKeywords.some(k => lower.includes(k)) || text.length > 5;

    if (isMovieSearch) {
      setIsLoading(true);
      addMessage({ from: 'bot', text: `🔍 Đang tìm kiếm phim liên quan đến **"${text}"**...` });
      try {
        const res = await api.searchMovies(text, 5);
        const items = res?.data?.items || [];
        if (items.length > 0) {
          addMessage({ from: 'bot', type: 'movies', movies: items, text: '' });
        } else {
          addMessage({ from: 'bot', text: `Không tìm thấy phim nào với từ khóa **"${text}"**. Thử mô tả khác nhé! Ví dụ: "phim hành động Hàn Quốc 2024" 🎬` });
        }
      } catch {
        addMessage({ from: 'bot', text: '⚠️ Có lỗi khi tìm kiếm. Vui lòng thử lại sau nhé!' });
      } finally {
        setIsLoading(false);
      }
    } else {
      addMessage({ from: 'bot', text: 'Bạn có thể mô tả chi tiết hơn về phim bạn muốn xem không? Ví dụ: **"phim kiếm hiệp Trung Quốc"** hoặc **"phim tình cảm Hàn 2024"** 😊' });
    }
  };

  return (
    <>
      {/* Floating Toggle Button */}
      <button 
        onClick={() => setIsOpen(o => !o)}
        className="fixed bottom-6 right-6 z-[9999] w-14 h-14 rounded-full bg-gradient-to-br from-primary to-blue-500 text-white shadow-2xl hover:scale-110 transition-all flex items-center justify-center group"
        title="Chat với NAPT Bot"
      >
        {isOpen ? <FaTimes size={20} /> : <FaRobot size={22} />}
        {!isOpen && hasUnread && (
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center text-[9px] font-bold animate-bounce">!</span>
        )}
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 z-[9998] w-[340px] max-h-[520px] flex flex-col rounded-2xl shadow-2xl overflow-hidden border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-darkBg transition-all">
          
          {/* Header */}
          <div className="bg-gradient-to-r from-primary to-blue-600 px-4 py-3 flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
              <FaRobot className="text-white" />
            </div>
            <div>
              <p className="font-bold text-white text-sm">NAPT Bot</p>
              <p className="text-xs text-green-200 flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-green-300 inline-block animate-pulse"></span>
                Đang hoạt động
              </p>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 custom-scrollbar max-h-[340px]">
            {messages.map((msg, i) => <ChatBubble key={i} msg={msg} />)}
            {isLoading && (
              <div className="flex justify-start mb-3">
                <div className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-2xl rounded-tl-sm px-4 py-2.5 flex gap-2 items-center shadow-sm">
                  <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:_0ms]"></span>
                  <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:_200ms]"></span>
                  <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:_400ms]"></span>
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Quick Replies */}
          <div className="px-3 pb-2 flex gap-2 overflow-x-auto custom-scrollbar">
            {QUICK_REPLIES.map((qr, i) => (
              <button 
                key={i} 
                onClick={() => handleSend(qr.query)}
                className="flex-shrink-0 text-xs bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 text-gray-700 dark:text-gray-300 px-3 py-1.5 rounded-full hover:border-primary hover:text-primary transition-colors whitespace-nowrap"
              >
                {qr.label}
              </button>
            ))}
          </div>

          {/* Input */}
          <div className="px-3 pb-4">
            <form onSubmit={(e) => { e.preventDefault(); handleSend(); }} className="flex items-center gap-2 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-full overflow-hidden px-4 py-2 shadow-sm">
              <input 
                ref={inputRef}
                type="text" 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Mô tả phim bạn muốn xem..."
                className="flex-1 bg-transparent text-gray-800 dark:text-white text-sm focus:outline-none"
              />
              <button 
                type="submit" 
                disabled={!input.trim() || isLoading}
                className="text-primary hover:text-emerald-600 transition disabled:opacity-40"
              >
                <FaPaperPlane />
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default FloatingChatbot;
