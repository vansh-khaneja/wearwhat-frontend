/**
 * Auth Service - Handles authentication API calls
 */

import { apiClient } from './client';
import type { LoginRequest, SignupRequest, AuthResponse, LogoutResponse } from './types';

export const authService = {
  /**
   * Login user with email and password
   */
  async login(credentials: LoginRequest): Promise<AuthResponse> {
    return apiClient.post<AuthResponse>('/auth/login', credentials);
  },

  /**
   * Register a new user
   */
  async signup(userData: SignupRequest): Promise<AuthResponse> {
    return apiClient.post<AuthResponse>('/auth/signup', userData);
  },

  /**
   * Logout current user (clears auth cookie)
   */
  async logout(): Promise<LogoutResponse> {
    return apiClient.post<LogoutResponse>('/auth/logout');
  },
};
