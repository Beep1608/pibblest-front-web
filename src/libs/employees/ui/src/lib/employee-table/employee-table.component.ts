// src/libs/employees/ui/src/lib/employee-table/employee-table.component.ts
import { Component, input, output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { EmployeeDto } from '../../../../data-access/src/lib/models/employee.model';

@Component({
  selector: 'app-employee-table',
  standalone: true,
  imports: [CommonModule, TranslateModule],
  templateUrl: './employee-table.component.html'
})
export class EmployeeTableComponent {
  employees = input.required<EmployeeDto[]>();
  currentUserId = input<string | null>(null);
  delete = output<string>();
  edit = output<string>();
  resendActivation = output<string>();

  // Señal para gestionar la apertura/cierre del modal
  employeeToDelete = signal<string | null>(null);

  onEdit(id: string) {
    this.edit.emit(id);
  }

  onResendActivation(id: string) {
    this.resendActivation.emit(id);
  }

  // ✨ Manejo del modal de eliminación
  requestDelete(id: string) {
    this.employeeToDelete.set(id);
  }

  confirmDelete() {
    const id = this.employeeToDelete();
    if (id) {
      this.delete.emit(id);
      this.employeeToDelete.set(null);
    }
  }

  cancelDelete() {
    this.employeeToDelete.set(null);
  }
}
