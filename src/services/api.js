import axios from 'axios';

// Đổi từ Ophim sang KKPhim (Nguồn phim khổng lồ được nhiều web sử dụng)
const BASE_URL = 'https://phimapi.com';

// KKPhim dùng chung domain API cho URL ảnh
export const IMAGE_URL = 'https://phimimg.com/';

// ✅ In-memory cache để tránh gọi API lặp lại (TTL: 5 phút)
const apiCache = new Map();
const CACHE_TTL = 5 * 60 * 1000; // 5 phút

const cachedFetch = async (key, fetchFn) => {
  const cached = apiCache.get(key);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return cached.data;
  }
  const data = await fetchFn();
  apiCache.set(key, { data, timestamp: Date.now() });
  return data;
};

export const api = {
  getNewMovies: async (page = 1) => {
    return cachedFetch(`newMovies_p${page}`, async () => {
      const response = await axios.get(`${BASE_URL}/danh-sach/phim-moi-cap-nhat?page=${page}`);
      return response.data;
    });
  },

  getMovieDetails: async (slug) => {
    return cachedFetch(`detail_${slug}`, async () => {
      const response = await axios.get(`${BASE_URL}/phim/${slug}`);
      return response.data;
    });
  },

  searchMovies: async (keyword, limit = 20) => {
    try {
      const response = await axios.get(`${BASE_URL}/v1/api/tim-kiem?keyword=${keyword}&limit=${limit}`);
      return response.data;
    } catch (error) {
      console.error(`Error searching movies for ${keyword}:`, error);
      throw error;
    }
  },

  getTopRatedMovies: async (type = 'phim-bo', limit = 10) => {
    try {
      // Use v1/api to get movies with TMDB rating info
      const response = await axios.get(`${BASE_URL}/v1/api/danh-sach/${type}?page=1&limit=${limit}`);
      if (response.data?.data?.items) {
        // Sort by vote_average descending (filter those with actual votes)
        const items = response.data.data.items
          .filter(m => m.tmdb?.vote_average > 0)
          .sort((a, b) => (b.tmdb?.vote_average || 0) - (a.tmdb?.vote_average || 0))
          .slice(0, limit);
        // Map image URLs
        const cdnImage = response.data.data.APP_DOMAIN_CDN_IMAGE || BASE_URL;
        return { items, cdnImage };
      }
      return { items: [], cdnImage: '' };
    } catch (error) {
      console.error('Error fetching top rated:', error);
      return { items: [], cdnImage: '' };
    }
  }
};
