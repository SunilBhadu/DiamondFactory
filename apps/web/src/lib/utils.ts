import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import type {
  DiamondShape,
  DiamondColor,
  DiamondClarity,
  DiamondSearchFilters,
} from '@diamond-factory/types';

export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

/**
 * Format a price in Indian Rupees with proper formatting
 */
export function formatPrice(amount: number, currency = 'INR'): string {
  if (currency !== 'INR') {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  }

  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

/**
 * Format carat weight with 'ct' suffix
 */
export function formatCarat(carat: number): string {
  return `${carat.toFixed(2)}ct`;
}

/**
 * Format a date to a readable string
 */
export function formatDate(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

/**
 * Generate a unique order number
 */
export function generateOrderNumber(): string {
  const year = new Date().getFullYear();
  const random = Math.floor(Math.random() * 90000) + 10000;
  return `DF-${year}-${random}`;
}

/**
 * Truncate text to a given length
 */
export function truncate(text: string, length: number): string {
  if (text.length <= length) return text;
  return text.slice(0, length) + '...';
}

/**
 * Convert a string to a URL slug
 */
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
}

/**
 * Get diamond shape SVG path
 */
export function getDiamondShapeIcon(shape: DiamondShape): string {
  const paths: Record<DiamondShape, string> = {
    round: 'M12 2L22 12L12 22L2 12L12 2Z',
    princess: 'M4 4H20V20H4Z',
    oval: 'M12 2C7 2 2 7 2 12S7 22 12 22 22 17 22 12 17 2 12 2Z',
    cushion:
      'M5 3H19C20.7 3 22 4.3 22 6V18C22 19.7 20.7 21 19 21H5C3.3 21 2 19.7 2 18V6C2 4.3 3.3 3 5 3Z',
    marquise: 'M12 2L22 12L12 22L2 12L12 2Z',
    pear: 'M12 2C8 2 4 6 4 10C4 14 8 20 12 22C16 20 20 14 20 10C20 6 16 2 12 2Z',
    radiant: 'M6 2H18L22 6V18L18 22H6L2 18V6L6 2Z',
    asscher: 'M7 2H17L22 7V17L17 22H7L2 17V7L7 2Z',
    emerald: 'M6 2H18L22 8V16L18 22H6L2 16V8L6 2Z',
    heart:
      'M12 21.593C11.756 21.44 2 15.591 2 9A5 5 0 0 1 12 6.1A5 5 0 0 1 22 9C22 15.591 12.244 21.44 12 21.593Z',
  };
  return paths[shape] || paths.round;
}

const colorOrder: DiamondColor[] = ['D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M'];
const clarityOrder: DiamondClarity[] = [
  'FL',
  'IF',
  'VVS1',
  'VVS2',
  'VS1',
  'VS2',
  'SI1',
  'SI2',
  'I1',
  'I2',
  'I3',
];

/**
 * Get array of colors between two grades (inclusive)
 */
export function getColorRange(from: DiamondColor, to: DiamondColor): DiamondColor[] {
  const fromIdx = colorOrder.indexOf(from);
  const toIdx = colorOrder.indexOf(to);
  if (fromIdx === -1 || toIdx === -1) return [];
  const [start, end] = fromIdx <= toIdx ? [fromIdx, toIdx] : [toIdx, fromIdx];
  return colorOrder.slice(start, end + 1);
}

/**
 * Get array of clarities between two grades (inclusive)
 */
export function getClarityRange(from: DiamondClarity, to: DiamondClarity): DiamondClarity[] {
  const fromIdx = clarityOrder.indexOf(from);
  const toIdx = clarityOrder.indexOf(to);
  if (fromIdx === -1 || toIdx === -1) return [];
  const [start, end] = fromIdx <= toIdx ? [fromIdx, toIdx] : [toIdx, fromIdx];
  return clarityOrder.slice(start, end + 1);
}

/**
 * Build URL search params string from DiamondSearchFilters
 */
export function buildDiamondSearchUrl(filters: DiamondSearchFilters): string {
  const params = new URLSearchParams();

  if (filters.shapes?.length) params.set('shapes', filters.shapes.join(','));
  if (filters.caratMin !== undefined) params.set('caratMin', String(filters.caratMin));
  if (filters.caratMax !== undefined) params.set('caratMax', String(filters.caratMax));
  if (filters.colorFrom) params.set('colorFrom', filters.colorFrom);
  if (filters.colorTo) params.set('colorTo', filters.colorTo);
  if (filters.clarityFrom) params.set('clarityFrom', filters.clarityFrom);
  if (filters.clarityTo) params.set('clarityTo', filters.clarityTo);
  if (filters.cutGrades?.length) params.set('cutGrades', filters.cutGrades.join(','));
  if (filters.priceMin !== undefined) params.set('priceMin', String(filters.priceMin));
  if (filters.priceMax !== undefined) params.set('priceMax', String(filters.priceMax));
  if (filters.depthMin !== undefined) params.set('depthMin', String(filters.depthMin));
  if (filters.depthMax !== undefined) params.set('depthMax', String(filters.depthMax));
  if (filters.tableMin !== undefined) params.set('tableMin', String(filters.tableMin));
  if (filters.tableMax !== undefined) params.set('tableMax', String(filters.tableMax));
  if (filters.labs?.length) params.set('labs', filters.labs.join(','));
  if (filters.fluorescence?.length) params.set('fluorescence', filters.fluorescence.join(','));
  if (filters.labGrown !== undefined) params.set('labGrown', String(filters.labGrown));
  if (filters.eyeClean !== undefined) params.set('eyeClean', String(filters.eyeClean));
  if (filters.sort) params.set('sort', filters.sort);
  if (filters.page && filters.page > 1) params.set('page', String(filters.page));
  if (filters.perPage && filters.perPage !== 24) params.set('perPage', String(filters.perPage));

  return params.toString();
}

/**
 * Parse URL search params into DiamondSearchFilters
 */
export function parseDiamondSearchUrl(
  searchParams: URLSearchParams | ReadonlyURLSearchParams
): DiamondSearchFilters {
  const filters: DiamondSearchFilters = {};

  const shapes = searchParams.get('shapes');
  if (shapes) filters.shapes = shapes.split(',') as DiamondShape[];

  const caratMin = searchParams.get('caratMin');
  if (caratMin) filters.caratMin = parseFloat(caratMin);

  const caratMax = searchParams.get('caratMax');
  if (caratMax) filters.caratMax = parseFloat(caratMax);

  const colorFrom = searchParams.get('colorFrom');
  if (colorFrom) filters.colorFrom = colorFrom as DiamondColor;

  const colorTo = searchParams.get('colorTo');
  if (colorTo) filters.colorTo = colorTo as DiamondColor;

  const clarityFrom = searchParams.get('clarityFrom');
  if (clarityFrom) filters.clarityFrom = clarityFrom as DiamondClarity;

  const clarityTo = searchParams.get('clarityTo');
  if (clarityTo) filters.clarityTo = clarityTo as DiamondClarity;

  const cutGrades = searchParams.get('cutGrades');
  if (cutGrades) filters.cutGrades = cutGrades.split(',') as any[];

  const priceMin = searchParams.get('priceMin');
  if (priceMin) filters.priceMin = parseInt(priceMin, 10);

  const priceMax = searchParams.get('priceMax');
  if (priceMax) filters.priceMax = parseInt(priceMax, 10);

  const labs = searchParams.get('labs');
  if (labs) filters.labs = labs.split(',') as any[];

  const fluorescence = searchParams.get('fluorescence');
  if (fluorescence) filters.fluorescence = fluorescence.split(',') as any[];

  const labGrown = searchParams.get('labGrown');
  if (labGrown !== null) filters.labGrown = labGrown === 'true';

  const eyeClean = searchParams.get('eyeClean');
  if (eyeClean !== null) filters.eyeClean = eyeClean === 'true';

  const sort = searchParams.get('sort');
  if (sort) filters.sort = sort as any;

  const page = searchParams.get('page');
  if (page) filters.page = parseInt(page, 10);

  const perPage = searchParams.get('perPage');
  if (perPage) filters.perPage = parseInt(perPage, 10);

  return filters;
}

/**
 * Debounce a function
 */
export function debounce<T extends (...args: unknown[]) => unknown>(
  fn: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timer: ReturnType<typeof setTimeout>;
  return (...args: Parameters<T>) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
}

/**
 * Check if a value is a non-null object
 */
export function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

type ReadonlyURLSearchParams = {
  get(key: string): string | null;
};
