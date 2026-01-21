/**
 * Saved Images Service - Handles saved images API calls
 */

import { apiClient } from './client';
import type { SavedImageResponse, SavedImageListResponse, SaveImageRequest } from './types';

export const savedImagesService = {
  /**
   * Save an image for the user
   */
  async saveImage(data: SaveImageRequest): Promise<SavedImageResponse> {
    return apiClient.post<SavedImageResponse>('/saved-images/save', data);
  },

  /**
   * Get all saved images for the user
   */
  async getAll(): Promise<SavedImageListResponse> {
    return apiClient.get<SavedImageListResponse>('/saved-images');
  },

  /**
   * Delete a saved image by ID
   */
  async delete(savedImageId: string): Promise<{ success: boolean }> {
    return apiClient.delete<{ success: boolean }>(`/saved-images/${savedImageId}`);
  },
};
