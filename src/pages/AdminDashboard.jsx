import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  FaUsers, FaFilm, FaCog, FaChartBar, FaHome, FaTrash,
  FaKey, FaShieldAlt, FaDatabase, FaSync, FaCheckCircle,
  FaTimesCircle, FaEye, FaUserShield, FaTachometerAlt,
} from 'react-icons/fa';

// ==================== TABS ====================
const TABS = [
  { id: 'overview', label: 'Tổng Quan', icon: <FaTachometerAlt /> },
  { id: 'users', label: 'Quản Lý User', icon: <FaUsers /> },
  { id: 'content', label: 'Nội Dung', icon: <FaFilm /> },
  { id: 'settings', label: 'Cài Đặt', icon: <FaCog /> },
  { id: 'stats', label: 'Thống Kê', icon: <FaChartBar /> },
];

// ==================== STAT CARD ====================
const StatCard = ({ icon, label, value, color, sub }) => (
  <div className={`bg-slate-800/70 border border-slate-700/50 rounded-2xl p-5 flex items-center gap-4 hover:border-${color}-500/40 transition-all`}>
    <div className={`w-12 h-12 rounded-xl bg-${color}-500/20 flex items-center justify-center text-${color}-400 text-xl flex-shrink-0`}>
      {icon}
    </div>
    <div>
      <p className="text-gray-400 text-sm">{label}</p>
      <p className="text-white text-2xl font-black">{value}</p>
      {sub && <p className="text-gray-500 text-xs mt-0.5">{sub}</p>}
    </div>
  </div>
);

// ==================== OVERVIEW TAB ====================
const OverviewTab = () => {
  const users = JSON.parse(localStorage.getItem('users')) || [];
  const history = JSON.parse(localStorage.getItem('watchHistory')) || {};
  const totalWatched = Object.values(history).flat().length;
  const cacheSize = Object.keys(sessionStorage).length;

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-black text-white flex items-center gap-3">
        <FaTachometerAlt className="text-emerald-400" /> Tổng Quan Hệ Thống
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard icon={<FaUsers />} label="Tổng User" value={users.length} color="emerald" sub="Không tính admin" />
        <StatCard icon={<FaFilm />} label="Lịch Sử Xem" value={totalWatched} color="blue" sub="Toàn hệ thống" />
        <StatCard icon={<FaDatabase />} label="Cache Objects" value={cacheSize} color="purple" sub="Trong SessionStorage" />
        <StatCard icon={<FaShieldAlt />} label="Phiên Admin" value="1" color="yellow" sub="Đang hoạt động" />
      </div>

      {/* System info */}
      <div className="bg-slate-800/50 rounded-2xl border border-slate-700/40 p-6">
        <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
          <FaDatabase className="text-purple-400" /> Thông Tin Hệ Thống
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
          {[
            { label: 'API Nguồn Chính', value: 'phimapi.com', ok: true },
            { label: 'Chế độ lưu trữ', value: 'LocalStorage (Client-side)', ok: true },
            { label: 'Framework', value: 'React 19 + Vite 8', ok: true },
            { label: 'Authentication', value: 'Hardcoded Admin + LocalStorage Users', ok: true },
            { label: 'Cache TTL', value: '15 phút (in-memory)', ok: true },
            { label: 'Deploy', value: 'Vercel Ready', ok: true },
          ].map(item => (
            <div key={item.label} className="flex items-center justify-between bg-slate-900/50 rounded-lg px-4 py-2.5">
              <span className="text-gray-400">{item.label}</span>
              <span className="flex items-center gap-1.5 text-white font-medium">
                {item.ok
                  ? <FaCheckCircle className="text-emerald-400" size={12} />
                  : <FaTimesCircle className="text-red-400" size={12} />}
                {item.value}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// ==================== USERS TAB ====================
const UsersTab = () => {
  const { adminGetAllUsers, adminDeleteUser, adminResetPassword } = useAuth();
  const [users, setUsers] = useState([]);
  const [resetUserId, setResetUserId] = useState(null);
  const [newPassword, setNewPassword] = useState('');
  const [toast, setToast] = useState('');

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(''), 2500);
  };

  useEffect(() => {
    setUsers(adminGetAllUsers());
  }, []);

  const handleDelete = (id, username) => {
    if (!window.confirm(`Xóa user "${username}"?`)) return;
    adminDeleteUser(id);
    setUsers(adminGetAllUsers());
    showToast(`✅ Đã xóa user "${username}"`);
  };

  const handleReset = (id) => {
    if (!newPassword.trim()) return;
    adminResetPassword(id, newPassword.trim());
    setResetUserId(null);
    setNewPassword('');
    showToast('✅ Đã đặt lại mật khẩu!');
  };

  return (
    <div className="space-y-5">
      {toast && (
        <div className="fixed top-20 right-6 z-50 bg-emerald-500 text-white px-5 py-3 rounded-xl shadow-xl font-bold animate-bounce">
          {toast}
        </div>
      )}
      <h2 className="text-2xl font-black text-white flex items-center gap-3">
        <FaUsers className="text-emerald-400" /> Quản Lý Người Dùng
      </h2>

      {/* Admin badge */}
      <div className="flex items-center gap-3 bg-yellow-500/10 border border-yellow-500/30 rounded-xl px-5 py-3">
        <FaUserShield className="text-yellow-400 text-xl" />
        <div>
          <p className="text-yellow-300 font-bold">admin</p>
          <p className="text-gray-400 text-xs">Tài khoản hệ thống — không thể xóa</p>
        </div>
        <span className="ml-auto text-xs bg-yellow-500/30 text-yellow-300 px-2 py-1 rounded-full font-bold">ADMIN</span>
      </div>

      {users.length === 0 ? (
        <div className="text-center text-gray-500 py-12">
          <FaUsers size={40} className="mx-auto mb-3 opacity-30" />
          <p>Chưa có user nào đăng ký</p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-slate-700/50">
          <table className="w-full text-sm text-left">
            <thead className="bg-slate-800/80 text-gray-400 uppercase text-xs">
              <tr>
                <th className="px-5 py-3">User</th>
                <th className="px-5 py-3">ID</th>
                <th className="px-5 py-3">Yêu thích</th>
                <th className="px-5 py-3 text-right">Hành động</th>
              </tr>
            </thead>
            <tbody>
              {users.map(user => (
                <React.Fragment key={user.id}>
                  <tr className="border-t border-slate-700/30 hover:bg-slate-800/40 transition-colors">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-r from-emerald-500 to-blue-500 flex items-center justify-center text-white text-xs font-black">
                          {user.username.charAt(0).toUpperCase()}
                        </div>
                        <span className="text-white font-bold">{user.username}</span>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-gray-500 text-xs font-mono">{user.id}</td>
                    <td className="px-5 py-4">
                      <span className="text-pink-400 font-bold">{user.favorites?.length || 0}</span>
                      <span className="text-gray-500 ml-1">phim</span>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => setResetUserId(resetUserId === user.id ? null : user.id)}
                          className="text-xs bg-blue-500/20 text-blue-400 hover:bg-blue-500/30 px-3 py-1.5 rounded-lg flex items-center gap-1 transition"
                        >
                          <FaKey size={10} /> Reset Pass
                        </button>
                        <button
                          onClick={() => handleDelete(user.id, user.username)}
                          className="text-xs bg-red-500/20 text-red-400 hover:bg-red-500/30 px-3 py-1.5 rounded-lg flex items-center gap-1 transition"
                        >
                          <FaTrash size={10} /> Xóa
                        </button>
                      </div>
                    </td>
                  </tr>
                  {resetUserId === user.id && (
                    <tr className="bg-blue-500/5 border-t border-blue-500/20">
                      <td colSpan={4} className="px-5 py-3">
                        <div className="flex items-center gap-3">
                          <input
                            type="text"
                            placeholder="Nhập mật khẩu mới..."
                            value={newPassword}
                            onChange={e => setNewPassword(e.target.value)}
                            className="flex-1 bg-slate-900 border border-slate-600 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-blue-500"
                          />
                          <button
                            onClick={() => handleReset(user.id)}
                            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-bold transition"
                          >
                            Lưu
                          </button>
                          <button
                            onClick={() => { setResetUserId(null); setNewPassword(''); }}
                            className="text-gray-400 hover:text-white px-3 py-2 text-sm transition"
                          >
                            Hủy
                          </button>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

// ==================== CONTENT TAB ====================
const ContentTab = () => {
  const [watchHistory, setWatchHistory] = useState({});

  useEffect(() => {
    const h = JSON.parse(localStorage.getItem('watchHistory')) || {};
    setWatchHistory(h);
  }, []);

  const clearAllHistory = () => {
    if (!window.confirm('Xóa toàn bộ lịch sử xem của tất cả user?')) return;
    localStorage.removeItem('watchHistory');
    setWatchHistory({});
  };

  const topMovies = Object.values(watchHistory)
    .flat()
    .reduce((acc, item) => {
      if (!item?.name) return acc;
      const key = item.slug || item.name;
      acc[key] = acc[key] || { ...item, count: 0 };
      acc[key].count++;
      return acc;
    }, {});
  const topList = Object.values(topMovies).sort((a, b) => b.count - a.count).slice(0, 10);

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-black text-white flex items-center gap-3">
        <FaFilm className="text-emerald-400" /> Quản Lý Nội Dung
      </h2>

      {/* Lịch sử xem */}
      <div className="bg-slate-800/50 rounded-2xl border border-slate-700/40 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <FaEye className="text-blue-400" /> Phim Được Xem Nhiều Nhất
          </h3>
          <button
            onClick={clearAllHistory}
            className="text-xs text-red-400 hover:text-red-300 flex items-center gap-1 bg-red-500/10 hover:bg-red-500/20 px-3 py-2 rounded-lg transition"
          >
            <FaTrash size={10} /> Xóa Lịch Sử
          </button>
        </div>
        {topList.length === 0 ? (
          <p className="text-gray-500 text-center py-6">Chưa có dữ liệu xem phim</p>
        ) : (
          <div className="space-y-2">
            {topList.map((movie, i) => (
              <div key={movie.slug || i} className="flex items-center gap-3 bg-slate-900/40 rounded-xl px-4 py-2.5">
                <span className="text-gray-500 text-sm font-black w-6">#{i + 1}</span>
                {movie.thumb_url && (
                  <img src={movie.thumb_url} alt={movie.name} className="w-10 h-7 object-cover rounded" />
                )}
                <span className="text-white text-sm flex-1 truncate">{movie.name}</span>
                <span className="text-blue-400 font-bold text-sm">{movie.count}x</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Nguồn API */}
      <div className="bg-slate-800/50 rounded-2xl border border-slate-700/40 p-6">
        <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
          <FaDatabase className="text-purple-400" /> Nguồn API Đang Dùng
        </h3>
        <div className="space-y-2">
          {[
            { name: 'phimapi.com', desc: 'Nguồn phim chính — phim bộ, phim lẻ', status: 'Hoạt động' },
            { name: 'phimapi.com/hoat-hinh', desc: 'Anime — hoạt hình', status: 'Hoạt động' },
            { name: 'ophim1.com', desc: 'Nguồn phụ — fallback khi cần', status: 'Dự phòng' },
          ].map(api => (
            <div key={api.name} className="flex items-center justify-between bg-slate-900/40 rounded-xl px-4 py-3">
              <div>
                <p className="text-white font-bold text-sm font-mono">{api.name}</p>
                <p className="text-gray-500 text-xs">{api.desc}</p>
              </div>
              <span className={`text-xs px-2 py-1 rounded-full font-bold ${api.status === 'Hoạt động' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-yellow-500/20 text-yellow-400'}`}>
                {api.status}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// ==================== SETTINGS TAB ====================
const SettingsTab = () => {
  const [cacheTTL, setCacheTTL] = useState(() => localStorage.getItem('admin_cacheTTL') || '15');
  const [showChatbot, setShowChatbot] = useState(() => localStorage.getItem('admin_showChatbot') !== 'false');
  const [showMeteor, setShowMeteor] = useState(() => localStorage.getItem('admin_showMeteor') !== 'false');
  const [toast, setToast] = useState('');

  const save = () => {
    localStorage.setItem('admin_cacheTTL', cacheTTL);
    localStorage.setItem('admin_showChatbot', showChatbot);
    localStorage.setItem('admin_showMeteor', showMeteor);
    setToast('✅ Đã lưu cài đặt! Reload trang để áp dụng.');
    setTimeout(() => setToast(''), 3000);
  };

  const clearCache = () => {
    sessionStorage.clear();
    setToast('✅ Đã xóa cache API!');
    setTimeout(() => setToast(''), 2500);
  };

  return (
    <div className="space-y-6">
      {toast && (
        <div className="fixed top-20 right-6 z-50 bg-emerald-500 text-white px-5 py-3 rounded-xl shadow-xl font-bold">
          {toast}
        </div>
      )}
      <h2 className="text-2xl font-black text-white flex items-center gap-3">
        <FaCog className="text-emerald-400" /> Cài Đặt Hệ Thống
      </h2>

      <div className="bg-slate-800/50 rounded-2xl border border-slate-700/40 p-6 space-y-5">
        {/* Cache TTL */}
        <div>
          <label className="block text-gray-300 font-bold mb-2 text-sm">Cache API TTL (phút)</label>
          <select
            value={cacheTTL}
            onChange={e => setCacheTTL(e.target.value)}
            className="bg-slate-900 border border-slate-600 text-white rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-emerald-500 w-40"
          >
            <option value="5">5 phút</option>
            <option value="10">10 phút</option>
            <option value="15">15 phút</option>
            <option value="30">30 phút</option>
            <option value="60">60 phút</option>
          </select>
          <p className="text-gray-500 text-xs mt-1">Thời gian cache dữ liệu API trước khi cập nhật lại</p>
        </div>

        {/* Toggles */}
        {[
          { label: 'Hiển thị Chatbot nổi', sub: 'Tắt nếu muốn giao diện gọn', val: showChatbot, set: setShowChatbot },
          { label: 'Hiệu ứng Meteor nền', sub: 'Tắt để cải thiện hiệu năng', val: showMeteor, set: setShowMeteor },
        ].map(({ label, sub, val, set }) => (
          <div key={label} className="flex items-center justify-between py-3 border-t border-slate-700/40">
            <div>
              <p className="text-white font-bold text-sm">{label}</p>
              <p className="text-gray-500 text-xs">{sub}</p>
            </div>
            <button
              onClick={() => set(!val)}
              className={`w-12 h-6 rounded-full transition-all relative ${val ? 'bg-emerald-500' : 'bg-slate-600'}`}
            >
              <span className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-all ${val ? 'left-6' : 'left-0.5'}`} />
            </button>
          </div>
        ))}

        {/* Actions */}
        <div className="flex gap-3 pt-3 border-t border-slate-700/40">
          <button
            onClick={save}
            className="bg-emerald-500 hover:bg-emerald-600 text-white px-6 py-2.5 rounded-xl font-bold text-sm transition"
          >
            💾 Lưu Cài Đặt
          </button>
          <button
            onClick={clearCache}
            className="bg-purple-500/20 hover:bg-purple-500/30 text-purple-400 px-6 py-2.5 rounded-xl font-bold text-sm transition flex items-center gap-2"
          >
            <FaSync size={12} /> Xóa Cache API
          </button>
        </div>
      </div>
    </div>
  );
};

// ==================== STATS TAB ====================
const StatsTab = () => {
  const searches = JSON.parse(localStorage.getItem('recentSearches')) || [];
  const users = JSON.parse(localStorage.getItem('users')) || [];
  const totalFavs = users.reduce((s, u) => s + (u.favorites?.length || 0), 0);

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-black text-white flex items-center gap-3">
        <FaChartBar className="text-emerald-400" /> Thống Kê
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard icon={<FaUsers />} label="Tổng tài khoản" value={users.length} color="emerald" />
        <StatCard icon={<FaChartBar />} label="Tổng phim yêu thích" value={totalFavs} color="pink" />
        <StatCard icon={<FaDatabase />} label="Lịch sử tìm kiếm" value={searches.length} color="blue" />
      </div>

      {searches.length > 0 && (
        <div className="bg-slate-800/50 rounded-2xl border border-slate-700/40 p-6">
          <h3 className="text-lg font-bold text-white mb-4">🔍 Từ Khoá Tìm Kiếm Gần Đây</h3>
          <div className="flex flex-wrap gap-2">
            {searches.map((s, i) => (
              <span key={i} className="bg-blue-500/20 text-blue-300 text-sm px-3 py-1.5 rounded-full">
                {s}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

// ==================== MAIN ADMIN DASHBOARD ====================
const AdminDashboard = () => {
  const { currentUser, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');

  const tabContent = {
    overview: <OverviewTab />,
    users: <UsersTab />,
    content: <ContentTab />,
    settings: <SettingsTab />,
    stats: <StatsTab />,
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      {/* Admin Top Bar */}
      <div className="bg-gradient-to-r from-emerald-900/60 to-slate-900 border-b border-emerald-500/20 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center">
            <FaShieldAlt className="text-emerald-400 text-lg" />
          </div>
          <div>
            <h1 className="font-black text-white text-lg leading-tight">Admin Dashboard</h1>
            <p className="text-emerald-400 text-xs font-medium">Phim NAPT — Developer Panel</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-400">
            Đăng nhập: <span className="text-emerald-400 font-bold">{currentUser?.username}</span>
          </span>
          <a href="/" className="text-xs text-gray-400 hover:text-white flex items-center gap-1 transition">
            <FaHome size={12} /> Trang Chủ
          </a>
          <button
            onClick={logout}
            className="text-xs bg-red-500/20 text-red-400 hover:bg-red-500/30 px-3 py-1.5 rounded-lg transition"
          >
            Đăng Xuất
          </button>
        </div>
      </div>

      <div className="flex">
        {/* Sidebar */}
        <aside className="w-56 min-h-[calc(100vh-64px)] bg-slate-900/80 border-r border-slate-700/40 p-4 space-y-1 flex-shrink-0">
          {TABS.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all text-left ${
                activeTab === tab.id
                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                  : 'text-gray-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <span className="text-base">{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-8">
          {tabContent[activeTab]}
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;
