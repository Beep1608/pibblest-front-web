// src/libs/sales/ui/src/lib/sale-history/sale-history.component.ts
import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule, DecimalPipe, DatePipe } from '@angular/common';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { SaleStore } from '../../../../data-access';
import { SaleApiService } from '../../../../data-access/services/sale-api.service';
import { StoreStore } from '../../../../../stores/data-access/lib/store/store.store';

@Component({
  selector: 'app-sale-history',
  standalone: true,
  imports: [CommonModule, TranslateModule, DecimalPipe, DatePipe, ReactiveFormsModule],
  template: `
    <div class="bg-base-100 rounded-2xl shadow-sm border border-base-200/50 p-6">
      <div class="flex items-center gap-4 mb-6">
        <div class="bg-primary/10 p-3 rounded-xl text-primary">
          <i class="fa-solid fa-receipt text-xl"></i>
        </div>
        <div>
          <h2 class="text-xl font-bold">{{ 'sales.history.title' | translate }}</h2>
          <p class="text-sm text-base-content/60">{{ 'sales.history.subtitle' | translate }}</p>
        </div>
      </div>

      <div class="bg-base-200/50 p-4 rounded-xl mb-6 border border-base-200">
        <form [formGroup]="filterForm" (ngSubmit)="onFilter()" class="flex flex-wrap gap-4 items-end">
            
            @if (store.isOwnerUser() || store.hasPermission('MODULE_SALES', 'READ')) {
                <div class="form-control w-full sm:w-auto flex-1 min-w-[200px]">
                    <label class="label pb-1"><span class="label-text font-medium">{{ 'sales.history.filters.employee' | translate }}</span></label>
                    <select formControlName="employeeId" class="select select-bordered w-full focus:select-primary transition-all">
                        <option value="">{{ 'sales.history.filters.allEmployees' | translate }}</option>
                        @for (emp of employees(); track emp.id) {
                            <option [value]="emp.id">{{ emp.username }}</option>
                        }
                    </select>
                </div>
            }
            
            <div class="form-control w-full sm:w-auto flex-1 min-w-[150px]">
                <label class="label pb-1"><span class="label-text font-medium">{{ 'sales.history.filters.startDate' | translate }}</span></label>
                <input type="date" formControlName="startDate" class="input input-bordered w-full focus:input-primary transition-all" />
            </div>
            
            <div class="form-control w-full sm:w-auto flex-1 min-w-[150px]">
                <label class="label pb-1"><span class="label-text font-medium">{{ 'sales.history.filters.endDate' | translate }}</span></label>
                <input type="date" formControlName="endDate" class="input input-bordered w-full focus:input-primary transition-all" />
            </div>
            
            <div class="flex gap-2 w-full sm:w-auto mt-2 sm:mt-0">
                <button type="button" class="btn btn-ghost flex-1 sm:flex-none" (click)="onReset()">
                    {{ 'sales.history.filters.clear' | translate }}
                </button>
                <button type="submit" class="btn btn-primary flex-1 sm:flex-none" [disabled]="saleStore.isLoading()">
                    @if (saleStore.isLoading()) {
                        <span class="loading loading-spinner loading-sm"></span>
                    } @else {
                        <i class="fa-solid fa-search"></i> {{ 'sales.history.filters.search' | translate }}
                    }
                </button>
            </div>
        </form>
      </div>

      <div class="overflow-x-auto">
        <table class="table table-zebra w-full">
          <thead>
            <tr>
              <th>ID</th>
              <th>{{ 'sales.history.employee' | translate }}</th>
              <th>{{ 'sales.history.status' | translate }}</th>
              <th>{{ 'sales.history.total' | translate }}</th>
              <th>{{ 'sales.history.items' | translate }}</th>
              <th class="text-right">{{ 'sales.history.actions' | translate }}</th>
            </tr>
          </thead>
          <tbody>
            @for (sale of saleStore.salesPage()?.sales; track sale.id) {
              <tr>
                <td class="font-mono text-xs opacity-60">#{{ sale.id }}</td>
                <td class="text-sm">
                  <div class="font-bold">{{ sale.employeeUsername }}</div>
                  <div class="text-xs opacity-60">{{ sale.createdAt | date:'short' }}</div>
                </td>
                <td>
                  <span class="badge badge-sm font-bold"
                        [class.badge-success]="sale.status === 'COMPLETED'"
                        [class.badge-error]="sale.status === 'CANCELLED'">
                    {{ sale.status }}
                  </span>
                </td>
                <td class="font-bold text-primary">$ {{ sale.totalAmount | number:'1.2-2' }}</td>
                <td class="text-xs">
                  <ul class="list-disc list-inside">
                    @for (detail of sale.details; track detail.id) {
                      <li>{{ detail.quantity }}x {{ detail.productName }}</li>
                    }
                  </ul>
                </td>
                <td class="text-right">
                  <div class="flex justify-end gap-2">
                    @if (store.hasPermission('MODULE_SALES', 'UPDATE') && sale.status !== 'CANCELLED') {
                      <button class="btn btn-sm btn-warning btn-outline" (click)="cancelSale(sale.id)" [disabled]="saleStore.isLoading()">
                        <i class="fa-solid fa-ban"></i> Cancelar
                      </button>
                    }
                    @if (store.hasPermission('MODULE_SALES', 'DELETE')) {
                      <button class="btn btn-sm btn-error btn-square" (click)="deleteSale(sale.id)" [disabled]="saleStore.isLoading()">
                        <i class="fa-solid fa-trash text-error-content"></i>
                      </button>
                    }
                  </div>
                </td>
              </tr>
            } @empty {
              <tr>
                <td colspan="6" class="text-center py-10 text-base-content/50">
                  <i class="fa-solid fa-filter-circle-xmark text-4xl mb-3"></i>
                  <p>{{ 'sales.history.empty' | translate }}</p>
                </td>
              </tr>
            }
          </tbody>
        </table>
      </div>

      @if (saleStore.salesPage()) {
        <div class="flex justify-center mt-6">
            <div class="join">
                <button class="join-item btn" (click)="changePage(-1)" [disabled]="saleStore.salesPage()?.pageNo === 0 || saleStore.isLoading()">
                    <i class="fa-solid fa-chevron-left mr-1"></i> {{ 'sales.pagination.prev' | translate }}
                </button>
                <button class="join-item btn pointer-events-none">
                    {{ 'sales.pagination.page' | translate }} {{ (saleStore.salesPage()?.pageNo ?? 0) + 1 }} {{ 'sales.pagination.of' | translate }} {{ saleStore.salesPage()?.totalPages || 1 }}
                </button>
                <button class="join-item btn" (click)="changePage(1)" [disabled]="saleStore.salesPage()?.last || saleStore.isLoading()">
                    {{ 'sales.pagination.next' | translate }} <i class="fa-solid fa-chevron-right ml-1"></i>
                </button>
            </div>
        </div>
      }
    </div>
  `
})
export class SaleHistoryComponent implements OnInit {
  private fb = inject(FormBuilder);
  saleStore = inject(SaleStore);
  store = inject(StoreStore);
  saleApi = inject(SaleApiService); // Usado para traer el listado simple de empleados

  employees = signal<{id: string, username: string}[]>([]);

  filterForm = this.fb.nonNullable.group({
      employeeId: [''],
      startDate: [''],
      endDate: ['']
  });

  ngOnInit() {
    const storeId = this.store.selectedStore();
    if (storeId) {
      if (this.store.isOwnerUser() || this.store.hasPermission('MODULE_SALES', 'READ')) {
          this.saleApi.getSimpleEmployeesByStore(storeId).subscribe(res => this.employees.set(res));
      }
      this.saleStore.loadSales(storeId);
    }
  }

  onFilter() {
      const raw = this.filterForm.getRawValue();
      let startIso = null;
      let endIso = null;
      
      // Formateamos las fechas seleccionadas en el input HTML a ISO 8601 estricto
      if (raw.startDate) {
          startIso = new Date(`${raw.startDate}T00:00:00`).toISOString();
      }
      if (raw.endDate) {
          endIso = new Date(`${raw.endDate}T23:59:59`).toISOString();
      }
      
      this.saleStore.setFilters({
          employeeId: raw.employeeId || null,
          startDate: startIso,
          endDate: endIso
      });

      const storeId = this.store.selectedStore();
      if (storeId) this.saleStore.loadSales(storeId);
  }

  onReset() {
      this.filterForm.reset({ employeeId: '', startDate: '', endDate: '' });
      this.onFilter();
  }

  changePage(delta: number) {
    this.saleStore.setPage(this.saleStore.currentPage() + delta);
    const storeId = this.store.selectedStore();
    if (storeId) {
        this.saleStore.loadSales(storeId);
    }
  }

  cancelSale(saleId: number) {
    const storeId = this.store.selectedStore();
    if (storeId && confirm('¿Estás seguro de cancelar esta venta? El stock se devolverá al inventario.')) {
      this.saleStore.cancelSale({ saleId, storeId });
    }
  }

  deleteSale(saleId: number) {
    const storeId = this.store.selectedStore();
    if (storeId && confirm('¿Estás completamente seguro de eliminar este registro? Esta acción no se puede deshacer.')) {
      this.saleStore.deleteSale({ saleId, storeId });
    }
  }
}
