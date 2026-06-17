import { Component, Input } from '@angular/core';
import { NgxEchartsDirective } from 'ngx-echarts';
import { EChartsOption } from 'echarts';

@Component({
  selector: 'lib-chart-wrapper',
  standalone: true,
  imports: [NgxEchartsDirective],
  template: `
    @if (loading) {
      <div class="h-64 flex items-center justify-center">Loading...</div>
    } @else if (error) {
      <div class="h-64 flex items-center justify-center text-red-500">{{error}}</div>
    } @else {
      <div echarts [options]="options" class="h-64"></div>
    }
  `,
})
export class ChartWrapperComponent {
  @Input() options: EChartsOption = {};
  @Input() loading = false;
  @Input() error: string | null = null;
}
