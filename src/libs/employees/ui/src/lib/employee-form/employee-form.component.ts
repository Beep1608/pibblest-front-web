// src/libs/employees/ui/src/lib/employee-form/employee-form.component.ts
import { Component, inject, input, output, OnInit, OnDestroy, effect } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { CommonModule, TitleCasePipe } from '@angular/common';
import { StoreStore } from '../../../../../stores/data-access/lib/store/store.store';
import { MODULE_CONFIG, ACTIONS } from '../../../../data-access/src';

@Component({
  selector: 'app-employee-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, TranslateModule, TitleCasePipe],
  templateUrl: './employee-form.component.html'
})
export class EmployeeFormComponent implements OnInit, OnDestroy {
  private fb = inject(FormBuilder);
  storeStore = inject(StoreStore);

  readonly modules = MODULE_CONFIG;
  readonly actions = ACTIONS;

  isSubmitting = input<boolean>(false);
  initialData = input<any | null>(null);
  submitForm = output<any>();
  cancel = output<void>();

  form = this.fb.nonNullable.group({
    name: ['', Validators.required],
    lastName: ['', Validators.required],
    storeAssignments: this.fb.array([])
  });

  constructor() {
    effect(() => {
      const data = this.initialData();
      if (data) {
        // Clear existing assignments
        while (this.storeAssignments.length !== 0) {
          this.storeAssignments.removeAt(0);
        }
        
        this.form.patchValue({
          name: data.name,
          lastName: data.lastName
        });

        if (data.storeAssignments) {
          data.storeAssignments.forEach((assignment: any) => {
            const modules = assignment.modules || assignment.permissions || [];
            this.addStoreAssignment(assignment.storeId, modules);
          });
        }
      }
    });
  }

  ngOnInit() {
    this.storeStore.loadStores(); // Cargamos tiendas para el selector
  }

  ngOnDestroy() {
    this.form.reset();
    while (this.storeAssignments.length !== 0) {
      this.storeAssignments.removeAt(0);
    }
  }

  get storeAssignments() {
    return this.form.get('storeAssignments') as FormArray;
  }

  getPermissions(assignmentIndex: number): FormArray {
    const assignment = this.storeAssignments.at(assignmentIndex) as FormGroup;
    return assignment.get('permissions') as FormArray;
  }

  getActions(assignmentIndex: number, modIndex: number): FormArray {
    const permissions = this.getPermissions(assignmentIndex);
    const modGroup = permissions.at(modIndex) as FormGroup;
    return modGroup.get('actions') as FormArray;
  }

  isStoreAssigned(storeId: number): boolean {
    return this.storeAssignments.value.some((s: any) => s.storeId === storeId);
  }

  toggleStoreAssignment(storeId: number) {
    const idx = this.storeAssignments.value.findIndex((s: any) => s.storeId === storeId);
    if (idx > -1) {
      this.storeAssignments.removeAt(idx);
    } else {
      this.addStoreAssignment(storeId);
    }
  }

  addStoreAssignment(storeId: number, modules: any[] = []) {
    if (this.isStoreAssigned(storeId) && modules.length === 0) return;

    const existingIdx = this.storeAssignments.value.findIndex((s: any) => s.storeId === storeId);
    if (existingIdx > -1 && modules.length > 0) {
      this.storeAssignments.removeAt(existingIdx);
    }

    const permissionsArray = this.fb.array(
      this.modules.map(mod => {
        const existing = modules.find(m => m.moduleId === mod.id || m.moduleCode === mod.code);
        const actions = existing ? existing.actions || [] : [];
        return this.fb.group({
          moduleId: [mod.id],
          actions: this.fb.array(actions.map((act: string) => this.fb.control(act)))
        });
      })
    );

    const assignment = this.fb.group({
      storeId: [storeId],
      permissions: permissionsArray
    });

    this.storeAssignments.push(assignment);
  }

  toggleAction(assignmentIndex: number, modIndex: number, action: string) {
    const actionsArr = this.getActions(assignmentIndex, modIndex);
    const index = actionsArr.value.indexOf(action);
    if (index > -1) {
      actionsArr.removeAt(index);
    } else {
      actionsArr.push(this.fb.control(action));
    }
  }

  isActionSelected(assignmentIndex: number, modIndex: number, action: string): boolean {
    const actionsArr = this.getActions(assignmentIndex, modIndex);
    return actionsArr.value.includes(action);
  }

  getStoreName(storeId: number): string {
    const stores = this.storeStore.storesPage()?.stores || [];
    const found = stores.find(s => s.id === storeId);
    return found ? found.name : `Tienda #${storeId}`;
  }

  onSubmit() {
    console.log("Submit iniciado, formulario válido:", this.form.valid);
    if (this.form.valid) {
      // Estructura anidada para el backend:
      // { name, lastName, storeAssignments: [{ storeId, permissions: [{ moduleId, actions }] }] }
      const payload = {
        name: this.form.value.name,
        lastName: this.form.value.lastName,
        storeAssignments: this.storeAssignments.value 
      };
      console.log("Enviando datos:", payload);
      this.submitForm.emit(payload);
    } else {
      console.log("Formulario inválido, errores:", this.form.errors);
      this.form.markAllAsTouched();
    }
  }
}
