import { Component, Input } from '@angular/core';
import { NgxEchartsDirective } from 'ngx-echarts';
import { EChartsOption } from 'echarts';

@Component({
	selector: 'app-chart-wrapper',
	standalone: true,
	imports: [NgxEchartsDirective],
	template: `
		<div class="rounded-lg border border-gray-200 p-4">
			@if (title) {
				<h3 class="mb-2 text-sm font-medium text-gray-700">{{ title }}</h3>
			}
			@if (loading) {
				<div class="h-64 flex items-center justify-center">Loading...</div>
			} @else if (error) {
				<div class="h-64 flex items-center justify-center text-red-500">{{ error }}</div>
			} @else {
				<div class="h-64" [options]="options" echarts></div>
			}
		</div>
	`,
})
export class ChartWrapperComponent {
	@Input() title = '';
	@Input() options: EChartsOption = {};
	@Input() loading = false;
	@Input() error: string | null = null;
}
