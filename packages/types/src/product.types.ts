import type { DiamondShape, MetalType } from './diamond.types';

export type ProductType = 'ring-setting' | 'necklace' | 'earring' | 'bracelet' | 'pendant';

export type RingStyle =
  | 'solitaire'
  | 'halo'
  | 'three-stone'
  | 'vintage'
  | 'pave'
  | 'tension'
  | 'bezel'
  | 'channel';

export interface ProductImage {
  url: string;
  alt?: string;
  isPrimary?: boolean;
  angle?: string;
  metalType?: MetalType;
}

export interface SideStone {
  shape: string;
  totalCarat: number;
  color: string;
  clarity: string;
  count: number;
}

export interface RingSetting {
  id: string;
  sku: string;
  name: string;
  slug: string;
  style: RingStyle;
  metalType: MetalType;
  metalWeightG?: number;
  compatibleShapes: DiamondShape[];
  minCarat: number;
  maxCarat: number;
  centerProng?: number;
  sideStones?: SideStone[];
  engravingAvailable: boolean;
  maxEngravingChars?: number;
  basePrice: number;
  images: ProductImage[];
  videoUrl?: string;
  isActive: boolean;
  metaTitle?: string;
  metaDescription?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ProductVariant {
  id: string;
  productId: string;
  metalType: MetalType;
  price: number;
  sku: string;
  isAvailable: boolean;
  images?: ProductImage[];
}

export interface JewelryProduct {
  id: string;
  sku: string;
  name: string;
  slug: string;
  productType: ProductType;
  description: string;
  shortDescription?: string;
  price: number;
  salePrice?: number;
  currency: string;
  images: ProductImage[];
  videoUrl?: string;
  metalOptions: MetalType[];
  variants: ProductVariant[];
  weight?: number;
  dimensions?: {
    length?: number;
    width?: number;
    height?: number;
  };
  careInstructions?: string;
  isActive: boolean;
  isFeatured: boolean;
  tags: string[];
  metaTitle?: string;
  metaDescription?: string;
  stock: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface RingBuilderConfig {
  diamondId: string;
  settingId: string;
  metalType: MetalType;
  ringSizeUS: number;
  engravingText?: string;
  engravingFont?: string;
}

export interface RingBuilderPrice {
  diamondPrice: number;
  settingPrice: number;
  engravingPrice: number;
  subtotal: number;
  taxAmount: number;
  taxRate: number;
  total: number;
  currency: string;
}
