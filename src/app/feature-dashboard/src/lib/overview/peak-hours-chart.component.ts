import { Component, inject, OnInit } from '@angular/core';
import { ChartWrapperComponent } from '../../../../../libs/analytics/ui/chart-wrapper.component';
import { AnalyticsStore } from '../../../../../libs/analytics/data-access';

@Component({
  selector: 'app-peak-hours-chart',
  standalone: true,
  imports: [ChartWrapperComponent],
  template: `
    <app-chart-wrapper title="Peak Hours" [data]="analyticsStore.peakHours().data">
      <!-- ECharts directive -->
    </app-chart-wrapper>
  `
})
export class PeakHoursChartComponent implements OnInit {
  analyticsStore = inject(AnalyticsStore);
  
  ngOnInit() {
    this.analyticsStore.loadPeakHours();
  }
}
