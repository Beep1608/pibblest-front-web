import { Component, inject, OnInit } from '@angular/core';
import { AnalyticsStore } from '../../../../../../libs/analytics/data-access/store/analytics.store';
import { ChartWrapperComponent } from '../../../../../../libs/analytics/ui/chart-wrapper.component';

@Component({
  selector: 'app-best-selling-products-chart',
  standalone: true,
  imports: [ChartWrapperComponent],
  template: `
    <app-chart-wrapper title="Best Selling Products" [data]="analyticsStore.bestSellingProducts().data">
      <!-- ECharts directive -->
    </app-chart-wrapper>
  `
})
export class BestSellingProductsChartComponent implements OnInit {
  analyticsStore = inject(AnalyticsStore);
  
  ngOnInit() {
    this.analyticsStore.loadBestSellingProducts();
  }
}
