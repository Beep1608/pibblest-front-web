// src/libs/stores/feature-manage-product/src/lib/store-product-manage.component.ts
import { Component, inject, OnInit, computed, ElementRef, viewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { StoreStore } from '../../../data-access/lib/store/store.store';
import { ProductStore } from '../../../../products/data-access/lib/store/product.store';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-store-product-manage',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, TranslateModule],
  template: `
    <div class="container mx-auto p-4 max-w-lg">
      <div class="flex items-center gap-4 mb-6">
        <button class="btn btn-ghost btn-circle" (click)="goBack()">
          <i class="fa-solid fa-arrow-left text-lg"></i>
        </button>
        <h1 class="text-2xl font-bold">{{ 'stores.manageProduct.title' | translate }}</h1>
      </div>

      <div class="card bg-base-100 shadow-xl border border-base-200">
        <div class="card-body">
            
          @if (canUpdate()) {
              <form [formGroup]="stockForm" (ngSubmit)="onUpdateStock()">
                <div class="form-control mb-4">
                  <label class="label">
                    <span class="label-text font-semibold">{{ 'stores.manageProduct.stockLabel' | translate }}</span>
                  </label>
                  <input type="number" formControlName="stock" min="0"
                         class="input input-bordered w-full focus:input-primary" 
                         [class.input-error]="stockForm.invalid && stockForm.touched" />
                </div>
                
                <button type="submit" class="btn btn-primary w-full" [disabled]="stockForm.invalid">
                  <i class="fa-solid fa-boxes-stacked mr-2"></i>
                  {{ 'stores.manageProduct.updateBtn' | translate }}
                </button>
              </form>
          }

          @if (canUpdate() && canDelete()) {
              <div class="divider my-6">Opciones Avanzadas</div>
          }

          @if (canDelete()) {
              <button type="button" class="btn btn-error btn-outline w-full" (click)="openRemoveModal()">
                  <i class="fa-solid fa-link-slash mr-2"></i>
                  {{ 'stores.manageProduct.removeBtn' | translate }}
              </button>
          }
        </div>
      </div>
    </div>

    <dialog #removeModal class="modal">
      <div class="modal-box">
        <h3 class="font-bold text-lg text-error flex items-center gap-2">
          <i class="fa-solid fa-triangle-exclamation"></i>
          {{ 'stores.manageProduct.removeBtn' | translate }}
        </h3>
        <p class="py-4 text-base">
          {{ 'stores.manageProduct.removeConfirm' | translate }}
        </p>
        <div class="modal-action">
          <button class="btn btn-ghost" (click)="closeRemoveModal()">
            {{ 'stores.manageProduct.cancelBtn' | translate }}
          </button>
          <button class="btn btn-error" (click)="confirmRemove()">
            <i class="fa-solid fa-trash mr-1"></i> Confirmar
          </button>
        </div>
      </div>
      <form method="dialog" class="modal-backdrop">
        <button (click)="closeRemoveModal()">close</button>
      </form>
    </dialog>
  `
})
export class StoreProductManageComponent implements OnInit {
  private fb = inject(FormBuilder);
  store = inject(StoreStore);
  product = inject(ProductStore);
  
  // ✨ Mapeo reactivo exacto gracias a tu JSON payload
  canUpdate = computed(() => this.store.hasPermission('MODULE_PRODUCTS', 'UPDATE'));
  canDelete = computed(() => this.store.hasPermission('MODULE_PRODUCTS', 'DELETE'));

  removeModal = viewChild<ElementRef<HTMLDialogElement>>('removeModal');

  stockForm = this.fb.nonNullable.group({
    stock: [0, [Validators.required, Validators.min(0)]]
  });

  ngOnInit() {
    const currentProductId = this.store.selectedProductId();
    if (currentProductId) {
        const productStoreState = (this.product as any).productsPage?.()?.products || [];
        const productRef = productStoreState.find((p: any) => p.product?.id === currentProductId || p.id === currentProductId);
        if (productRef) {
            const currentStock = productRef.currentQuantity ?? productRef.stock ?? 0;
            this.stockForm.patchValue({ stock: currentStock });
        }
    }
  }

  onUpdateStock() {
      if (this.stockForm.valid && this.store.selectedProductId()) {
          this.goBack();
      }
  }

  openRemoveModal() {
      this.removeModal()?.nativeElement.showModal();
  }

  closeRemoveModal() {
      this.removeModal()?.nativeElement.close();
  }

  confirmRemove() {
      if (this.store.selectedProductId()) {
           this.closeRemoveModal();
           this.goBack();
      }
  }

  goBack() {
    this.store.setSelectedProductId(null);
    this.store.setView('store-page');
  }
}
