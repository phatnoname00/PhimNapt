import axios from 'axios';

const BASE_URL = 'https://phimapi.com';
const OPHIM_BASE_URL = 'https://ophim1.com/api/v1';

export const IMAGE_URL = 'https://phimimg.com/';
export const OPHIM_IMAGE_URL = 'https://img.phim.vip/uploads/movies/';

// ✅ In-memory cache với TTL 15 phút
const apiCache = new Map();
const CACHE_TTL = 15 * 60 * 1000;

// ✅ Timeout 8 giây cho mỗi request
const axiosInstance = axios.create({
  timeout: 8000,
});

const cachedFetch = async (key, fetchFn) => {
  const cached = apiCache.get(key);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return cached.data;
  }
  // Stale-while-revalidate: trả cache cũ ngay, revalidate ngầm
  if (cached) {
    fetchFn().then(data => apiCache.set(key, { data, timestamp: Date.now() })).catch(() => {});
    return cached.data;
  }
  const data = await fetchFn();
  apiCache.set(key, { data, timestamp: Date.now() });
  return data;
};

export const api = {
  // ✅ Phim mới cập nhật
  getNewMovies: async (page = 1) => {
    return cachedFetch(`newMovies_p${page}`, async () => {
      const response = await axiosInstance.get(`${BASE_URL}/danh-sach/phim-moi-cap-nhat?page=${page}`);
      return response.data;
    });
  },

  // ✅ Chi tiết phim
  getMovieDetails: async (slug) => {
    return cachedFetch(`detail_${slug}`, async () => {
      const response = await axiosInstance.get(`${BASE_URL}/phim/${slug}`);
      return response.data;
    });
  },

  // ✅ Tìm kiếm
  searchMovies: async (keyword, limit = 20) => {
    try {
      const response = await axiosInstance.get(`${BASE_URL}/v1/api/tim-kiem?keyword=${keyword}&limit=${limit}`);
      return response.data;
    } catch (error) {
      console.error(`Error searching movies for ${keyword}:`, error);
      throw error;
    }
  },

  // ✅ Phim đánh giá cao
  getTopRatedMovies: async (type = 'phim-bo', limit = 10) => {
    try {
      const response = await axiosInstance.get(`${BASE_URL}/v1/api/danh-sach/${type}?page=1&limit=${limit}`);
      if (response.data?.data?.items) {
        const items = response.data.data.items
          .filter(m => m.tmdb?.vote_average > 0)
          .sort((a, b) => (b.tmdb?.vote_average || 0) - (a.tmdb?.vote_average || 0))
          .slice(0, limit);
        const cdnImage = response.data.data.APP_DOMAIN_CDN_IMAGE || BASE_URL;
        return { items, cdnImage };
      }
      return { items: [], cdnImage: '' };
    } catch (error) {
      console.error('Error fetching top rated:', error);
      return { items: [], cdnImage: '' };
    }
  },

  // ✅ Ophim fallback
  getMovieDetailsOphim: async (slug) => {
    return cachedFetch(`ophim_detail_${slug}`, async () => {
      const response = await axiosInstance.get(`${OPHIM_BASE_URL}/phim/${slug}`);
      return response.data;
    });
  },

  // ✅ Danh sách thể loại
  getGenres: async () => {
    return cachedFetch('genres_list', async () => {
      const response = await axiosInstance.get(`${BASE_URL}/the-loai`);
      return response.data;
    });
  },

  // ✅ Phim theo thể loại
  getMoviesByCategory: async (category, page = 1) => {
    return cachedFetch(`cat_${category}_p${page}`, async () => {
      const response = await axiosInstance.get(`${BASE_URL}/v1/api/the-loai/${category}?page=${page}`);
      return response.data;
    });
  },

  // ✅ Phim theo loại (phim-bo, phim-le...)
  getMoviesByType: async (type, page = 1) => {
    return cachedFetch(`type_${type}_p${page}`, async () => {
      const response = await axiosInstance.get(`${BASE_URL}/v1/api/danh-sach/${type}?page=${page}`);
      return response.data;
    });
  },

  // ✅ [MỚI] Anime — hoạt hình Nhật Bản
  getAnime: async (page = 1, limit = 24) => {
    return cachedFetch(`anime_p${page}`, async () => {
      const response = await axiosInstance.get(`${BASE_URL}/v1/api/danh-sach/hoat-hinh?page=${page}&limit=${limit}`);
      return response.data;
    });
  },

  // ✅ [MỚI] Phim theo quốc gia
  getMoviesByCountry: async (country, page = 1) => {
    return cachedFetch(`country_${country}_p${page}`, async () => {
      const response = await axiosInstance.get(`${BASE_URL}/v1/api/quoc-gia/${country}?page=${page}`);
      return response.data;
    });
  },

  // ✅ [MỚI] Fetch nhiều section cùng lúc — dùng cho trang chủ
  getHomepageData: async () => {
    return cachedFetch('homepage_bundle', async () => {
      const [newMoviesRes, animeRes, topRatedRes] = await Promise.allSettled([
        axiosInstance.get(`${BASE_URL}/danh-sach/phim-moi-cap-nhat?page=1`),
        axiosInstance.get(`${BASE_URL}/v1/api/danh-sach/hoat-hinh?page=1&limit=12`),
        axiosInstance.get(`${BASE_URL}/v1/api/danh-sach/phim-bo?page=1&limit=12`),
      ]);

      return {
        newMovies: newMoviesRes.status === 'fulfilled' ? newMoviesRes.value.data : null,
        anime: animeRes.status === 'fulfilled' ? animeRes.value.data : null,
        topRatedRaw: topRatedRes.status === 'fulfilled' ? topRatedRes.value.data : null,
      };
    });
  },
};
