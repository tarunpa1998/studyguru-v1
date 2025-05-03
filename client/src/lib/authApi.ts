import axios from 'axios';

// Types for authentication
export interface AuthUser {
  id: string;
  fullName: string;
  email: string;
  profileImage?: string;
  savedArticles?: string[];
  savedScholarships?: string[];
}

export interface AuthResponse {
  token: string;
  user: AuthUser;
}

export interface RegisterData {
  fullName: string;
  email: string;
  password: string;
}

export interface LoginData {
  email: string;
  password: string;
}

// Setup axios instance with common headers
const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests if available
api.interceptors.request.use(
  (config: any) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers['x-auth-token'] = token;
    }
    return config;
  },
  (error: any) => Promise.reject(error)
);

// Auth API functions
export const authApi = {
  // Register a new user
  register: async (userData: RegisterData): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>('/auth/register', userData);
    return response.data;
  },

  // Login with email/password
  login: async (credentials: LoginData): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>('/auth/login', credentials);
    return response.data;
  },

  // Login with Google
  googleLogin: async (token: string): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>('/auth/google', { token });
    return response.data;
  },

  // Get current user data
  getCurrentUser: async (): Promise<AuthUser> => {
    const response = await api.get<AuthUser>('/auth/user');
    return response.data;
  },

  // Save article
  saveArticle: async (articleId: string): Promise<{ message: string, savedArticles: string[] }> => {
    const response = await api.post(`/user/save-article/${articleId}`);
    return response.data;
  },

  // Unsave article
  unsaveArticle: async (articleId: string): Promise<{ message: string, savedArticles: string[] }> => {
    const response = await api.delete(`/user/unsave-article/${articleId}`);
    return response.data;
  },

  // Save scholarship
  saveScholarship: async (scholarshipId: string): Promise<{ message: string, savedScholarships: string[] }> => {
    const response = await api.post(`/user/save-scholarship/${scholarshipId}`);
    return response.data;
  },

  // Unsave scholarship
  unsaveScholarship: async (scholarshipId: string): Promise<{ message: string, savedScholarships: string[] }> => {
    const response = await api.delete(`/user/unsave-scholarship/${scholarshipId}`);
    return response.data;
  },

  // Like article
  likeArticle: async (articleId: string): Promise<{ message: string, likes: number }> => {
    const response = await api.post(`/likes/article/${articleId}`);
    return response.data;
  },

  // Unlike article
  unlikeArticle: async (articleId: string): Promise<{ message: string, likes: number }> => {
    const response = await api.delete(`/likes/article/${articleId}`);
    return response.data;
  },

  // Get article like count
  getArticleLikes: async (articleId: string): Promise<{ likes: number }> => {
    const response = await api.get(`/likes/article/${articleId}/count`);
    return response.data;
  },

  // Check if user liked article
  hasLikedArticle: async (articleId: string): Promise<{ hasLiked: boolean }> => {
    const response = await api.get(`/likes/article/${articleId}/status`);
    return response.data;
  },

  // Post comment on article
  postComment: async (articleId: string, content: string): Promise<any> => {
    const response = await api.post(`/comments/article/${articleId}`, { content });
    return response.data;
  },

  // Get comments for article
  getArticleComments: async (articleId: string): Promise<any[]> => {
    const response = await api.get(`/comments/article/${articleId}`);
    return response.data;
  },

  // Update user profile
  updateProfile: async (data: { fullName?: string, profileImage?: string }): Promise<AuthUser> => {
    const response = await api.put('/user/profile', data);
    return response.data;
  },

  // Get user's comments
  getUserComments: async (): Promise<any[]> => {
    const response = await api.get('/user/comments');
    return response.data;
  },

  // Logout (client-side only)
  logout: (): void => {
    localStorage.removeItem('authToken');
  }
};

// Helper function to check if user is authenticated
export const isAuthenticated = (): boolean => {
  return localStorage.getItem('authToken') !== null;
};

// Helper function to get stored auth token
export const getAuthToken = (): string | null => {
  return localStorage.getItem('authToken');
};

export default api;