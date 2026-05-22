import { Component, computed, effect, ElementRef, inject, input, signal, viewChild } from "@angular/core";
import { StorePreview } from "../../../data-access/lib/models/store.model";
import { DashboardStore } from "../../../../../app/feature-dashboard/src/lib/data-access/store/dashboard.store";
import { StoreStore } from "../../../data-access";
import { CartStore } from "../../../../cart/data-access/lib/store/cart.store";
import { SaleStore } from "../../../../sales/data-access";


@Component({
  selector: 'app-store-preview-component',
  standalone: true,
  imports: [],
  templateUrl: './store-preview.component.html',
  styleUrl: './store-preview.component.css',
})
export class StorePreviewComponent {
  storePreview = input.required<StorePreview>();

  store = inject(StoreStore);
  cart = inject(CartStore);
  sale = inject(SaleStore);
  
  salesSpan = viewChild<ElementRef<HTMLSpanElement>>('salesSpan');

  constructor() {
    let previousSales = 0;

    effect(() => {
      const currentSales = this.storePreview().salesOfToday || 0;
      const spanElement = this.salesSpan()?.nativeElement;

      if (currentSales > previousSales && previousSales !== 0 && spanElement) {
        // Reiniciamos la animación nativa de CSS a la fuerza
        spanElement.classList.remove('animar-subida');
        void spanElement.offsetWidth; // Obliga al navegador a repintar
        spanElement.classList.add('animar-subida');
      }

      previousSales = currentSales;
    });
  }


  selectStore(storeId: number){
    if(this.store.selectedStore != undefined && this.store.selectedStore() != storeId){
        this.cart.clearCart();
        this.sale.resetAlerts();
    }
    this.store.setSelectedStore(storeId);
    this.store.setView('store-page');
  }
  percentageOfProducts = computed(() => {
    const current = this.storePreview().currentQuantityOfProducts || 0;
    const total = this.storePreview().totalProducts || 0;
    return total === 0 ? 0 : Math.round((current / total) * 100);
  });
}