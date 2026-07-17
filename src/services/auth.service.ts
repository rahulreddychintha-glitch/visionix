import api from './api';
import type { User, ApiResponse, IRegisterInput, ILoginInput, IAuthResponse } from '../types/auth.types';

// Let's declare local input interfaces if they weren't fully in auth.types.ts
export interface RegisterPayload extends IRegisterInput {}
export interface LoginPayload extends ILoginInput {}

export class AuthService {
  /**
   * Registers a new user.
   */
  public static async register(data: RegisterPayload): Promise<IAuthResponse> {
    const response = await api.post<ApiResponse<IAuthResponse>>('/auth/register', data);
    return response.data.data;
  }

  /**
   * Logins a user with email and password.
   */
  public static async login(data: LoginPayload): Promise<IAuthResponse> {
    const response = await api.post<ApiResponse<IAuthResponse>>('/auth/login', data);
    return response.data.data;
  }

  /**
   * Fetches the current user details using the active JWT.
   */
  public static async getMe(): Promise<{ user: User }> {
    const response = await api.get<ApiResponse<{ user: User }>>('/auth/me');
    return response.data.data;
  }

  /**
   * Logs out the user on the server.
   */
  public static async logout(): Promise<void> {
    await api.post<ApiResponse<null>>('/auth/logout');
  }
}
