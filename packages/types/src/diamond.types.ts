// Diamond shape enum
export type DiamondShape =
  | 'round'
  | 'princess'
  | 'oval'
  | 'cushion'
  | 'marquise'
  | 'pear'
  | 'radiant'
  | 'asscher'
  | 'emerald'
  | 'heart';

// Diamond color grade
export type DiamondColor = 'D' | 'E' | 'F' | 'G' | 'H' | 'I' | 'J' | 'K' | 'L' | 'M';

// Diamond clarity grade
export type DiamondClarity =
  | 'FL'
  | 'IF'
  | 'VVS1'
  | 'VVS2'
  | 'VS1'
  | 'VS2'
  | 'SI1'
  | 'SI2'
  | 'I1'
  | 'I2'
  | 'I3';

// Diamond cut grade
export type DiamondCut = 'Ideal' | 'Excellent' | 'Very Good' | 'Good' | 'Fair' | 'Poor';

// Diamond fluorescence
export type DiamondFluorescence = 'None' | 'Faint' | 'Medium' | 'Strong' | 'Very Strong';

// Certificate lab
export type CertificateLab = 'GIA' | 'IGI' | 'AGS' | 'HRD' | 'EGL';

// Metal type
export type MetalType =
  | 'platinum'
  | '18k-white-gold'
  | '18k-yellow-gold'
  | '18k-rose-gold'
  | '14k-white-gold'
  | '14k-yellow-gold'
  | '14k-rose-gold';

// Diamond image
export interface DiamondImage {
  url: string;
  angle?: string;
  type?: 'photo' | 'video' | '360';
}

// Full Diamond interface
export interface Diamond {
  id: string;
  sku: string;
  supplierId?: string;
  supplierStockId?: string;
  shape: DiamondShape;
  carat: number;
  color: DiamondColor;
  clarity: DiamondClarity;
  cut?: DiamondCut;
  polish?: string;
  symmetry?: string;
  fluorescence?: DiamondFluorescence;
  certificateLab: CertificateLab;
  certificateNo?: string;
  certificateUrl?: string;
  depthPct?: number;
  tablePct?: number;
  lengthMm?: number;
  widthMm?: number;
  depthMm?: number;
  girdle?: string;
  culet?: string;
  crownAngle?: number;
  pavilionAngle?: number;
  lwRatio?: number;
  eyeClean?: boolean;
  labGrown: boolean;
  originCountry?: string;
  treatment?: string;
  costPrice?: number;
  retailPrice: number;
  markupPct?: number;
  currency: string;
  isAvailable: boolean;
  isMemo: boolean;
  images: DiamondImage[];
  videoUrl?: string;
  v360Url?: string;
  inWishlistCount: number;
  viewCount: number;
  createdAt: Date;
  updatedAt: Date;
}

// Diamond search filters
export interface DiamondSearchFilters {
  shapes?: DiamondShape[];
  caratMin?: number;
  caratMax?: number;
  colorFrom?: DiamondColor;
  colorTo?: DiamondColor;
  clarityFrom?: DiamondClarity;
  clarityTo?: DiamondClarity;
  cutGrades?: DiamondCut[];
  priceMin?: number;
  priceMax?: number;
  depthMin?: number;
  depthMax?: number;
  tableMin?: number;
  tableMax?: number;
  labs?: CertificateLab[];
  fluorescence?: DiamondFluorescence[];
  labGrown?: boolean;
  eyeClean?: boolean;
  sort?: DiamondSortOption;
  page?: number;
  perPage?: number;
}

export type DiamondSortOption =
  | 'price_asc'
  | 'price_desc'
  | 'carat_asc'
  | 'carat_desc'
  | 'newest'
  | 'popular';

// Diamond search result
export interface DiamondSearchResult {
  diamonds: Diamond[];
  total: number;
  page: number;
  perPage: number;
  totalPages: number;
  aggregations: DiamondAggregations;
}

export interface DiamondAggregations {
  shapes: AggregationBucket[];
  cuts: AggregationBucket[];
  colors: AggregationBucket[];
  clarities: AggregationBucket[];
  fluorescence: AggregationBucket[];
  labs: AggregationBucket[];
  priceStats: { min: number; max: number; avg: number };
  caratStats: { min: number; max: number; avg: number };
}

export interface AggregationBucket {
  key: string;
  count: number;
}
