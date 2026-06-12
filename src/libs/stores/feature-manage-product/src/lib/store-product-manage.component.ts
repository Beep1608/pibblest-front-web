// src/libs/stores/feature-manage-product/src/lib/store-product-manage.component.ts
import { Component, inject, OnInit, computed, ElementRef, viewChild, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { StoreStore } from '../../../data-access/lib/store/store.store';
import { ProductStore } from '../../../../products/data-access/lib/store/product.store';
import { CartStore } from '../../../../cart/data-access/lib/store/cart.store'; // ✨ Importación del carrito
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
                
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                    <div class="form-control">
                      <label class="label">
                        <span class="label-text font-semibold">{{ 'stores.manageProduct.stockLabel' | translate }}</span>
                      </label>
                      <input type="number" formControlName="stock" min="0"
                             class="input input-bordered w-full focus:input-primary" 
                             [class.input-error]="stockForm.controls.stock.invalid && stockForm.controls.stock.touched" />
                    </div>

                    <div class="form-control">
                      <label class="label">
                        <span class="label-text font-semibold">{{ 'stores.manageProduct.desiredQuantityLabel' | translate }}</span>
                      </label>
                      <input type="number" formControlName="desiredQuantity" min="0"
                             class="input input-bordered w-full focus:input-primary" 
                             [class.input-error]="stockForm.controls.desiredQuantity.invalid && stockForm.controls.desiredQuantity.touched" />
                    </div>
                </div>
                
                <button type="submit" class="btn btn-primary w-full" [disabled]="stockForm.invalid || product.isSubmitting()">
                  @if (product.isSubmitting()) {
                     <span class="loading loading-spinner"></span>
                  } @else {
                     <i class="fa-solid fa-boxes-stacked mr-2"></i>
                     {{ 'stores.manageProduct.updateBtn' | translate }}
                  }
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
          <button class="btn btn-ghost" (click)="closeRemoveModal()" [disabled]="product.isSubmitting()">
            {{ 'stores.manageProduct.cancelBtn' | translate }}
          </button>
          <button class="btn btn-error" (click)="confirmRemove()" [disabled]="product.isSubmitting()">
            @if (product.isSubmitting()) {
                <span class="loading loading-spinner"></span>
            } @else {
                <i class="fa-solid fa-trash mr-1"></i> Confirmar
            }
          </button>
        </div>
      </div>
      <form method="dialog" class="modal-backdrop">
        <button (click)="closeRemoveModal()" [disabled]="product.isSubmitting()">close</button>
      </form>
    </dialog>
  `
})
export class StoreProductManageComponent implements OnInit {
  private fb = inject(FormBuilder);
  store = inject(StoreStore);
  product = inject(ProductStore);
  cart = inject(CartStore); // ✨ Inyección del carrito
  
  canUpdate = computed(() => this.store.hasPermission('MODULE_PRODUCTS', 'UPDATE'));
  canDelete = computed(() => this.store.hasPermission('MODULE_PRODUCTS', 'DELETE'));

  removeModal = viewChild<ElementRef<HTMLDialogElement>>('removeModal');

  // ✨ FIX: Agregamos desiredQuantity al formulario para hacerlo editable
  stockForm = this.fb.nonNullable.group({
    stock: [0, [Validators.required, Validators.min(0)]],
    desiredQuantity: [0, [Validators.required, Validators.min(0)]]
  });

  constructor() {
      effect(() => {
          if (this.product.isSuccess()) {
              this.closeRemoveModal();
              this.goBack();
          }
      });
  }

  ngOnInit() {
    const currentProductId = this.store.selectedProductId();
    if (currentProductId) {
        const productStoreState = (this.product as any).productsPage?.()?.products || [];
        const productRef = productStoreState.find((p: any) => p.product?.id === currentProductId || p.id === currentProductId);
        if (productRef) {
            const currentStock = productRef.currentQuantity ?? productRef.stock ?? 0;
            const desiredQuantity = productRef.desiredQuantity ?? 0;
            
            // Llenamos el formulario con ambos valores
            this.stockForm.patchValue({ 
                stock: currentStock,
                desiredQuantity: desiredQuantity
            });
        }
    }
  }

  onUpdateStock() {
      if (this.stockForm.valid && this.store.selectedProductId() && this.store.selectedStore()) {
          // ✨ FIX BUG 1: Purgar el producto del carrito al modificar el inventario
          this.cart.removeFromCartById(this.store.selectedProductId()!);
          
          this.product.updateStoreProductStock({ 
              storeId: this.store.selectedStore()!, 
              productId: this.store.selectedProductId()!, 
              // Tomamos el valor actualizado por el empleado directamente del form
              desiredQuantity: this.stockForm.getRawValue().desiredQuantity, 
              stock: this.stockForm.getRawValue().stock 
          });
      }
  }

  openRemoveModal() {
      this.removeModal()?.nativeElement.showModal();
  }

  closeRemoveModal() {
      this.removeModal()?.nativeElement.close();
  }

  confirmRemove() {
      if (this.store.selectedProductId() && this.store.selectedStore()) {
           // ✨ FIX BUG 2: Purgar el producto del carrito al eliminar su relación con la tienda
           this.cart.removeFromCartById(this.store.selectedProductId()!);
           
           this.product.removeProductFromStore({
               storeId: this.store.selectedStore()!,
               productId: this.store.selectedProductId()!
           });
      }
  }

  goBack() {
    this.product.resetProductState();
    this.store.setSelectedProductId(null);
    this.store.setView('store-page');
  }
}
