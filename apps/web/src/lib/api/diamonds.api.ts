import { get } from '@/lib/api-client';
import type { Diamond, DiamondSearchFilters, DiamondSearchResult } from '@diamond-factory/types';
import { buildDiamondSearchUrl } from '@/lib/utils';

export const diamondsApi = {
  /**
   * Search diamonds with filters, sorting, and pagination
   */
  async search(filters: DiamondSearchFilters): Promise<DiamondSearchResult> {
    const queryString = buildDiamondSearchUrl(filters);
    return get<DiamondSearchResult>(`/diamonds?${queryString}`);
  },

  /**
   * Get a single diamond by ID
   */
  async getDiamond(id: string): Promise<Diamond> {
    return get<Diamond>(`/diamonds/${id}`);
  },

  /**
   * Compare multiple diamonds by IDs
   */
  async compareDiamonds(ids: string[]): Promise<Diamond[]> {
    return get<Diamond[]>(`/diamonds/compare?ids=${ids.join(',')}`);
  },

  /**
   * Get featured diamonds (editor's picks / best value)
   */
  async getFeaturedDiamonds(): Promise<Diamond[]> {
    return get<Diamond[]>('/diamonds/featured');
  },

  /**
   * Get related diamonds for a given diamond ID
   */
  async getRelatedDiamonds(id: string, limit = 6): Promise<Diamond[]> {
    return get<Diamond[]>(`/diamonds/${id}/related?limit=${limit}`);
  },
};
