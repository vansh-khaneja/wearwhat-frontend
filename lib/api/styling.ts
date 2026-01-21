/**
 * Styling API - AI outfit recommendations
 */

import { apiClient } from './client';
import type { WardrobeItem } from './types';

export interface MatchedItem extends WardrobeItem {
  is_source?: boolean;
  match_score: number;
}

export interface StyleRecommendationResponse {
  success: boolean;
  source_item: WardrobeItem;
  combined_image_url: string;
  matched_items: MatchedItem[];
  total_items: number;
}

export const stylingService = {
  /**
   * Get style recommendation based on a selected wardrobe item
   */
  getStyleRecommendation: async (itemId: string): Promise<StyleRecommendationResponse> => {
    return apiClient.post<StyleRecommendationResponse>('/recommendation/style', { item_id: itemId });
  },
};
