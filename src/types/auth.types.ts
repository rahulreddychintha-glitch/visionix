export interface User {
  id: string;
  fullName: string;
  email: string;
  avatar: string;
  role: string;
  createdAt: string;
  updatedAt: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export interface ApiError {
  field?: string;
  message: string;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  errors?: ApiError[];
}

export interface IRegisterInput {
  fullName: string;
  email: string;
  password: string;
}

export interface ILoginInput {
  email: string;
  password: string;
}

export interface IAuthResponse {
  user: User;
  token: string;
}
