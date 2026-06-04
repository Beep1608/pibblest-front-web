// src/libs/stores/ui/src/lib/store-form/store-form.component.ts
import { Component, output, inject, input, effect, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { CommonModule, TitleCasePipe } from '@angular/common';
import { StoreStatus, StorePreview } from '../../../../data-access/lib/models/store.model';
import { TagStore } from '../../../../../tags/data-access/store/tag.store';

@Component({
  selector: 'app-store-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, TranslateModule, TitleCasePipe],
  templateUrl: './store-form.component.html',
})
export class StoreFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  tagStore = inject(TagStore);

  initialData = input<StorePreview | null>(null);
  isSubmitting = input<boolean>(false);
  submitForm = output<any>();
  cancel = output<void>();

  storeStatuses = Object.values(StoreStatus);

  form = this.fb.nonNullable.group({
    name: ['', [Validators.required]],
    address: ['', [Validators.required]],
    status: [StoreStatus.ACTIVE, [Validators.required]],
    tagsId: [[] as number[]]
  });

  constructor() {
    effect(() => {
      const data = this.initialData();
      if (data) {
        this.form.patchValue({
          name: data.name,
          address: data.address,
          status: (data.status as string).toLowerCase() as StoreStatus,
          tagsId: data.tags ? data.tags.map(t => t.id) : []
        });
      }
    });
  }

  ngOnInit() {
    this.tagStore.loadAllStoreTagsList();
  }

  onTagsChange(event: Event) {
    const selectElement = event.target as HTMLSelectElement;
    const selectedOptions = Array.from(selectElement.selectedOptions);
    const selectedIds = selectedOptions.map(option => Number(option.value));
    this.form.controls.tagsId.setValue(selectedIds);
  }

  onSubmit() {
    if (this.form.valid) {
      this.submitForm.emit(this.form.getRawValue());
    } else {
      this.form.markAllAsTouched();
    }
  }
}
