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
					<div class="p-6 bg-base-100 rounded-2xl shadow-sm border border-base-200/50">
						<h2 class="text-2xl font-bold mb-4 text-base-content">
							<i class="fa-solid fa-users-gear mr-2 text-primary"></i>
							{{ 'employees.title' | translate }}
						</h2>

						<app-employee-table
							[employees]="employeeStore.employeesPage()?.employees || []"
							(delete)="employeeStore.deleteEmployee($event)"
							(edit)="employeeStore.loadEmployeeDetails($event)"
						></app-employee-table>
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
                        Cargando...
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

	ngOnDestroy() {
		this.employeeStore.resetStore();
	}
}
