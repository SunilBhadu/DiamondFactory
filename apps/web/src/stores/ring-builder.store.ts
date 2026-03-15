import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Diamond, RingSetting, MetalType } from '@diamond-factory/types';

interface RingBuilderState {
  selectedDiamond: Diamond | null;
  selectedSetting: RingSetting | null;
  metalType: MetalType | null;
  ringSizeUS: number | null;
  engravingText: string | null;
  engravingFont: string | null;
  currentStep: number;
}

interface RingBuilderActions {
  setDiamond: (diamond: Diamond | null) => void;
  setSetting: (setting: RingSetting | null) => void;
  setMetal: (metalType: MetalType) => void;
  setSize: (size: number) => void;
  setEngraving: (text: string, font: string) => void;
  clearEngraving: () => void;
  nextStep: () => void;
  prevStep: () => void;
  goToStep: (step: number) => void;
  resetBuilder: () => void;
  totalPrice: number;
  isComplete: boolean;
  canProceedToCheckout: boolean;
}

type RingBuilderStore = RingBuilderState & RingBuilderActions;

export const useRingBuilderStore = create<RingBuilderStore>()(
  persist(
    (set, get) => ({
      selectedDiamond: null,
      selectedSetting: null,
      metalType: null,
      ringSizeUS: null,
      engravingText: null,
      engravingFont: null,
      currentStep: 0,

      setDiamond: (diamond) => set({ selectedDiamond: diamond }),

      setSetting: (setting) => set({ selectedSetting: setting }),

      setMetal: (metalType) => set({ metalType }),

      setSize: (ringSizeUS) => set({ ringSizeUS }),

      setEngraving: (engravingText, engravingFont) => set({ engravingText, engravingFont }),

      clearEngraving: () => set({ engravingText: null, engravingFont: null }),

      nextStep: () =>
        set((state) => ({
          currentStep: Math.min(state.currentStep + 1, 3),
        })),

      prevStep: () =>
        set((state) => ({
          currentStep: Math.max(state.currentStep - 1, 0),
        })),

      goToStep: (step) => set({ currentStep: Math.max(0, Math.min(step, 3)) }),

      resetBuilder: () =>
        set({
          selectedDiamond: null,
          selectedSetting: null,
          metalType: null,
          ringSizeUS: null,
          engravingText: null,
          engravingFont: null,
          currentStep: 0,
        }),

      get totalPrice() {
        const { selectedDiamond, selectedSetting, engravingText } = get();
        let price = 0;
        if (selectedDiamond) price += selectedDiamond.retailPrice;
        if (selectedSetting) price += selectedSetting.basePrice;
        if (engravingText) price += 2500;
        return price;
      },

      get isComplete() {
        const { selectedDiamond, selectedSetting, metalType, ringSizeUS } = get();
        return !!(selectedDiamond && selectedSetting && metalType && ringSizeUS);
      },

      get canProceedToCheckout() {
        return get().isComplete;
      },
    }),
    {
      name: 'diamond-factory-ring-builder',
      partialize: (state) => ({
        selectedDiamond: state.selectedDiamond,
        selectedSetting: state.selectedSetting,
        metalType: state.metalType,
        ringSizeUS: state.ringSizeUS,
        engravingText: state.engravingText,
        engravingFont: state.engravingFont,
        currentStep: state.currentStep,
      }),
    }
  )
);
