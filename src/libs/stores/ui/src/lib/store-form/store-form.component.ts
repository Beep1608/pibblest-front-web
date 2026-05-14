// src/libs/stores/ui/src/lib/store-form/store-form.component.ts
import { Component, output, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { CommonModule, TitleCasePipe } from '@angular/common';
import { CreateStoreDto, StoreStatus } from '../../../../data-access/lib/models/store.model';

@Component({
  selector: 'app-store-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, TranslateModule, TitleCasePipe],
  templateUrl: './store-form.component.html',
})
export class StoreFormComponent {
  private fb = inject(FormBuilder);

  submitForm = output<CreateStoreDto>();
  cancel = output<void>();

  storeStatuses = Object.values(StoreStatus);

  form = this.fb.nonNullable.group({
    name: ['', [Validators.required]],
    address: ['', [Validators.required]],
    status: [StoreStatus.ACTIVE, [Validators.required]],
  });

  onSubmit() {
    if (this.form.valid) {
      this.submitForm.emit(this.form.getRawValue());
    }
  }
}
