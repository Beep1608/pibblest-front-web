import { Component, computed, inject, OnInit } from '@angular/core';
import { EChartsOption } from 'echarts';
import { ChartWrapperComponent } from '../../../../../libs/analytics/ui/chart-wrapper.component';
import { storeRankToOptions } from '../../../../../libs/analytics/ui/chart-options';
import { AnalyticsStore } from '../../../../../libs/analytics/data-access';

@Component({
  selector: 'app-store-performance-chart',
  standalone: true,
  imports: [ChartWrapperComponent],
  template: `
    <app-chart-wrapper
      title="Store Performance"
      [options]="options()"
      [loading]="state().loading"
      [error]="state().error"
    ></app-chart-wrapper>
  `,
})
export class StorePerformanceChartComponent implements OnInit {
  analyticsStore = inject(AnalyticsStore);
  state = this.analyticsStore.storePerformance;
  options = computed<EChartsOption>(() => storeRankToOptions(this.state().data));

  ngOnInit() {
    this.analyticsStore.loadStorePerformance();
  }
}
