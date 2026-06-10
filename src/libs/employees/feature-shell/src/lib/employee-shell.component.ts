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
					<div class="p-6 bg-base-100 rounded-2xl shadow-sm border border-base-200/50 flex flex-col gap-4">
						
                        <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                            <h2 class="text-2xl font-bold text-base-content m-0">
                                <i class="fa-solid fa-users-gear mr-2 text-primary"></i>
                                {{ 'employees.title' | translate }}
                            </h2>
                            <button class="btn btn-primary" (click)="employeeStore.setView('create')">
                                <i class="fa-solid fa-plus mr-2"></i> {{ 'employees.actions.new' | translate }}
                            </button>
                        </div>

                        <div class="form-control w-full max-w-sm">
                            <div class="join w-full">
                                <div class="relative w-full">
                                    <i class="fa-solid fa-magnifying-glass absolute left-4 top-1/2 -translate-y-1/2 text-base-content/50 pointer-events-none"></i>
                                    <input #searchInput type="text" [placeholder]="'employees.search.placeholder_enter' | translate" 
                                           class="input input-bordered w-full pl-10 join-item"
                                           [value]="employeeStore.searchQuery()"
                                           (keydown.enter)="onSearch(searchInput.value)" />
                                </div>
                                <button class="btn btn-primary join-item" (click)="onSearch(searchInput.value)">
                                    {{ 'employees.actions.search' | translate }}
                                </button>
                            </div>
                        </div>

                        <app-employee-table
							[employees]="employeeStore.employeesPage()?.employees || []"
							(delete)="employeeStore.deleteEmployee($event)"
							(edit)="employeeStore.loadEmployeeDetails($event)"
						></app-employee-table>

                        @if (employeeStore.employeesPage(); as page) {
                            <div class="flex justify-between items-center mt-2">
                                <span class="text-sm text-base-content/70">
                                    {{ 'employees.pagination.info' | translate: { current: page.pageNo + 1, total: page.totalPages || 1, elements: page.totalElements } }}
                                </span>
                                <div class="join">
                                    <button class="join-item btn btn-sm" 
                                            [disabled]="page.pageNo === 0"
                                            (click)="changePage(page.pageNo - 1)">
                                        {{ 'employees.pagination.prev' | translate }}
                                    </button>
                                    <button class="join-item btn btn-sm" 
                                            [disabled]="page.last"
                                            (click)="changePage(page.pageNo + 1)">
                                        {{ 'employees.pagination.next' | translate }}
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
                    <div class="p-6 text-center text-primary font-bold">
                        <span class="loading loading-spinner"></span> {{ 'employees.loading' | translate }}
                    </div>
                }
			}
		</div>
	`,
})
export class EmployeeShellComponent implements OnInit, OnDestroy {
	employeeStore = inject(EmployeeStore);
	
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
