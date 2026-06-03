// src/libs/tags/ui/src/lib/tag-form/tag-form.component.ts
import { Component, effect, inject, input, output } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { CommonModule } from '@angular/common';
import { Tag, CreateTagRequest } from '../../../../data-access/models/tag.model';

@Component({
  selector: 'app-tag-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, TranslateModule],
  templateUrl: './tag-form.component.html',
})
export class TagFormComponent {
  private fb = inject(FormBuilder);

  initialData = input<Tag | null>(null);
  isSubmitting = input<boolean>(false);
  submitForm = output<CreateTagRequest>();
  cancel = output<void>();

  form = this.fb.nonNullable.group({
    name: ['', [Validators.required, Validators.minLength(2)]],
  });

  constructor() {
    effect(() => {
      const data = this.initialData();
      if (data) {
        this.form.patchValue({ name: data.name });
      }
    });
  }

  onSubmit() {
    if (this.form.valid) {
      this.submitForm.emit(this.form.getRawValue());
    } else {
      this.form.markAllAsTouched();
    }
  }
}
