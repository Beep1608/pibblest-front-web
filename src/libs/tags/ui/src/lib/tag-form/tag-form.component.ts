// src/libs/tags/ui/src/lib/tag-form/tag-form.component.ts
import { Component, effect, inject, input, output, signal } from '@angular/core';
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

  // ✨ Bandera reactiva para bloqueo inmediato de concurrencia
  isProcessing = signal(false);

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

    // ✨ Desbloquear el botón si el servidor responde (éxito o error)
    effect(() => {
      if (!this.isSubmitting()) {
        this.isProcessing.set(false);
      }
    }, { allowSignalWrites: true });
  }

  onSubmit() {
    if (this.form.valid && !this.isProcessing()) {
      this.isProcessing.set(true); // Bloqueo instantáneo
      this.submitForm.emit(this.form.getRawValue());
    } else if (this.form.invalid) {
      this.form.markAllAsTouched();
    }
  }
}
