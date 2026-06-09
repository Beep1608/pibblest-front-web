// src/libs/employees/feature-form/src/lib/employee-form-page.component.ts
import { Component, inject } from '@angular/core';
import { EmployeeStore } from '../../../data-access/src';
import { EmployeeFormComponent } from '../../../ui/src/lib/employee-form/employee-form.component';

@Component({
  selector: 'app-employee-form-page',
  standalone: true,
  imports: [EmployeeFormComponent],
  template: `
    <app-employee-form 
        [isSubmitting]="store.isSubmitting()"
        [initialData]="store.selectedEmployee()"
        (submitForm)="onSave($event)"
        (cancel)="store.setView('list')">
    </app-employee-form>
  `
})
export class EmployeeFormPageComponent {
  store = inject(EmployeeStore);

  onSave(payload: any) {
    console.log("onSave ejecutado en el PageComponent:", payload); 
    if (this.store.currentView() === 'create') {
      this.store.createEmployee(payload);
    } else {
      // Verifica que el ID esté presente antes de enviar
      const id = this.store.selectedEmployeeId();
      console.log ("Editando ");
      console.log(id);
      if (id) {
            console.log('Editando');
         this.store.updateEmployee({ id, request: payload });
      }
    }
  }
}
