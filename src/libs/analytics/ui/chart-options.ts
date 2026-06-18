import { EChartsOption } from 'echarts';
import {
  CurrencySeriesResponse,
  PeakHourEntry,
  ProductRankEntry,
  RankedDataResponse,
  StoreRankEntry,
} from '../data-access';

/**
 * Maps a multi-series currency response (revenue, sales count) into a line chart.
 * Buckets from the first series define the shared x-axis categories.
 */
export function currencySeriesToOptions(
  response: CurrencySeriesResponse | null,
): EChartsOption {
  if (!response?.series) {
    return {};
  }

  const seriesKeys = Object.keys(response.series);
  const categories = (response.series[seriesKeys[0]] ?? []).map((b) => b.bucket);

  return {
    tooltip: { trigger: 'axis' },
    legend: { data: seriesKeys },
    xAxis: { type: 'category', data: categories },
    yAxis: { type: 'value' },
    series: seriesKeys.map((key) => ({
      name: key,
      type: 'line',
      smooth: true,
      data: response.series[key].map((b) => b.value),
    })),
  };
}

/**
 * Maps a best-selling products ranking into a horizontal bar chart.
 */
export function productRankToOptions(
  response: RankedDataResponse<ProductRankEntry> | null,
): EChartsOption {
  const data = response?.data ?? [];

  return {
    tooltip: { trigger: 'axis' },
    grid: { left: '20%' },
    xAxis: { type: 'value' },
    yAxis: { type: 'category', data: data.map((d) => d.productName) },
    series: [
      {
        type: 'bar',
        data: data.map((d) => d.totalQuantity),
      },
    ],
  };
}

/**
 * Aggregates peak-hour sale counts by hour of day (0-23) into a bar chart.
 */
export function peakHoursToOptions(
  response: RankedDataResponse<PeakHourEntry> | null,
): EChartsOption {
  const hours = Array.from({ length: 24 }, (_, h) => h);
  const totals = hours.map((h) =>
    (response?.data ?? [])
      .filter((e) => e.hour === h)
      .reduce((sum, e) => sum + e.saleCount, 0),
  );

  return {
    tooltip: { trigger: 'axis' },
    xAxis: { type: 'category', data: hours.map((h) => `${h}:00`) },
    yAxis: { type: 'value' },
    series: [{ type: 'bar', data: totals }],
  };
}

/**
 * Maps a top-stores ranking into a bar chart of revenue per store.
 */
export function storeRankToOptions(
  response: RankedDataResponse<StoreRankEntry> | null,
): EChartsOption {
  const data = response?.data ?? [];

  return {
    tooltip: { trigger: 'axis' },
    xAxis: { type: 'category', data: data.map((d) => d.storeName) },
    yAxis: { type: 'value' },
    series: [
      {
        type: 'bar',
        data: data.map((d) => d.totalRevenue),
      },
    ],
  };
}
