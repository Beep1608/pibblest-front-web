import { Component, inject, OnInit } from '@angular/core';
import { ChartWrapperComponent } from '../../../../../libs/analytics/ui/chart-wrapper.component';
import { AnalyticsStore } from '../../../../../libs/analytics/data-access';

@Component({
  selector: 'app-product-performance-chart',
  standalone: true,
  imports: [ChartWrapperComponent],
  template: `
    <app-chart-wrapper title="Product Performance" [data]="analyticsStore.productPerformance().data">
      <!-- ECharts directive -->
    </app-chart-wrapper>
  `
})
export class ProductPerformanceChartComponent implements OnInit {
  analyticsStore = inject(AnalyticsStore);
  
  ngOnInit() {
    this.analyticsStore.loadProductPerformance();
  }
}
