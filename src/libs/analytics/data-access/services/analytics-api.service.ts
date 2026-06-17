import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AnalyticsFilters, CurrencySeriesResponse, RankedDataResponse, ProductRankEntry, PeakHourEntry } from '../models/analytics.model';

@Injectable({ providedIn: 'root' })
export class AnalyticsApiService {
  private baseUrl = '/api/analytics';

  constructor(private http: HttpClient) {}

  private createParams(filters: AnalyticsFilters): HttpParams {
    let params = new HttpParams()
      .set('range', filters.range)
      .set('granularity', filters.granularity);
    if (filters.startDate) params = params.set('startDate', filters.startDate);
    if (filters.endDate) params = params.set('endDate', filters.endDate);
    if (filters.storeId) params = params.set('storeId', filters.storeId.toString());
    return params;
  }

  getRevenueSeries(filters: AnalyticsFilters): Observable<CurrencySeriesResponse> {
    return this.http.get<CurrencySeriesResponse>(`${this.baseUrl}/revenue`, { params: this.createParams(filters) });
  }

  getSalesCountSeries(filters: AnalyticsFilters): Observable<CurrencySeriesResponse> {
    return this.http.get<CurrencySeriesResponse>(`${this.baseUrl}/sales-count`, { params: this.createParams(filters) });
  }

  getBestSellingProducts(filters: AnalyticsFilters): Observable<RankedDataResponse<ProductRankEntry>> {
    return this.http.get<RankedDataResponse<ProductRankEntry>>(`${this.baseUrl}/best-selling-products`, { params: this.createParams(filters) });
  }

  getPeakHours(filters: AnalyticsFilters): Observable<RankedDataResponse<PeakHourEntry>> {
    return this.http.get<RankedDataResponse<PeakHourEntry>>(`${this.baseUrl}/peak-hours`, { params: this.createParams(filters) });
  }
  
  // Placeholder for missing 2 endpoints if necessary
  getStorePerformance(filters: AnalyticsFilters): Observable<RankedDataResponse<any>> {
    return this.http.get<RankedDataResponse<any>>(`${this.baseUrl}/store-performance`, { params: this.createParams(filters) });
  }
  
  getProductPerformance(filters: AnalyticsFilters): Observable<RankedDataResponse<any>> {
    return this.http.get<RankedDataResponse<any>>(`${this.baseUrl}/product-performance`, { params: this.createParams(filters) });
  }
}
