import { inject } from '@angular/core';
import { signalStore, withState, withMethods, patchState } from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { AnalyticsFilters } from '../models/analytics.model';
import { AnalyticsApiService } from '../services/analytics-api.service';
import { pipe, switchMap, tap } from 'rxjs';
import { tapResponse } from '@ngrx/operators';

interface AnalyticsState {
  filters: AnalyticsFilters;
  revenue: { data: any | null; loading: boolean; error: string | null };
  salesCount: { data: any | null; loading: boolean; error: string | null };
  bestSellingProducts: { data: any | null; loading: boolean; error: string | null };
  peakHours: { data: any | null; loading: boolean; error: string | null };
  storePerformance: { data: any | null; loading: boolean; error: string | null };
}

const initialState: AnalyticsState = {
  filters: { range: 'today', granularity: 'day' },
  revenue: { data: null, loading: false, error: null },
  salesCount: { data: null, loading: false, error: null },
  bestSellingProducts: { data: null, loading: false, error: null },
  peakHours: { data: null, loading: false, error: null },
  storePerformance: { data: null, loading: false, error: null },
};

export const AnalyticsStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withMethods((store, api = inject(AnalyticsApiService)) => ({
    updateFilters: (filters: AnalyticsFilters) => {
      patchState(store, { filters });
      // Reload charts based on new filters
    },
    loadRevenue: rxMethod<void>(
      pipe(
        switchMap(() => {
          patchState(store, { revenue: { data: null, loading: true, error: null } });
          return api.getRevenueSeries(store.filters()).pipe(
            tapResponse({
              next: (data) => patchState(store, { revenue: { data, loading: false, error: null } }),
              error: (error: any) => patchState(store, { revenue: { data: null, loading: false, error: error.message } }),
            })
          );
        })
      )
    ),
    loadSalesCount: rxMethod<void>(
      pipe(
        switchMap(() => {
          patchState(store, { salesCount: { data: null, loading: true, error: null } });
          return api.getSalesCountSeries(store.filters()).pipe(
            tapResponse({
              next: (data) => patchState(store, { salesCount: { data, loading: false, error: null } }),
              error: (error: any) => patchState(store, { salesCount: { data: null, loading: false, error: error.message } }),
            })
          );
        })
      )
    ),
    loadBestSellingProducts: rxMethod<void>(
      pipe(
        switchMap(() => {
          patchState(store, { bestSellingProducts: { data: null, loading: true, error: null } });
          return api.getBestSellingProducts(store.filters()).pipe(
            tapResponse({
              next: (data) => patchState(store, { bestSellingProducts: { data, loading: false, error: null } }),
              error: (error: any) => patchState(store, { bestSellingProducts: { data: null, loading: false, error: error.message } }),
            })
          );
        })
      )
    ),
    loadPeakHours: rxMethod<void>(
      pipe(
        switchMap(() => {
          patchState(store, { peakHours: { data: null, loading: true, error: null } });
          return api.getPeakHours(store.filters()).pipe(
            tapResponse({
              next: (data) => patchState(store, { peakHours: { data, loading: false, error: null } }),
              error: (error: any) => patchState(store, { peakHours: { data: null, loading: false, error: error.message } }),
            })
          );
        })
      )
    ),
    loadStorePerformance: rxMethod<void>(
      pipe(
        switchMap(() => {
          patchState(store, { storePerformance: { data: null, loading: true, error: null } });
          return api.getStorePerformance(store.filters()).pipe(
            tapResponse({
              next: (data) => patchState(store, { storePerformance: { data, loading: false, error: null } }),
              error: (error: any) => patchState(store, { storePerformance: { data: null, loading: false, error: error.message } }),
            })
          );
        })
      )
    ),
  }))
);
