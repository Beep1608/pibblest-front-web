import { Component, inject, OnInit } from '@angular/core';
import { AnalyticsStore } from '../../../../../../libs/analytics/data-access/store/analytics.store';
import { ChartWrapperComponent } from '../../../../../../libs/analytics/ui/chart-wrapper.component';

@Component({
  selector: 'app-revenue-chart',
  standalone: true,
  imports: [ChartWrapperComponent],
  template: `
    <app-chart-wrapper title="Revenue" [data]="analyticsStore.revenue().data">
      <!-- ECharts directive -->
    </app-chart-wrapper>
  `
})
export class RevenueChartComponent implements OnInit {
  analyticsStore = inject(AnalyticsStore);
  
  ngOnInit() {
    this.analyticsStore.loadRevenue();
  }
}
