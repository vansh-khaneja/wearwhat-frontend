/**
 * Wardrobe Service - Handles wardrobe/clothing API calls
 */

import { apiClient } from './client';
import type { WardrobeUploadResponse, WardrobeListResponse, WardrobeDeleteResponse } from './types';

export const wardrobeService = {
  /**
   * Upload one or more clothing images
   * Images are auto-tagged by the backend
   */
  async uploadImages(files: File[]): Promise<WardrobeUploadResponse> {
    const formData = new FormData();
    files.forEach((file) => {
      formData.append('files', file);
    });

    return apiClient.post<WardrobeUploadResponse>('/wardrobe/upload', formData);
  },

  /**
   * Get all wardrobe items for the current user
   */
  async getItems(): Promise<WardrobeListResponse> {
    return apiClient.get<WardrobeListResponse>('/wardrobe/');
  },

  /**
   * Delete a wardrobe item by ID
   */
  async deleteItem(itemId: string): Promise<WardrobeDeleteResponse> {
    return apiClient.delete<WardrobeDeleteResponse>(`/wardrobe/${itemId}`);
  },
};
