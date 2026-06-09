// src/libs/employees/ui/src/lib/employee-table/employee-table.component.ts
import { Component, input, output } from '@angular/core';
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
  delete = output<string>();
  edit = output<string>();
  resendActivation = output<string>();

  onDelete(id: string) {
    this.delete.emit(id);
  }

  onEdit(id: string) {
    this.edit.emit(id);
  }

  onResendActivation(id: string) {
    this.resendActivation.emit(id);
  }
}
