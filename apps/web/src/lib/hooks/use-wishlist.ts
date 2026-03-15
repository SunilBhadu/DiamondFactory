'use client';

import { useState, useEffect, useCallback } from 'react';
import { useAuth } from './use-auth';

const API_BASE = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000') + '/api/v1';

// Frontend types — 'setting' maps to backend's 'ring_setting'
type WishlistItemType = 'diamond' | 'setting' | 'product';
type BackendItemType = 'diamond' | 'ring_setting' | 'jewelry';

function toBackendType(type: WishlistItemType): BackendItemType {
  if (type === 'setting') return 'ring_setting';
  if (type === 'product') return 'jewelry';
  return 'diamond';
}

interface WishlistItem {
  type: WishlistItemType;
  id: string;
  addedAt: Date;
}

const WISHLIST_KEY = 'diamond-factory-wishlist';

function getLocalWishlist(): WishlistItem[] {
  if (typeof window === 'undefined') return [];
  try {
    const stored = localStorage.getItem(WISHLIST_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

function setLocalWishlist(items: WishlistItem[]): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(WISHLIST_KEY, JSON.stringify(items));
}

export function useWishlist() {
  const { isAuthenticated } = useAuth();
  const [items, setItems] = useState<WishlistItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Load initial wishlist
  useEffect(() => {
    if (!isAuthenticated) {
      // Guest: use localStorage
      setItems(getLocalWishlist());
    } else {
      // Authenticated: fetch from API
      setIsLoading(true);
      fetch(`${API_BASE}/wishlist`, {
        credentials: 'include',
      })
        .then((res) => (res.ok ? res.json() : null))
        .then((data) => {
          if (data?.items) {
            setItems(
              data.items.map((i: { itemType: BackendItemType; diamondId?: string; settingId?: string; productId?: string; createdAt: string }) => ({
                type: i.itemType === 'ring_setting' ? 'setting' : i.itemType === 'jewelry' ? 'product' : ('diamond' as WishlistItemType),
                id: i.diamondId || i.settingId || i.productId || '',
                addedAt: new Date(i.createdAt),
              }))
            );
          }
        })
        .catch(() => {})
        .finally(() => setIsLoading(false));
    }
  }, [isAuthenticated]);

  const isInWishlist = useCallback(
    (type: WishlistItemType, id: string): boolean => {
      return items.some((item) => item.type === type && item.id === id);
    },
    [items]
  );

  const addToWishlist = useCallback(
    async (type: WishlistItemType, id: string) => {
      const newItem: WishlistItem = { type, id, addedAt: new Date() };

      if (!isAuthenticated) {
        const updated = [...items, newItem];
        setItems(updated);
        setLocalWishlist(updated);
        return;
      }

      try {
        await fetch(`${API_BASE}/wishlist/items`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({ itemType: toBackendType(type), itemId: id }),
        });
        setItems((prev) => [...prev, newItem]);
      } catch {
        // Silently fail
      }
    },
    [isAuthenticated, items]
  );

  const removeFromWishlist = useCallback(
    async (type: WishlistItemType, id: string) => {
      if (!isAuthenticated) {
        const updated = items.filter((i) => !(i.type === type && i.id === id));
        setItems(updated);
        setLocalWishlist(updated);
        return;
      }

      try {
        // Use toggle endpoint so the server resolves the wishlist item UUID by (userId, itemType, itemId)
        await fetch(`${API_BASE}/wishlist/items/toggle`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({ itemType: toBackendType(type), itemId: id }),
        });
        setItems((prev) => prev.filter((i) => !(i.type === type && i.id === id)));
      } catch {
        // Silently fail
      }
    },
    [isAuthenticated, items]
  );

  const toggleWishlist = useCallback(
    async (type: WishlistItemType, id: string) => {
      if (isInWishlist(type, id)) {
        await removeFromWishlist(type, id);
      } else {
        await addToWishlist(type, id);
      }
    },
    [isInWishlist, addToWishlist, removeFromWishlist]
  );

  return {
    items,
    count: items.length,
    isLoading,
    isInWishlist,
    addToWishlist,
    removeFromWishlist,
    toggleWishlist,
  };
}
