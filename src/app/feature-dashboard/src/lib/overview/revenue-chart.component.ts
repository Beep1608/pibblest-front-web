import { Component, computed, inject, OnInit } from '@angular/core';
import { EChartsOption } from 'echarts';
import { ChartWrapperComponent } from '../../../../../libs/analytics/ui/chart-wrapper.component';
import { currencySeriesToOptions } from '../../../../../libs/analytics/ui/chart-options';
import { AnalyticsStore } from '../../../../../libs/analytics/data-access';

@Component({
  selector: 'app-revenue-chart',
  standalone: true,
  imports: [ChartWrapperComponent],
  template: `
    <app-chart-wrapper
      title="Revenue"
      [options]="options()"
      [loading]="state().loading"
      [error]="state().error"
    ></app-chart-wrapper>
  `,
})
export class RevenueChartComponent implements OnInit {
  analyticsStore = inject(AnalyticsStore);
  state = this.analyticsStore.revenue;
  options = computed<EChartsOption>(() => currencySeriesToOptions(this.state().data));

  ngOnInit() {
    this.analyticsStore.loadRevenue();
  }
}
