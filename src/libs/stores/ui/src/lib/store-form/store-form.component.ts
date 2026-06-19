// src/libs/stores/ui/src/lib/store-form/store-form.component.ts
import { Component, output, inject, input, effect, OnInit, signal } from '@angular/core';
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

  // ✨ Bandera reactiva local para bloqueo total e instantáneo en la interfaz
  isProcessing = signal(false);

  storeStatuses = Object.values(StoreStatus);

  // Full IANA list when the browser supports it; otherwise a sensible regional fallback.
  timezones: string[] = this.resolveTimezones();

  private readonly browserTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC';

  form = this.fb.nonNullable.group({
    name: ['', [Validators.required]],
    address: ['', [Validators.required]],
    status: [StoreStatus.ACTIVE, [Validators.required]],
    timezone: [this.browserTimezone, [Validators.required]],
    tagsId: [[] as number[]]
  });

  constructor() {
    effect(() => {
      const data = this.initialData();
      if (data) {
        this.form.patchValue({
          name: data.name,
          address: data.address,
          // El backend serializa el estado en minúscula (@JsonValue), igual que los valores del enum.
          status: (data.status as string).toLowerCase() as StoreStatus,
          timezone: data.timezone ?? this.browserTimezone,
          tagsId: data.tags ? data.tags.map(t => t.id) : []
        });
      }
    });

    // ✨ Desbloqueo seguro de la interfaz si el estado de carga (Store) termina sin éxito o con error
    effect(() => {
      if (!this.isSubmitting()) {
        this.isProcessing.set(false);
      }
    });
  }

  ngOnInit() {
    this.tagStore.loadAllStoreTagsList();
  }

  private resolveTimezones(): string[] {
    const intl = Intl as unknown as { supportedValuesOf?: (key: string) => string[] };
    if (typeof intl.supportedValuesOf === 'function') {
      return intl.supportedValuesOf('timeZone');
    }
    return ['UTC', 'America/Mexico_City', 'America/Bogota', 'America/Lima', 'America/Argentina/Buenos_Aires', 'America/New_York', 'Europe/Madrid'];
  }

  onTagsChange(event: Event) {
    const selectElement = event.target as HTMLSelectElement;
    const selectedOptions = Array.from(selectElement.selectedOptions);
    const selectedIds = selectedOptions.map(option => Number(option.value));
    this.form.controls.tagsId.setValue(selectedIds);
  }

  onSubmit() {
    // ✨ FIX: Bloqueo anti-spam instantáneo al evaluar la validez del formulario
    if (this.form.valid && !this.isProcessing()) {
      this.isProcessing.set(true);
      this.submitForm.emit(this.form.getRawValue());
    } else if (this.form.invalid) {
      this.form.markAllAsTouched();
    }
  }
}
