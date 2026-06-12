// src/libs/stores/feature-assign-product/src/lib/store-product-assign.component.ts
import { Component, inject, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { StoreStore } from '../../../data-access/lib/store/store.store';
import { ProductStore } from '../../../../products/data-access/lib/store/product.store';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-store-product-assign',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, TranslateModule],
  template: `
    <div class="container mx-auto p-4 max-w-lg">
      <div class="flex items-center gap-4 mb-6">
        <button class="btn btn-ghost btn-circle" (click)="goBack()">
          <i class="fa-solid fa-arrow-left text-lg"></i>
        </button>
        <h1 class="text-2xl font-bold">{{ 'stores.assignProduct.title' | translate }}</h1>
      </div>

      <div class="card bg-base-100 shadow-xl border border-base-200">
        <div class="card-body">
            
          <form [formGroup]="assignForm" (ngSubmit)="onAssignProduct()">
            <div class="form-control mb-6">
              <label class="label">
                <span class="label-text font-semibold">{{ 'stores.assignProduct.quantityLabel' | translate }}</span>
              </label>
              <input type="number" formControlName="desiredQuantity" min="1"
                     class="input input-bordered w-full focus:input-primary" 
                     [class.input-error]="assignForm.invalid && assignForm.touched" />
              <label class="label">
                <span class="label-text-alt text-base-content/60">Ajusta la capacidad inicial o meta en tienda</span>
              </label>
            </div>
            
            <div class="flex flex-col sm:flex-row gap-3">
                <button type="button" class="btn btn-ghost flex-1" (click)="goBack()" [disabled]="product.isSubmitting()">
                    {{ 'stores.assignProduct.cancelBtn' | translate }}
                </button>
                <button type="submit" class="btn btn-primary flex-1 shadow-sm" [disabled]="assignForm.invalid || product.isSubmitting()">
                    @if (product.isSubmitting()) {
                        <span class="loading loading-spinner"></span>
                    } @else {
                        <i class="fa-solid fa-link mr-2"></i>
                        {{ 'stores.assignProduct.assignBtn' | translate }}
                    }
                </button>
            </div>
          </form>

        </div>
      </div>
    </div>
  `
})
export class StoreProductAssignComponent {
  private fb = inject(FormBuilder);
  store = inject(StoreStore);
  product = inject(ProductStore);

  assignForm = this.fb.nonNullable.group({
    desiredQuantity: [1, [Validators.required, Validators.min(1)]]
  });

  constructor() {
      // ✨ FIX BUG 1: Redirección automática solo tras éxito real en HTTP
      effect(() => {
          if (this.product.isSuccess()) {
              this.goBack();
          }
      });
  }

  onAssignProduct() {
      if (this.assignForm.valid && this.store.selectedProductId() && this.store.selectedStore()) {
          this.product.assignProductToStore({ 
              storeId: this.store.selectedStore()!, 
              productId: this.store.selectedProductId()!, 
              // ✨ FIX: Usamos getRawValue() para garantizar el tipado estricto
              desiredQuantity: this.assignForm.getRawValue().desiredQuantity 
          });
      }
  }

  goBack() {
    this.product.resetProductState();
    this.store.setSelectedProductId(null);
    this.store.setView('store-page');
  }
}
