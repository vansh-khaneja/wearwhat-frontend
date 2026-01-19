/**
 * User Profile API Service - Handles user profile API calls
 */

import { apiClient } from './client';

export interface UserProfile {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  profile_image_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface GetUserResponse {
  success: boolean;
  user: UserProfile;
}

export interface UpdateUserRequest {
  first_name?: string;
  last_name?: string;
}

export interface UploadProfileImageResponse {
  success: boolean;
  profile_image_url: string;
  user: UserProfile;
}

export const userService = {
  /**
   * Get current user's profile
   */
  async getProfile(): Promise<GetUserResponse> {
    return apiClient.get<GetUserResponse>('/auth/me');
  },

  /**
   * Update user's name
   */
  async updateProfile(data: UpdateUserRequest): Promise<GetUserResponse> {
    return apiClient.put<GetUserResponse>('/auth/me', data);
  },

  /**
   * Upload profile picture
   */
  async uploadProfileImage(file: File): Promise<UploadProfileImageResponse> {
    const formData = new FormData();
    formData.append('file', file);
    return apiClient.upload<UploadProfileImageResponse>('/auth/me/profile-image', formData);
  },
};
