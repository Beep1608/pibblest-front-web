// src/libs/employees/feature-shell/src/lib/employee-shell.component.ts
import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { EmployeeStore } from '../../../data-access/src/lib/store/employee.store';
import { EmployeeTableComponent } from '../../../ui/src/lib/employee-table/employee-table.component';
import { EmployeeFormPageComponent } from '../../../feature-form/src/lib/employee-form-page.component';

@Component({
	selector: 'app-employees-shell',
	standalone: true,
	imports: [TranslateModule, EmployeeTableComponent, EmployeeFormPageComponent],
	template: `
		<div class="employees-module-shell w-full h-full">
			@switch (employeeStore.currentView()) {
				@case ('list') {
					<div class="p-4 sm:p-6 bg-base-100 rounded-2xl shadow-sm border border-base-200/50">
						
                        <div class="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-6 border-b border-base-200/60 pb-4">
                            
                            <h2 class="text-2xl font-bold text-base-content whitespace-nowrap m-0 shrink-0">
                                <i class="fa-solid fa-users-gear mr-2 text-primary"></i>
                                {{ 'employees.title' | translate }}
                            </h2>

                            <div class="flex flex-col sm:flex-row w-full lg:w-auto items-center gap-3">
                                
                                <div class="join w-full sm:max-w-md shadow-sm">
                                    <div class="relative w-full">
                                        <i class="fa-solid fa-magnifying-glass absolute left-3.5 top-1/2 -translate-y-1/2 text-base-content/40 pointer-events-none"></i>
                                        <input #searchInput type="text" [placeholder]="'employees.search.placeholder' | translate" 
                                               class="input input-bordered w-full pl-10 join-item focus:outline-none focus:border-primary/50 transition-colors"
                                               [value]="employeeStore.searchQuery()"
                                               (keydown.enter)="onSearch(searchInput.value)" />
                                    </div>
                                    <button class="btn btn-neutral join-item px-4 sm:px-6 hover:bg-neutral/90" (click)="onSearch(searchInput.value)">
                                        <span class="hidden sm:inline">{{ 'employees.actions.search' | translate }}</span>
                                        <i class="fa-solid fa-magnifying-glass sm:hidden"></i>
                                    </button>
                                </div>

                                <button class="btn btn-primary w-full sm:w-auto shadow-sm shrink-0" (click)="employeeStore.setView('create')">
                                    <i class="fa-solid fa-plus"></i>
                                    <span class="ml-1">{{ 'employees.actions.new' | translate }}</span>
                                </button>
                            </div>
                        </div>

                        <app-employee-table
							[employees]="employeeStore.employeesPage()?.employees || []"
							[currentUserId]="currentUserId"
							(delete)="employeeStore.deleteEmployee($event)"
							(edit)="employeeStore.loadEmployeeDetails($event)"
						></app-employee-table>

                        @if (employeeStore.employeesPage(); as page) {
                            <div class="flex flex-col sm:flex-row justify-between items-center mt-4 gap-3 pt-4 border-t border-base-200/50">
                                <span class="text-sm text-base-content/70 font-medium">
                                    {{ 'employees.pagination.showing' | translate: { current: page.pageNo + 1, total: page.totalPages || 1 } }} 
                                    <span class="opacity-60">{{ 'employees.pagination.records' | translate: { elements: page.totalElements } }}</span>
                                </span>
                                <div class="join shadow-sm">
                                    <button class="join-item btn btn-sm bg-base-100 hover:bg-base-200 border-base-300" 
                                            [disabled]="page.pageNo === 0"
                                            (click)="changePage(page.pageNo - 1)">
                                        <i class="fa-solid fa-chevron-left mr-1"></i> {{ 'employees.pagination.prev' | translate }}
                                    </button>
                                    <button class="join-item btn btn-sm bg-base-100 hover:bg-base-200 border-base-300" 
                                            [disabled]="page.last"
                                            (click)="changePage(page.pageNo + 1)">
                                        {{ 'employees.pagination.next' | translate }} <i class="fa-solid fa-chevron-right ml-1"></i>
                                    </button>
                                </div>
                            </div>
                        }
					</div>
				}
				@case ('create') {
					<app-employee-form-page></app-employee-form-page>
				}
				@case ('edit') {
					<app-employee-form-page></app-employee-form-page>
				}
				@default {
                    <div class="flex justify-center items-center p-12 text-primary">
                        <span class="loading loading-spinner loading-lg"></span>
                    </div>
                }
			}
		</div>
	`,
})
export class EmployeeShellComponent implements OnInit, OnDestroy {
	employeeStore = inject(EmployeeStore);

	// Id del usuario autenticado (claim employeeId del JWT) para impedir el auto-borrado.
	readonly currentUserId = this.decodeCurrentUserId();

	private decodeCurrentUserId(): string | null {
		const token = localStorage.getItem('pibblest_token');
		if (!token) return null;
		try {
			const payload = JSON.parse(atob(token.split('.')[1]));
			return payload.employeeId ?? null;
		} catch {
			return null;
		}
	}

	ngOnInit() {
		this.employeeStore.loadEmployees();
	}

    onSearch(query: string) {
        const cleanQuery = query.trim();
        
        // Evita realizar la petición si la búsqueda es exactamente igual a la actual
        if (cleanQuery === this.employeeStore.searchQuery().trim()) {
            return;
        }

        this.employeeStore.setSearchQuery(cleanQuery);
        this.employeeStore.loadEmployees();
    }

    changePage(newPage: number) {
        this.employeeStore.setPage(newPage);
        this.employeeStore.loadEmployees();
    }

	ngOnDestroy() {
		this.employeeStore.resetStore();
	}
}

