// src/libs/stores/ui/src/lib/store-table/store-table.component.ts
import { Component, ElementRef, inject, input, viewChild, signal, OnInit } from "@angular/core";
import { StorePreview } from "../../../../data-access/lib/models/store.model";
import { TranslatePipe } from "@ngx-translate/core";
import { StoreStore } from "../../../../data-access/lib/store/store.store";
import { CartStore } from "../../../../../cart/data-access/lib/store/cart.store";
import { SaleStore } from "../../../../../sales/data-access";
import { TitleCasePipe } from "@angular/common";

@Component({
  selector: 'app-store-table-component',
  standalone: true,
  imports: [TranslatePipe, TitleCasePipe],
  templateUrl: './store-table.component.html'
})
export class StoreTableComponent implements OnInit {
  stores = input.required<StorePreview[]>();

  storeStore = inject(StoreStore);
  cart = inject(CartStore);
  sale = inject(SaleStore);

  deleteModalTable = viewChild<ElementRef<HTMLDialogElement>>('deleteModalTable');
  selectedStoreForDelete: StorePreview | null = null;

  // ✨ Nueva señal para restringir acceso
  isOwner = signal(false);

  ngOnInit() {
    this.checkUserRole();
  }

  checkUserRole() {
    const token = localStorage.getItem('pibblest_token');
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        this.isOwner.set(payload.role === 'OWNER' || payload.isOwner === true);
      } catch (e) {
        this.isOwner.set(false);
      }
    }
  }

  selectStore(storeId: number) {
    if (this.storeStore.selectedStore() !== undefined && this.storeStore.selectedStore() !== storeId) {
        this.cart.clearCart();
        this.sale.resetAlerts();
    }
    this.storeStore.setSelectedStore(storeId);
    this.storeStore.setView('store-page');
  }

  goToEdit(storeDetails: StorePreview) {
    this.storeStore.setSelectedStoreDetails(storeDetails);
    this.storeStore.setView('edit-store');
  }

  openDeleteModal(storeInfo: StorePreview) {
    this.selectedStoreForDelete = storeInfo;
    this.deleteModalTable()?.nativeElement.showModal();
  }

  closeDeleteModal() {
    this.selectedStoreForDelete = null;
    this.deleteModalTable()?.nativeElement.close();
  }

  confirmDelete() {
    if (this.selectedStoreForDelete) {
      this.storeStore.deleteStore(this.selectedStoreForDelete.id);
    }
    this.closeDeleteModal();
  }
}

