'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Heart, Trash2, Share2, ShoppingBag } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/lib/hooks/use-auth';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { apiClient } from '@/lib/api-client';
import { formatPrice } from '@/lib/utils';

interface WishlistItem {
  id: string;
  itemType: string;
  addedAt: string;
  diamond?: {
    id: string;
    stockId: string;
    shape: string;
    caratWeight: number;
    color: string;
    clarity: string;
    cut?: string;
    priceInr: number;
    isAvailable: boolean;
    labGrown: boolean;
    certificateLab: string;
  };
  ringSetting?: {
    id: string;
    name: string;
    slug: string;
    style: string;
    basePrice: number;
    isAvailable: boolean;
  };
}

function WishlistItemCard({ item, onRemove }: { item: WishlistItem; onRemove: () => void }) {
  const { diamond, ringSetting } = item;

  if (diamond) {
    return (
      <div className="border-charcoal-200 flex items-start gap-4 rounded-xl border bg-white p-4 shadow-sm transition hover:shadow-md">
        <div className="bg-charcoal-50 h-24 w-24 flex-shrink-0 overflow-hidden rounded-lg">
          <div className="text-charcoal-300 flex h-full w-full items-center justify-center p-1 text-center text-xs">
            {diamond.shape} Diamond
          </div>
        </div>
        <div className="min-w-0 flex-1">
          <div className="mb-1 flex items-center gap-2">
            <span className="font-display text-charcoal-900 text-base font-semibold">
              {diamond.caratWeight}ct {diamond.shape} Diamond
            </span>
            {diamond.labGrown && (
              <Badge variant="secondary" className="text-xs">
                Lab Grown
              </Badge>
            )}
            {!diamond.isAvailable && (
              <Badge variant="destructive" className="text-xs">
                Unavailable
              </Badge>
            )}
          </div>
          <p className="text-charcoal-500 mb-2 text-sm">
            {diamond.color} Color · {diamond.clarity} Clarity
            {diamond.cut ? ` · ${diamond.cut} Cut` : ''} · {diamond.certificateLab}
          </p>
          <p className="text-gold-600 font-semibold">{formatPrice(diamond.priceInr)}</p>
        </div>
        <div className="flex flex-col gap-2">
          <Button asChild size="sm" disabled={!diamond.isAvailable}>
            <Link href={`/diamonds/${diamond.id}`}>View</Link>
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={onRemove}
            className="text-charcoal-400 hover:text-red-500"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
    );
  }

  if (ringSetting) {
    return (
      <div className="border-charcoal-200 flex items-start gap-4 rounded-xl border bg-white p-4 shadow-sm transition hover:shadow-md">
        <div className="bg-charcoal-50 h-24 w-24 flex-shrink-0 overflow-hidden rounded-lg">
          <div className="text-charcoal-300 flex h-full w-full items-center justify-center p-1 text-center text-xs">
            {ringSetting.style} Setting
          </div>
        </div>
        <div className="min-w-0 flex-1">
          <div className="mb-1 flex items-center gap-2">
            <span className="font-display text-charcoal-900 text-base font-semibold">
              {ringSetting.name}
            </span>
            {!ringSetting.isAvailable && (
              <Badge variant="destructive" className="text-xs">
                Unavailable
              </Badge>
            )}
          </div>
          <p className="text-charcoal-500 mb-2 text-sm">{ringSetting.style} Setting</p>
          <p className="text-gold-600 font-semibold">
            Starting at {formatPrice(ringSetting.basePrice)}
          </p>
        </div>
        <div className="flex flex-col gap-2">
          <Button asChild size="sm">
            <Link href={`/engagement-rings/${ringSetting.slug}`}>View</Link>
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={onRemove}
            className="text-charcoal-400 hover:text-red-500"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
    );
  }

  return null;
}

export default function WishlistPage() {
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const router = useRouter();
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!authLoading && !isAuthenticated) router.push('/login?redirect=/account/wishlist');
  }, [isAuthenticated, authLoading, router]);

  const { data, isLoading } = useQuery({
    queryKey: ['wishlist'],
    queryFn: () => apiClient.get('/wishlist').then((r) => r.data),
    enabled: isAuthenticated,
  });

  const removeMutation = useMutation({
    mutationFn: (itemId: string) => apiClient.delete(`/wishlist/items/${itemId}`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['wishlist'] }),
  });

  const shareMutation = useMutation({
    mutationFn: () => apiClient.post('/wishlist/share').then((r) => r.data),
    onSuccess: (data) => {
      if (typeof window !== 'undefined') {
        navigator.clipboard.writeText(data.shareUrl);
        alert('Share link copied to clipboard!');
      }
    },
  });

  if (authLoading || isLoading) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-12">
        <Skeleton className="mb-6 h-8 w-48" />
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} className="mb-4 h-32 w-full rounded-xl" />
        ))}
      </div>
    );
  }

  const items: WishlistItem[] = data?.items ?? [];

  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="font-display text-charcoal-900 text-3xl font-bold">My Wishlist</h1>
          <p className="text-charcoal-500 mt-1">
            {items.length} {items.length === 1 ? 'item' : 'items'} saved
          </p>
        </div>
        {items.length > 0 && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => shareMutation.mutate()}
            disabled={shareMutation.isPending}
          >
            <Share2 className="mr-2 h-4 w-4" />
            Share Wishlist
          </Button>
        )}
      </div>

      {items.length === 0 ? (
        <div className="border-charcoal-200 flex flex-col items-center justify-center rounded-2xl border-2 border-dashed py-20 text-center">
          <Heart className="text-charcoal-300 mb-4 h-12 w-12" />
          <h2 className="font-display text-charcoal-700 text-xl font-semibold">
            Your wishlist is empty
          </h2>
          <p className="text-charcoal-400 mt-2">Save diamonds and ring settings you love</p>
          <Button asChild className="mt-6">
            <Link href="/diamonds">
              <ShoppingBag className="mr-2 h-4 w-4" /> Browse Diamonds
            </Link>
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          {items.map((item) => (
            <WishlistItemCard
              key={item.id}
              item={item}
              onRemove={() => removeMutation.mutate(item.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
