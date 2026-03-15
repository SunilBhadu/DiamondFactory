import { create } from 'zustand';
import type { Diamond } from '@diamond-factory/types';

interface DiamondComparisonState {
  diamonds: Diamond[];
  isOpen: boolean;
}

interface DiamondComparisonActions {
  addDiamond: (diamond: Diamond) => void;
  removeDiamond: (id: string) => void;
  clearAll: () => void;
  openComparison: () => void;
  closeComparison: () => void;
  toggleComparison: () => void;
  canAddMore: boolean;
  isInComparison: (id: string) => boolean;
}

type DiamondComparisonStore = DiamondComparisonState & DiamondComparisonActions;

export const useDiamondComparisonStore = create<DiamondComparisonStore>((set, get) => ({
  diamonds: [],
  isOpen: false,

  addDiamond: (diamond) => {
    const { diamonds } = get();
    if (diamonds.length >= 4) return;
    if (diamonds.some((d) => d.id === diamond.id)) return;
    set({ diamonds: [...diamonds, diamond] });
  },

  removeDiamond: (id) => {
    set((state) => ({
      diamonds: state.diamonds.filter((d) => d.id !== id),
      isOpen: state.diamonds.length <= 2 ? false : state.isOpen,
    }));
  },

  clearAll: () => set({ diamonds: [], isOpen: false }),

  openComparison: () => {
    if (get().diamonds.length >= 2) set({ isOpen: true });
  },

  closeComparison: () => set({ isOpen: false }),

  toggleComparison: () => {
    const { isOpen, diamonds } = get();
    if (!isOpen && diamonds.length < 2) return;
    set({ isOpen: !isOpen });
  },

  get canAddMore() {
    return get().diamonds.length < 4;
  },

  isInComparison: (id) => get().diamonds.some((d) => d.id === id),
}));
