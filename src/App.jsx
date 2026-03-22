import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import MeteorBackground from './components/MeteorBackground';
import FloatingChatbot from './components/FloatingChatbot';
import ScrollToTop from './components/ScrollToTop';

// ✅ Lazy load tất cả pages → chỉ tải khi cần, giảm initial bundle
const Home = React.lazy(() => import('./pages/Home'));
const Search = React.lazy(() => import('./pages/Search'));
const MovieDetails = React.lazy(() => import('./pages/MovieDetails'));
const WatchMovie = React.lazy(() => import('./pages/WatchMovie'));
const Login = React.lazy(() => import('./pages/Login'));
const Register = React.lazy(() => import('./pages/Register'));
const Favorites = React.lazy(() => import('./pages/Favorites'));
const Profile = React.lazy(() => import('./pages/Profile'));

// Loading spinner khi lazy load đang tải trang
const PageLoader = () => (
  <div className="flex h-[60vh] items-center justify-center flex-col gap-4">
    <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-primary"></div>
    <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">Đang tải...</p>
  </div>
);

function App() {
  return (
    <Router>
      <MeteorBackground />
      <div className="min-h-screen flex flex-col pt-16">
        <Header />
        <main className="flex-grow">
          {/* React.Suspense hiển thị PageLoader khi lazy component đang load */}
          <React.Suspense fallback={<PageLoader />}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/tim-kiem" element={<Search />} />
              <Route path="/phim/:slug" element={<MovieDetails />} />
              <Route path="/xem-phim/:slug" element={<WatchMovie />} />
              <Route path="/dang-nhap" element={<Login />} />
              <Route path="/dang-ky" element={<Register />} />
              <Route path="/yeu-thich" element={<Favorites />} />
              <Route path="/ho-so" element={<Profile />} />
            </Routes>
          </React.Suspense>
        </main>
        <Footer />
        <FloatingChatbot />
        <ScrollToTop />
      </div>
    </Router>
  );
}

export default App;
