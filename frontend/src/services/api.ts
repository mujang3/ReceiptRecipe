import axios, { AxiosResponse } from 'axios';
import {
  Receipt,
  Recipe,
  UploadResponse,
  OcrResult,
  ReceiptSearchParams,
  RecipeSearchParams,
  PaginatedResponse,
  LoginRequest,
  SignupRequest,
  AuthResponse,
  User,
  Post,
  Comment,
  PostRequest,
  CommentRequest,
  PostLikeResponse,
  ProfileUpdateRequest,
  PasswordChangeRequest,
  UserStats,
} from '../types';

/** ----------------------------------------------------------------
 * API base configuration
 * - REACT_APP_API_URL 이 설정돼 있으면 그 값을 사용
 * - 없거나 공백이면 '/api' 로 고정 (CRA dev proxy 또는 백엔드 리버스프록시 호환)
 * ---------------------------------------------------------------- */
const envBase = (process.env.REACT_APP_API_URL || '').trim();
const API_BASE_URL = envBase !== '' ? envBase : '/api';

// 디버깅 도움 (원하면 주석 해제)
// console.log('[API_BASE_URL]', API_BASE_URL);

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30_000,
  headers: { 'Content-Type': 'application/json' },
});

/** ----------------------------------------------------------------
 * Interceptors
 * ---------------------------------------------------------------- */
api.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem('authToken');
      if (token) {
        config.headers = config.headers ?? {};
        (config.headers as any).Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => Promise.reject(error),
);

api.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error?.response?.status === 401) {
        // 401 에러가 발생해도 로그인 페이지로 리다이렉트하지 않음
        // 대신 토큰만 제거하고 에러를 반환
        localStorage.removeItem('authToken');
        console.log('401 Unauthorized - Token removed');
      }
      return Promise.reject(error);
    },
);

/** ----------------------------------------------------------------
 * Receipt API
 * ---------------------------------------------------------------- */
export const receiptApi = {
  uploadReceipt: async (file: File): Promise<UploadResponse> => {
    const formData = new FormData();
    formData.append('file', file);
    const res: AxiosResponse<UploadResponse> = await api.post('/receipts/upload', formData);
    return res.data;
  },

  getReceipts: async (params: ReceiptSearchParams = {}): Promise<PaginatedResponse<Receipt>> => {
    const res: AxiosResponse<PaginatedResponse<Receipt>> = await api.get('/receipts', { params });
    return res.data;
  },

  getReceipt: async (id: number): Promise<Receipt> => {
    const res: AxiosResponse<Receipt> = await api.get(`/receipts/${id}`);
    return res.data;
  },

  updateReceipt: async (id: number, receipt: Partial<Receipt>): Promise<Receipt> => {
    const res: AxiosResponse<Receipt> = await api.put(`/receipts/${id}`, receipt);
    return res.data;
  },

  deleteReceipt: async (id: number): Promise<void> => {
    await api.delete(`/receipts/${id}`);
  },

  getStoreNames: async (): Promise<string[]> => {
    const res: AxiosResponse<string[]> = await api.get('/receipts/stores');
    return res.data;
  },

  getExpiringIngredients: async (days: number = 7): Promise<any[]> => {
    const res: AxiosResponse<any[]> = await api.get(`/receipts/ingredients/expiring`, {
      params: { days },
    });
    return res.data;
  },
};


/** ----------------------------------------------------------------
 * OCR API
 * ---------------------------------------------------------------- */
export const ocrApi = {
  processWithGoogleVision: async (file: File): Promise<OcrResult> => {
    const formData = new FormData();
    formData.append('file', file);
    const res: AxiosResponse<OcrResult> = await api.post('/ocr/google-vision', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return res.data;
  },

  processWithNaverOcr: async (file: File): Promise<OcrResult> => {
    const formData = new FormData();
    formData.append('file', file);
    const res: AxiosResponse<OcrResult> = await api.post('/ocr/naver', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return res.data;
  },

  processWithGemini: async (receiptId: string): Promise<OcrResult> => {
    const res: AxiosResponse<OcrResult> = await api.post(`/receipts/process/${receiptId}`);
    return res.data;
  },
};

/** ----------------------------------------------------------------
 * Auth API
 * ---------------------------------------------------------------- */
export const authApi = {
  login: async (loginData: LoginRequest): Promise<AuthResponse> => {
    const res: AxiosResponse<AuthResponse> = await api.post('/auth/signin', loginData);
    return res.data;
  },

  register: async (signupData: SignupRequest): Promise<any> => {
    console.log('API register 호출:', signupData);
    const res: AxiosResponse<any> = await api.post('/auth/signup', signupData);
    console.log('API register 응답:', res.data);
    return res.data;
  },

  logout: async (): Promise<any> => {
    const res: AxiosResponse<any> = await api.post('/auth/signout');
    return res.data;
  },

  getCurrentUser: async (): Promise<User> => {
    const res: AxiosResponse<User> = await api.get('/auth/me');
    return res.data;
  },
};

/** ----------------------------------------------------------------
 * Community API
 * ---------------------------------------------------------------- */
export const communityApi = {
  getPosts: async (page: number = 0, size: number = 10): Promise<PaginatedResponse<Post>> => {
    const res: AxiosResponse<PaginatedResponse<Post>> = await api.get('/community/posts', {
      params: { page, size },
    });
    return res.data;
  },

  searchPosts: async (keyword: string, page: number = 0, size: number = 10): Promise<PaginatedResponse<Post>> => {
    const res: AxiosResponse<PaginatedResponse<Post>> = await api.get('/community/posts/search', {
      params: { keyword, page, size },
    });
    return res.data;
  },

  getPost: async (id: number): Promise<Post> => {
    const res: AxiosResponse<Post> = await api.get(`/community/posts/${id}`);
    return res.data;
  },

  createPost: async (postData: PostRequest): Promise<Post> => {
    const res: AxiosResponse<Post> = await api.post('/community/posts', postData);
    return res.data;
  },

  updatePost: async (id: number, postData: PostRequest): Promise<Post> => {
    const res: AxiosResponse<Post> = await api.put(`/community/posts/${id}`, postData);
    return res.data;
  },

  deletePost: async (id: number): Promise<any> => {
    const res: AxiosResponse<any> = await api.delete(`/community/posts/${id}`);
    return res.data;
  },

  getPopularPosts: async (): Promise<Post[]> => {
    const res: AxiosResponse<Post[]> = await api.get('/community/posts/popular');
    return res.data;
  },

  getMostViewedPosts: async (): Promise<Post[]> => {
    const res: AxiosResponse<Post[]> = await api.get('/community/posts/most-viewed');
    return res.data;
  },

  getComments: async (postId: number, page: number = 0, size: number = 10): Promise<PaginatedResponse<Comment>> => {
    const res: AxiosResponse<PaginatedResponse<Comment>> = await api.get(`/community/posts/${postId}/comments`, {
      params: { page, size },
    });
    return res.data;
  },

  createComment: async (postId: number, commentData: CommentRequest): Promise<Comment> => {
    const res: AxiosResponse<Comment> = await api.post(`/community/posts/${postId}/comments`, commentData);
    return res.data;
  },

  updateComment: async (id: number, commentData: CommentRequest): Promise<Comment> => {
    const res: AxiosResponse<Comment> = await api.put(`/community/comments/${id}`, commentData);
    return res.data;
  },

  deleteComment: async (id: number): Promise<any> => {
    const res: AxiosResponse<any> = await api.delete(`/community/comments/${id}`);
    return res.data;
  },

  togglePostLike: async (postId: number): Promise<PostLikeResponse> => {
    const res: AxiosResponse<PostLikeResponse> = await api.post(`/community/posts/${postId}/like`);
    return res.data;
  },

  getPostLikeStatus: async (postId: number): Promise<{ isLiked: boolean }> => {
    const res: AxiosResponse<{ isLiked: boolean }> = await api.get(`/community/posts/${postId}/like-status`);
    return res.data;
  },
};

/** ----------------------------------------------------------------
 * Profile API
 * ---------------------------------------------------------------- */
export const profileApi = {
  getProfile: async (): Promise<User> => {
    const res: AxiosResponse<User> = await api.get('/profile/me');
    return res.data;
  },

  updateProfile: async (profileData: ProfileUpdateRequest): Promise<any> => {
    const res: AxiosResponse<any> = await api.put('/profile/me', profileData);
    return res.data;
  },

  changePassword: async (passwordData: PasswordChangeRequest): Promise<any> => {
    const res: AxiosResponse<any> = await api.put('/profile/password', passwordData);
    return res.data;
  },

  getUserPosts: async (page: number = 0, size: number = 10): Promise<PaginatedResponse<Post>> => {
    const res: AxiosResponse<PaginatedResponse<Post>> = await api.get('/profile/posts', {
      params: { page, size },
    });
    return res.data;
  },

  getUserStats: async (): Promise<UserStats> => {
    const res: AxiosResponse<UserStats> = await api.get('/profile/stats');
    return res.data;
  },
};

/** ----------------------------------------------------------------
 * Recipe API
 * ---------------------------------------------------------------- */
export const recipeApi = {
  getRecipes: async (params: RecipeSearchParams): Promise<PaginatedResponse<Recipe>> => {
    const res: AxiosResponse<PaginatedResponse<Recipe>> = await api.get('/recipes', { params });
    return res.data;
  },
  getRecipe: async (id: number): Promise<Recipe> => {
    const res: AxiosResponse<Recipe> = await api.get(`/recipes/${id}`);
    return res.data;
  },
  getCategories: async (): Promise<string[]> => {
    const res: AxiosResponse<string[]> = await api.get('/recipes/categories');
    return res.data;
  },
  getDifficultyLevels: async (): Promise<string[]> => {
    const res: AxiosResponse<string[]> = await api.get('/recipes/difficulty-levels');
    return res.data;
  },
  getKoreanRecipes: async (number: number = 10): Promise<any[]> => {
    const res: AxiosResponse<any[]> = await api.get(`/recipes/external/korean?number=${number}`);
    return res.data;
  },
  importKoreanRecipes: async (number: number = 10): Promise<{importedCount: number, totalFound: number, message: string}> => {
    const res: AxiosResponse<{importedCount: number, totalFound: number, message: string}> = await api.post(`/recipes/external/import?number=${number}`);
    return res.data;
  },
};

/** ----------------------------------------------------------------
 * Favorite API
 * ---------------------------------------------------------------- */
export const favoriteApi = {
  // 즐겨찾기 토글
  toggleFavorite: async (recipeId: number, userId: number): Promise<{isFavorite: boolean, message: string}> => {
    const res: AxiosResponse<{isFavorite: boolean, message: string}> = await api.post(`/favorites/recipes/${recipeId}/users/${userId}/toggle`);
    return res.data;
  },
  // 즐겨찾기 여부 확인
  checkFavorite: async (recipeId: number, userId: number): Promise<{isFavorite: boolean}> => {
    const res: AxiosResponse<{isFavorite: boolean}> = await api.get(`/favorites/recipes/${recipeId}/users/${userId}/check`);
    return res.data;
  },
  // 사용자의 즐겨찾기 목록
  getUserFavorites: async (userId: number, page: number = 0, size: number = 20): Promise<PaginatedResponse<any>> => {
    const res: AxiosResponse<PaginatedResponse<any>> = await api.get(`/favorites/users/${userId}?page=${page}&size=${size}`);
    return res.data;
  },
  // 즐겨찾기 개수
  getFavoriteCount: async (userId: number): Promise<{count: number}> => {
    const res: AxiosResponse<{count: number}> = await api.get(`/favorites/users/${userId}/count`);
    return res.data;
  },
  // 레시피의 즐겨찾기 개수
  getRecipeFavoriteCount: async (recipeId: number): Promise<{count: number}> => {
    const res: AxiosResponse<{count: number}> = await api.get(`/favorites/recipes/${recipeId}/count`);
    return res.data;
  },
};

/** ----------------------------------------------------------------
 * Rating API
 * ---------------------------------------------------------------- */
export const ratingApi = {
  // 평점 및 리뷰 추가/수정
  addOrUpdateRating: async (recipeId: number, userId: number, ratingData: {rating: number, comment?: string, isFavorite?: boolean}): Promise<{message: string, rating: any}> => {
    const res: AxiosResponse<{message: string, rating: any}> = await api.post(`/ratings/recipes/${recipeId}/users/${userId}`, ratingData);
    return res.data;
  },
  // 평점 삭제
  deleteRating: async (recipeId: number, userId: number): Promise<{message: string}> => {
    const res: AxiosResponse<{message: string}> = await api.delete(`/ratings/recipes/${recipeId}/users/${userId}`);
    return res.data;
  },
  // 레시피의 평점 목록 조회
  getRecipeRatings: async (recipeId: number, page: number = 0, size: number = 10): Promise<PaginatedResponse<any>> => {
    const res: AxiosResponse<PaginatedResponse<any>> = await api.get(`/ratings/recipes/${recipeId}?page=${page}&size=${size}`);
    return res.data;
  },
  // 사용자의 평점 목록 조회
  getUserRatings: async (userId: number, page: number = 0, size: number = 10): Promise<PaginatedResponse<any>> => {
    const res: AxiosResponse<PaginatedResponse<any>> = await api.get(`/ratings/users/${userId}?page=${page}&size=${size}`);
    return res.data;
  },
  // 특정 사용자의 특정 레시피 평점 조회
  getUserRatingForRecipe: async (recipeId: number, userId: number): Promise<{hasRating: boolean, rating: any}> => {
    const res: AxiosResponse<{hasRating: boolean, rating: any}> = await api.get(`/ratings/recipes/${recipeId}/users/${userId}`);
    return res.data;
  },
  // 레시피의 평균 평점 조회
  getAverageRating: async (recipeId: number): Promise<{averageRating: number, ratingCount: number}> => {
    const res: AxiosResponse<{averageRating: number, ratingCount: number}> = await api.get(`/ratings/recipes/${recipeId}/average`);
    return res.data;
  },
  // 높은 평점의 레시피들 조회
  getHighRatedRecipes: async (minRating: number = 4, limit: number = 10): Promise<any[]> => {
    const res: AxiosResponse<any[]> = await api.get(`/ratings/high-rated?minRating=${minRating}&limit=${limit}`);
    return res.data;
  },
};

/** ----------------------------------------------------------------
 * Notification API
 * ---------------------------------------------------------------- */
export const notificationApi = {
  // 유통기한 임박 재료 조회
  getExpiringIngredients: async (userId: number, days: number = 3): Promise<any[]> => {
    const res: AxiosResponse<any[]> = await api.get(`/notifications/expiring/${userId}?days=${days}`);
    return res.data;
  },
  // 유통기한 만료 재료 조회
  getExpiredIngredients: async (userId: number): Promise<any[]> => {
    const res: AxiosResponse<any[]> = await api.get(`/notifications/expired/${userId}`);
    return res.data;
  },
  // 알림 통계 조회
  getNotificationStats: async (userId: number): Promise<{expiringSoonCount: number, expiredCount: number, totalNotifications: number}> => {
    const res: AxiosResponse<{expiringSoonCount: number, expiredCount: number, totalNotifications: number}> = await api.get(`/notifications/stats/${userId}`);
    return res.data;
  },
  // 알림 읽음 처리
  markAsNotified: async (ingredientExpiryId: number): Promise<{message: string}> => {
    const res: AxiosResponse<{message: string}> = await api.post(`/notifications/mark-read/${ingredientExpiryId}`);
    return res.data;
  },
};

export default api;