import { Component, computed, effect, ElementRef, inject, input, signal, viewChild } from "@angular/core";
import { StorePreview } from "../../../data-access/lib/models/store.model";
import { DashboardStore } from "../../../../../app/feature-dashboard/src/lib/data-access/store/dashboard.store";


@Component({
  selector: 'app-store-preview-component',
  standalone: true,
  imports: [],
  templateUrl: './store-preview.component.html',
  styleUrl: './store-preview.component.css',
})
export class StorePreviewComponent {
  storePreview = input.required<StorePreview>();

  dashBoardStore = inject(DashboardStore);
  
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


  percentageOfProducts = computed(() => {
    const current = this.storePreview().currentQuantityOfProducts || 0;
    const total = this.storePreview().totalProducts || 0;
    return total === 0 ? 0 : Math.round((current / total) * 100);
  });
}