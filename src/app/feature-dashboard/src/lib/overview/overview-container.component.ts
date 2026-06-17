import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RevenueChartComponent } from './revenue-chart.component';
import { SalesCountChartComponent } from './sales-count-chart.component';
import { BestSellingProductsChartComponent } from './best-selling-products-chart.component';
import { PeakHoursChartComponent } from './peak-hours-chart.component';
import { StorePerformanceChartComponent } from './store-performance-chart.component';
import { ProductPerformanceChartComponent } from './product-performance-chart.component';
import { AnalyticsFiltersComponent } from '../../../../../libs/analytics/ui/analytics-filters.component';

@Component({
  selector: 'app-dashboard-overview',
  standalone: true,
  imports: [
    CommonModule, 
    RevenueChartComponent,
    SalesCountChartComponent,
    BestSellingProductsChartComponent,
    PeakHoursChartComponent,
    StorePerformanceChartComponent,
    ProductPerformanceChartComponent,
    AnalyticsFiltersComponent
  ],
  template: `
    <div class="p-4">
      <app-analytics-filters></app-analytics-filters>
      <h2 class="text-2xl font-bold mb-4">Analytics Overview</h2>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <app-revenue-chart></app-revenue-chart>
        <app-sales-count-chart></app-sales-count-chart>
        <app-best-selling-products-chart></app-best-selling-products-chart>
        <app-peak-hours-chart></app-peak-hours-chart>
        <app-store-performance-chart></app-store-performance-chart>
        <app-product-performance-chart></app-product-performance-chart>
      </div>
    </div>
  `
})
export class OverviewContainerComponent {}
