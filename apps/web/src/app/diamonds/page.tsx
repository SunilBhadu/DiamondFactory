'use client';

import { Suspense, useState, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { SlidersHorizontal, X, ChevronDown, ChevronUp } from 'lucide-react';
import type { DiamondSearchFilters, DiamondSortOption } from '@diamond-factory/types';
import { DiamondFilters } from '@/components/diamonds/diamond-filters';
import { DiamondCard } from '@/components/diamonds/diamond-card';
import { Skeleton } from '@/components/ui/skeleton';
import { useDiamondSearch } from '@/lib/hooks/use-diamond-search';
import { buildDiamondSearchUrl, parseDiamondSearchUrl } from '@/lib/utils';

const sortOptions: { label: string; value: DiamondSortOption }[] = [
  { label: 'Price: Low to High', value: 'price_asc' },
  { label: 'Price: High to Low', value: 'price_desc' },
  { label: 'Carat: Low to High', value: 'carat_asc' },
  { label: 'Carat: High to Low', value: 'carat_desc' },
  { label: 'Newest First', value: 'newest' },
  { label: 'Most Popular', value: 'popular' },
];

function DiamondSearchContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [compareIds, setCompareIds] = useState<string[]>([]);

  const filters = parseDiamondSearchUrl(searchParams);
  const { diamonds, total, isLoading, isFetching, aggregations } = useDiamondSearch(filters);

  const updateFilters = useCallback(
    (newFilters: Partial<DiamondSearchFilters>) => {
      const merged = { ...filters, ...newFilters, page: 1 };
      const url = buildDiamondSearchUrl(merged);
      router.replace(`/diamonds?${url}`, { scroll: false });
    },
    [filters, router]
  );

  const clearFilters = useCallback(() => {
    router.replace('/diamonds', { scroll: false });
  }, [router]);

  const handleSort = (sort: DiamondSortOption) => {
    updateFilters({ sort });
  };

  const handlePage = (page: number) => {
    const url = buildDiamondSearchUrl({ ...filters, page });
    router.replace(`/diamonds?${url}`, { scroll: true });
  };

  const handleCompare = (id: string) => {
    setCompareIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : prev.length < 4 ? [...prev, id] : prev
    );
  };

  const activeFilterCount = [
    filters.shapes?.length,
    filters.caratMin !== undefined || filters.caratMax !== undefined ? 1 : 0,
    filters.priceMin !== undefined || filters.priceMax !== undefined ? 1 : 0,
    filters.colorFrom || filters.colorTo ? 1 : 0,
    filters.clarityFrom || filters.clarityTo ? 1 : 0,
    filters.cutGrades?.length,
    filters.labs?.length,
    filters.fluorescence?.length,
    filters.labGrown !== undefined ? 1 : 0,
    filters.eyeClean !== undefined ? 1 : 0,
  ].reduce((a: number, b) => a + (b || 0), 0);

  const totalPages = Math.ceil(total / (filters.perPage || 24));

  return (
    <div className="min-h-screen bg-white">
      {/* Page Header */}
      <div className="bg-charcoal-950 py-16 text-white">
        <div className="container mx-auto">
          <h1 className="font-display mb-4 text-4xl font-bold md:text-5xl">Diamond Collection</h1>
          <p className="text-charcoal-300 text-lg">
            {total.toLocaleString()} certified diamonds — GIA, IGI & more
          </p>
        </div>
      </div>

      <div className="container mx-auto py-8">
        {/* Mobile filter toggle + sort bar */}
        <div className="mb-6 flex items-center justify-between gap-4 lg:hidden">
          <button
            onClick={() => setSidebarOpen(true)}
            className="border-charcoal-300 hover:border-gold-500 flex items-center gap-2 rounded-lg border px-4 py-2 text-sm font-medium transition-colors"
          >
            <SlidersHorizontal className="h-4 w-4" />
            Filters
            {activeFilterCount > 0 && (
              <span className="bg-gold-500 flex h-5 w-5 items-center justify-center rounded-full text-xs text-white">
                {activeFilterCount}
              </span>
            )}
          </button>

          <div className="flex items-center gap-2">
            <span className="text-charcoal-500 text-sm">
              {isFetching ? 'Loading...' : `${total.toLocaleString()} results`}
            </span>
            <select
              value={filters.sort || 'price_asc'}
              onChange={(e) => handleSort(e.target.value as DiamondSortOption)}
              className="border-charcoal-300 focus:border-gold-500 rounded-lg border px-3 py-2 text-sm focus:outline-none"
            >
              {sortOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex gap-8">
          {/* Sidebar - Desktop */}
          <aside className="hidden w-72 shrink-0 lg:block">
            <div className="sticky top-24">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-charcoal-900 font-semibold">Filters</h2>
                {activeFilterCount > 0 && (
                  <button
                    onClick={clearFilters}
                    className="text-gold-600 hover:text-gold-700 flex items-center gap-1 text-sm"
                  >
                    <X className="h-3 w-3" />
                    Clear ({activeFilterCount})
                  </button>
                )}
              </div>
              <DiamondFilters filters={filters} onChange={updateFilters} />
            </div>
          </aside>

          {/* Mobile Sidebar Overlay */}
          {sidebarOpen && (
            <div className="fixed inset-0 z-50 lg:hidden">
              <div className="absolute inset-0 bg-black/50" onClick={() => setSidebarOpen(false)} />
              <div className="absolute top-0 bottom-0 left-0 w-80 overflow-y-auto bg-white p-6 shadow-2xl">
                <div className="mb-6 flex items-center justify-between">
                  <h2 className="text-lg font-semibold">Filters</h2>
                  <button onClick={() => setSidebarOpen(false)}>
                    <X className="h-5 w-5" />
                  </button>
                </div>
                <DiamondFilters filters={filters} onChange={updateFilters} />
              </div>
            </div>
          )}

          {/* Results */}
          <div className="min-w-0 flex-1">
            {/* Desktop sort + count bar */}
            <div className="mb-6 hidden items-center justify-between lg:flex">
              <p className="text-charcoal-500 text-sm">
                {isFetching ? (
                  <span className="animate-pulse">Loading...</span>
                ) : (
                  `Showing ${((filters.page || 1) - 1) * (filters.perPage || 24) + 1}–${Math.min((filters.page || 1) * (filters.perPage || 24), total)} of ${total.toLocaleString()} diamonds`
                )}
              </p>
              <div className="flex items-center gap-3">
                <span className="text-charcoal-500 text-sm">Sort by:</span>
                <select
                  value={filters.sort || 'price_asc'}
                  onChange={(e) => handleSort(e.target.value as DiamondSortOption)}
                  className="border-charcoal-300 focus:border-gold-500 rounded-lg border px-3 py-2 text-sm focus:outline-none"
                >
                  {sortOptions.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Diamond Grid */}
            {isLoading ? (
              <div className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-4">
                {Array.from({ length: 12 }).map((_, i) => (
                  <div key={i} className="overflow-hidden rounded-xl">
                    <Skeleton className="aspect-square" />
                    <div className="space-y-2 p-4">
                      <Skeleton className="h-4 w-3/4" />
                      <Skeleton className="h-3 w-1/2" />
                      <Skeleton className="h-4 w-1/3" />
                    </div>
                  </div>
                ))}
              </div>
            ) : diamonds.length === 0 ? (
              <div className="py-20 text-center">
                <div className="clip-diamond bg-charcoal-100 mx-auto mb-6 h-16 w-16" />
                <h3 className="font-display text-charcoal-900 mb-2 text-xl font-semibold">
                  No diamonds found
                </h3>
                <p className="text-charcoal-500 mb-6">
                  Try adjusting your filters to find the perfect diamond.
                </p>
                <button
                  onClick={clearFilters}
                  className="bg-gold-500 hover:bg-gold-600 rounded-full px-6 py-3 font-medium text-white transition-colors"
                >
                  Clear All Filters
                </button>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-4">
                  {diamonds.map((diamond) => (
                    <DiamondCard
                      key={diamond.id}
                      diamond={diamond}
                      onCompare={handleCompare}
                      isComparing={compareIds.includes(diamond.id)}
                      showCompare={true}
                    />
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="mt-12 flex items-center justify-center gap-2">
                    <button
                      onClick={() => handlePage((filters.page || 1) - 1)}
                      disabled={(filters.page || 1) <= 1}
                      className="border-charcoal-300 hover:border-gold-500 rounded-lg border px-4 py-2 text-sm transition-colors disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      Previous
                    </button>
                    {Array.from({ length: Math.min(totalPages, 7) }).map((_, i) => {
                      const page = i + 1;
                      return (
                        <button
                          key={page}
                          onClick={() => handlePage(page)}
                          className={`h-10 w-10 rounded-lg text-sm font-medium transition-colors ${
                            (filters.page || 1) === page
                              ? 'bg-gold-500 text-white'
                              : 'border-charcoal-300 hover:border-gold-500 border'
                          }`}
                        >
                          {page}
                        </button>
                      );
                    })}
                    <button
                      onClick={() => handlePage((filters.page || 1) + 1)}
                      disabled={(filters.page || 1) >= totalPages}
                      className="border-charcoal-300 hover:border-gold-500 rounded-lg border px-4 py-2 text-sm transition-colors disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      Next
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function DiamondsPage() {
  return (
    <Suspense
      fallback={<div className="flex min-h-screen items-center justify-center">Loading...</div>}
    >
      <DiamondSearchContent />
    </Suspense>
  );
}
