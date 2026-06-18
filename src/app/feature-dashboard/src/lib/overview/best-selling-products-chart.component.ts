import { Component, computed, inject, OnInit } from '@angular/core';
import { EChartsOption } from 'echarts';
import { ChartWrapperComponent } from '../../../../../libs/analytics/ui/chart-wrapper.component';
import { productRankToOptions } from '../../../../../libs/analytics/ui/chart-options';
import { AnalyticsStore } from '../../../../../libs/analytics/data-access';

@Component({
  selector: 'app-best-selling-products-chart',
  standalone: true,
  imports: [ChartWrapperComponent],
  template: `
    <app-chart-wrapper
      title="Best Selling Products"
      [options]="options()"
      [loading]="state().loading"
      [error]="state().error"
    ></app-chart-wrapper>
  `,
})
export class BestSellingProductsChartComponent implements OnInit {
  analyticsStore = inject(AnalyticsStore);
  state = this.analyticsStore.bestSellingProducts;
  options = computed<EChartsOption>(() => productRankToOptions(this.state().data));

  ngOnInit() {
    this.analyticsStore.loadBestSellingProducts();
  }
}
