import { Component, inject, OnInit } from '@angular/core';
import { ChartWrapperComponent } from '../../../../../libs/analytics/ui/chart-wrapper.component';
import { AnalyticsStore } from '../../../../../libs/analytics/data-access';

@Component({
  selector: 'app-sales-count-chart',
  standalone: true,
  imports: [ChartWrapperComponent],
  template: `
    <app-chart-wrapper title="Sales Count" [data]="analyticsStore.salesCount().data">
      <!-- ECharts directive -->
    </app-chart-wrapper>
  `
})
export class SalesCountChartComponent implements OnInit {
  analyticsStore = inject(AnalyticsStore);
  
  ngOnInit() {
    this.analyticsStore.loadSalesCount();
  }
}
