// src/libs/stores/ui/src/store-component/store-preview.component.ts
import { Component, computed, effect, ElementRef, inject, input, viewChild } from "@angular/core";
import { StorePreview } from "../../../data-access/lib/models/store.model";
import { StoreStore } from "../../../data-access";
import { CartStore } from "../../../../cart/data-access/lib/store/cart.store";
import { SaleStore } from "../../../../sales/data-access";
import { TranslatePipe } from "@ngx-translate/core";
import { TitleCasePipe } from "@angular/common";

@Component({
  selector: 'app-store-preview-component',
  standalone: true,
  imports: [TranslatePipe, TitleCasePipe],
  templateUrl: './store-preview.component.html'
})
export class StorePreviewComponent {
  storePreview = input.required<StorePreview>();

  store = inject(StoreStore);
  cart = inject(CartStore);
  sale = inject(SaleStore);
  
  salesSpan = viewChild<ElementRef<HTMLSpanElement>>('salesSpan');
  deleteModal = viewChild<ElementRef<HTMLDialogElement>>('deleteModal');

  constructor() {
    let previousSales = 0;
    effect(() => {
      const currentSales = this.storePreview().salesOfToday || 0;
      const spanElement = this.salesSpan()?.nativeElement;
      if (currentSales > previousSales && previousSales !== 0 && spanElement) {
        spanElement.classList.remove('animar-subida');
        void spanElement.offsetWidth;
        spanElement.classList.add('animar-subida');
      }
      previousSales = currentSales;
    });
  }

  selectStore(storeId: number) {
    if (this.store.selectedStore() !== undefined && this.store.selectedStore() !== storeId) {
        this.cart.clearCart();
        this.sale.resetAlerts();
    }
    this.store.setSelectedStore(storeId);
    this.store.setView('store-page');
  }

  goToEdit() {
    this.store.setSelectedStoreDetails(this.storePreview());
    this.store.setView('edit-store');
  }

  openDeleteModal() {
    this.deleteModal()?.nativeElement.showModal();
  }

  closeDeleteModal() {
    this.deleteModal()?.nativeElement.close();
  }

  confirmDelete() {
    this.store.deleteStore(this.storePreview().id);
    this.closeDeleteModal();
  }

  percentageOfProducts = computed(() => {
    const current = this.storePreview().currentQuantityOfProducts || 0;
    const total = this.storePreview().totalProducts || 0;
    return total === 0 ? 0 : Math.round((current / total) * 100);
  });
}