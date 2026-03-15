'use client';

import { useSearchParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import type { DiamondSearchFilters, DiamondSearchResult, Diamond } from '@diamond-factory/types';
import { diamondsApi } from '@/lib/api/diamonds.api';
import { parseDiamondSearchUrl } from '@/lib/utils';

interface UseDiamondSearchReturn {
  diamonds: Diamond[];
  total: number;
  page: number;
  perPage: number;
  totalPages: number;
  aggregations: DiamondSearchResult['aggregations'] | undefined;
  isLoading: boolean;
  isFetching: boolean;
  error: Error | null;
  filters: DiamondSearchFilters;
  refetch: () => void;
}

const EMPTY_AGGREGATIONS: DiamondSearchResult['aggregations'] = {
  shapes: [],
  cuts: [],
  colors: [],
  clarities: [],
  fluorescence: [],
  labs: [],
  priceStats: { min: 0, max: 10000000, avg: 500000 },
  caratStats: { min: 0, max: 10, avg: 1 },
};

export function useDiamondSearch(overrideFilters?: DiamondSearchFilters): UseDiamondSearchReturn {
  const searchParams = useSearchParams();
  const urlFilters = parseDiamondSearchUrl(searchParams);
  const filters = overrideFilters || urlFilters;

  const { data, isLoading, isFetching, error, refetch } = useQuery<DiamondSearchResult, Error>({
    queryKey: ['diamonds', 'search', filters],
    queryFn: () => diamondsApi.search(filters),
    staleTime: 30 * 1000,
    placeholderData: (previousData) => previousData,
  });

  return {
    diamonds: data?.diamonds || [],
    total: data?.total || 0,
    page: data?.page || filters.page || 1,
    perPage: data?.perPage || filters.perPage || 24,
    totalPages: data?.totalPages || 0,
    aggregations: data?.aggregations || EMPTY_AGGREGATIONS,
    isLoading,
    isFetching,
    error,
    filters,
    refetch,
  };
}
