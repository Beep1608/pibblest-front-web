import { Component, Input } from '@angular/core';
import { form } from '@angular/forms/signals';
import {NgxEchartsDirective} from 'ngx-echarts';
import {EChartsOption} from 'echarts'

@Component({
	selector: 'app-chart-wrapper',
	standalone: true,
	imports: [NgxEchartsDirective],
	template: `
		@if (loading) {
			<div class="h-64 flex items-center justify-center">Loading...</div>
		} @else if (error) {
			<div class="h-64 flex items-center justify-center text-red-500">{{ error }}</div>
		} @else {
			<div class="h-64" [options]="options" echarts></div>
		}
	`,
})
export class ChartWrapperComponent {
	@Input() options: EChartsOption = {};
	@Input() loading = false;
	@Input() error: string | null = null;
}
