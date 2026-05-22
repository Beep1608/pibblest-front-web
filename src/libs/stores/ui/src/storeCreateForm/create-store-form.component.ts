import { Component, inject } from "@angular/core";
import { FormBuilder, ReactiveFormsModule, Validators } from "@angular/forms";
import { CommonModule } from "@angular/common";
import { FormField } from "@angular/forms/signals";
import { StoreStore } from "../../../data-access/lib/store/store.store";
import { DashboardStore } from "../../../../../app/feature-dashboard/src/lib/data-access/store/dashboard.store";


@Component({
  selector: 'app-create-store-form',
  imports: [CommonModule, ReactiveFormsModule, FormField],
  templateUrl: './create-store-form.component.html',
})
export class CreateStoreFormComponent {
  private fb = inject(FormBuilder);
  private storeStore = inject(StoreStore);
  dashbordStore = inject(DashboardStore);

  storeForm = this.fb.nonNullable.group({
    name: ['', [Validators.required, Validators.minLength(3)]],
    address: ['', [Validators.required]],
    status: ['ACTIVE', [Validators.required]],
  });

  onSubmit() {
    if (this.storeForm.invalid) {
      this.storeForm.markAllAsTouched();
      return;
    }

    const newStoreData = this.storeForm.getRawValue();


  }
}