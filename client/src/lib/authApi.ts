import axios from 'axios';

// Types for authentication
export interface AuthUser {
  id: string;
  fullName: string;
  email: string;
  profileImage?: string;
  savedArticles?: string[];
  savedScholarships?: string[];
  isAdmin?: boolean;
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
    // Get token from localStorage
    const token = localStorage.getItem('authToken');
    
    if (token) {
      console.log(`Adding auth token to request: ${config.url}`);
      // Set the token in the header
      config.headers['x-auth-token'] = token;
    } else {
      console.log(`No auth token for request: ${config.url}`);
    }
    return config;
  },
  (error: any) => {
    console.error('Request interceptor error:', error);
    return Promise.reject(error);
  }
);

// Handle 401 responses globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      console.log('Received 401 unauthorized response - clearing auth token');
      // Clear token on 401 unauthorized response
      localStorage.removeItem('authToken');
    }
    return Promise.reject(error);
  }
);

// Auth API functions
export const authApi = {
  // Register a new user
  register: async (userData: RegisterData): Promise<AuthResponse> => {
    console.log('Registering new user:', {...userData, password: '******'});
    try {
      // Make the API request
      const response = await api.post<AuthResponse>('/auth/register', userData);
      console.log('Registration API response:', response);
      
      if (!response || !response.data) {
        console.error('Empty response received from server during registration');
        throw new Error('Invalid response from server');
      }
      
      if (!response.data.token || !response.data.user) {
        console.error('Invalid response format from server:', response.data);
        throw new Error('Invalid response format from server');
      }
      
      console.log('Registration successful, token received');
      return response.data;
    } catch (error: any) {
      console.error('Registration error details:', error);
      if (error.response) {
        console.error('Server response:', error.response.status, error.response.data);
      } else if (error.request) {
        console.error('No response received from server');
      } else {
        console.error('Error setting up request:', error.message);
      }
      throw error;
    }
  },

  // Login with email/password
  login: async (credentials: LoginData): Promise<AuthResponse> => {
    console.log('Attempting login with:', credentials.email);
    try {
      const response = await api.post<AuthResponse>('/auth/login', credentials);
      console.log('Login successful, token received');
      return response.data;
    } catch (error: any) {
      console.error('Login error:', error.response?.status, error.response?.data);
      throw error;
    }
  },

  // Login with Google
  googleLogin: async (token: string): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>('/auth/google', { token });
    return response.data;
  },

  // Get current user data
  getCurrentUser: async (): Promise<AuthUser> => {
    try {
      console.log('Calling API to get current user data');
      const response = await api.get<AuthUser>('/auth/user');
      console.log('User data retrieved successfully:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('Error fetching current user:', error.response?.status, error.response?.data);
      throw error;
    }
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