import { Component, inject } from '@angular/core';
import { AnalyticsStore } from '../data-access/store/analytics.store';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'lib-analytics-filters',
  standalone: true,
  imports: [FormsModule],
  template: `
    <div class="flex gap-4 p-4">
      <select [ngModel]="store.filters().range" (ngModelChange)="store.updateFilters({ ...store.filters(), range: $event })">
        <option value="today">Today</option>
        <option value="last7days">Last 7 Days</option>
        <option value="last30days">Last 30 Days</option>
      </select>
      <select [ngModel]="store.filters().granularity" (ngModelChange)="store.updateFilters({ ...store.filters(), granularity: $event })">
        <option value="day">Day</option>
        <option value="week">Week</option>
        <option value="month">Month</option>
      </select>
    </div>
  `,
})
export class AnalyticsFiltersComponent {
  store = inject(AnalyticsStore);
}
