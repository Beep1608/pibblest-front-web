// src/libs/stores/feature-edit/src/lib/store-edit.component.ts
import { Component, inject, effect, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StoreStore } from '../../../data-access/lib/store/store.store';
import { StoreFormComponent } from '../../../ui/src/lib/store-form/store-form.component';
import { UpdateStoreRequest } from '../../../data-access/lib/models/store.model';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-store-edit-page',
  standalone: true,
  imports: [CommonModule, StoreFormComponent, TranslateModule],
  template: `
    <div class="container mx-auto p-4 max-w-lg">
      <div class="flex items-center gap-4 mb-6">
        <button class="btn btn-ghost btn-circle" (click)="goBack()">
          <i class="fa-solid fa-arrow-left text-lg"></i>
        </button>
        <h1 class="text-2xl font-bold">{{ 'stores.edit.title' | translate }}</h1>
      </div>

      @if (store.error()) {
        <div class="alert alert-error mb-4"><i class="fa-solid fa-circle-exclamation"></i><span>{{ store.error() }}</span></div>
      }

      <div class="card bg-base-100 shadow-xl border border-base-200">
        <div class="card-body p-0 sm:p-6">
          <app-store-form 
             [initialData]="store.selectedStoreDetails()" 
             [isSubmitting]="store.isSubmitting()"
             (submitForm)="onUpdateStore($event)" 
             (cancel)="goBack()">
          </app-store-form>
        </div>
      </div>
    </div>
  `
})
export class StoreEditComponent implements OnInit {
  readonly store = inject(StoreStore);

  constructor() {
    effect(() => {
      // ✨ FIX: Sin retardos
      if (this.store.isSuccess()) {
        this.goBack();
      }
    });
  }

  ngOnInit() {
    this.store.resetAlerts();
    if (!this.store.selectedStoreDetails()) {
      this.goBack();
    }
  }

  onUpdateStore(dto: UpdateStoreRequest) {
    const details = this.store.selectedStoreDetails();
    if (details) {
      this.store.updateStore({ id: details.id, request: dto });
    }
  }

  goBack() {
    this.store.setSelectedStoreDetails(null);
    this.store.setView('view-all');
  }
}
