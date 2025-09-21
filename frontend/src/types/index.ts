// Receipt related types
export interface Receipt {
  id: number;
  storeName: string;
  purchaseDate: string;
  totalAmount: number;
  imageUrl?: string;
  rawOcrText?: string;
  processedData?: string;
  items: ReceiptItem[];
  createdAt: string;
  updatedAt: string;
}

export interface ReceiptItem {
  id: number;
  itemName: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  category?: string;
  isIngredient: boolean;
  expiryDate?: string;
  receipt: Receipt;
}

// Recipe related types
export interface Recipe {
  id: number;
  name: string;
  description?: string;
  instructions?: string;
  cookingTime?: number;
  servings?: number;
  difficultyLevel?: 'EASY' | 'MEDIUM' | 'HARD';
  category?: string;
  imageUrl?: string;
  ingredients: RecipeIngredient[];
  createdAt: string;
  updatedAt: string;
}

export interface RecipeIngredient {
  id: number;
  ingredientName: string;
  quantity: number;
  unit: string;
  notes?: string;
  recipe: Recipe;
}

// API Response types
export interface ApiResponse<T> {
  data: T;
  message: string;
  success: boolean;
}

export interface PaginatedResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
}

// Upload related types
export interface UploadResponse {
  receiptId: number;
  message: string;
  success: boolean;
}

export interface OcrResult {
  rawText: string;
  processedData: {
    storeName: string;
    purchaseDate: string;
    totalAmount: number;
    items: {
      itemName: string;
      quantity: number;
      unitPrice: number;
      totalPrice: number;
      category?: string;
      isIngredient?: boolean;
    }[];
  };
}

// Search and filter types
export interface ReceiptSearchParams {
  storeName?: string;
  startDate?: string;
  endDate?: string;
  minAmount?: number;
  maxAmount?: number;
  keyword?: string;
  page?: number;
  size?: number;
}

export interface RecipeSearchParams {
  name?: string;
  category?: string;
  difficultyLevel?: string;
  maxCookingTime?: number;
  ingredientNames?: string[];
  page?: number;
  size?: number;
}

// UI State types
export interface LoadingState {
  isLoading: boolean;
  error?: string;
}

export interface UploadState extends LoadingState {
  progress?: number;
  uploadedFile?: File;
}

// Auth related types
export interface User {
  id: number;
  username: string;
  email: string;
  displayName?: string;
  avatarUrl?: string;
  preferences?: string;
  roles: string[];
  createdAt?: string;
  updatedAt?: string;
}

export interface LoginRequest {
  usernameOrEmail: string;
  password: string;
}

export interface SignupRequest {
  username: string;
  email: string;
  password: string;
  displayName?: string;
}

export interface AuthResponse {
  accessToken: string;
  tokenType: string;
  id: number;
  username: string;
  email: string;
  displayName?: string;
  roles: string[];
}

// Community related types
export interface Post {
  id: number;
  title: string;
  content: string;
  author: {
    id: number;
    username: string;
    displayName?: string;
    avatarUrl?: string;
  };
  authorName?: string;
  authorAvatarUrl?: string;
  viewCount: number;
  likeCount: number;
  commentCount: number;
  status: 'DRAFT' | 'PUBLISHED' | 'HIDDEN' | 'DELETED';
  createdAt: string;
  updatedAt: string;
}

export interface Comment {
  id: number;
  content: string;
  author: {
    id: number;
    username: string;
    displayName?: string;
    avatarUrl?: string;
  };
  post: {
    id: number;
  };
  parentComment?: {
    id: number;
  };
  likeCount: number;
  replyCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface PostRequest {
  title: string;
  content: string;
}

export interface CommentRequest {
  content: string;
  parentCommentId?: number;
}

export interface PostLikeResponse {
  isLiked: boolean;
  message: string;
}

// Profile related types
export interface ProfileUpdateRequest {
  displayName?: string;
  email?: string;
  avatarUrl?: string;
  preferences?: string;
}

export interface PasswordChangeRequest {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export interface UserStats {
  postCount: number;
  recentPosts: Post[];
}
