import { Component, computed, inject, OnInit } from '@angular/core';
import { EChartsOption } from 'echarts';
import { ChartWrapperComponent } from '../../../../../libs/analytics/ui/chart-wrapper.component';
import { currencySeriesToOptions } from '../../../../../libs/analytics/ui/chart-options';
import { AnalyticsStore } from '../../../../../libs/analytics/data-access';

@Component({
  selector: 'app-sales-count-chart',
  standalone: true,
  imports: [ChartWrapperComponent],
  template: `
    <app-chart-wrapper
      title="Sales Count"
      [options]="options()"
      [loading]="state().loading"
      [error]="state().error"
    ></app-chart-wrapper>
  `,
})
export class SalesCountChartComponent implements OnInit {
  analyticsStore = inject(AnalyticsStore);
  state = this.analyticsStore.salesCount;
  options = computed<EChartsOption>(() => currencySeriesToOptions(this.state().data));

  ngOnInit() {
    this.analyticsStore.loadSalesCount();
  }
}
