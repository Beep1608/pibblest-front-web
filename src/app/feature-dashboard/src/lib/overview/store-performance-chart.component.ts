import { Component, inject, OnInit } from '@angular/core';
import { AnalyticsStore } from '../../../../../../libs/analytics/data-access/store/analytics.store';
import { ChartWrapperComponent } from '../../../../../../libs/analytics/ui/chart-wrapper.component';

@Component({
  selector: 'app-store-performance-chart',
  standalone: true,
  imports: [ChartWrapperComponent],
  template: `
    <app-chart-wrapper title="Store Performance" [data]="analyticsStore.storePerformance().data">
      <!-- ECharts directive -->
    </app-chart-wrapper>
  `
})
export class StorePerformanceChartComponent implements OnInit {
  analyticsStore = inject(AnalyticsStore);
  
  ngOnInit() {
    this.analyticsStore.loadStorePerformance();
  }
}
