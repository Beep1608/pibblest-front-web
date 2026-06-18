export interface AnalyticsFilters {
  range: 'today' | 'last7days' | 'last30days' | 'month' | 'custom';
  startDate?: string; // ISO date
  endDate?: string;
  granularity: 'day' | 'week' | 'month';
  storeId?: number;
}

export interface BucketEntry {
  bucket: string;
  value: number;
}

export interface CurrencySeriesResponse {
  filters: AnalyticsFilters;
  series: Record<string, BucketEntry[]>;
}

export interface RankedDataResponse<T> {
  filters: AnalyticsFilters;
  data: T[];
}

export interface ProductRankEntry {
  productId: number;
  productName: string;
  totalQuantity: number;
}

export interface PeakHourEntry {
  hour: number;
  dayOfWeek: number;
  saleCount: number;
}

export interface StoreRankEntry {
  storeId: number;
  storeName: string;
  totalRevenue: number;
  currencyCode: string;
}
