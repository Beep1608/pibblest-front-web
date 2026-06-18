import { Component, computed, inject, OnInit } from '@angular/core';
import { EChartsOption } from 'echarts';
import { ChartWrapperComponent } from '../../../../../libs/analytics/ui/chart-wrapper.component';
import { peakHoursToOptions } from '../../../../../libs/analytics/ui/chart-options';
import { AnalyticsStore } from '../../../../../libs/analytics/data-access';

@Component({
  selector: 'app-peak-hours-chart',
  standalone: true,
  imports: [ChartWrapperComponent],
  template: `
    <app-chart-wrapper
      title="Peak Hours"
      [options]="options()"
      [loading]="state().loading"
      [error]="state().error"
    ></app-chart-wrapper>
  `,
})
export class PeakHoursChartComponent implements OnInit {
  analyticsStore = inject(AnalyticsStore);
  state = this.analyticsStore.peakHours;
  options = computed<EChartsOption>(() => peakHoursToOptions(this.state().data));

  ngOnInit() {
    this.analyticsStore.loadPeakHours();
  }
}
