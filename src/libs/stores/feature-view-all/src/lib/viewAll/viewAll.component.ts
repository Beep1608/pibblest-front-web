import { CommonModule } from "@angular/common";
import { Component, signal } from "@angular/core";
import { TranslatePipe } from "@ngx-translate/core";
import { StorePreview } from "../../../../data-access/lib/models/store.model";


@Component({
  selector: 'app-store-view-all-page',
  imports: [CommonModule, TranslatePipe],
  templateUrl: './viewAll.component.html',
})
export class StoreViewAllPage {
  stores = signal<StorePreview[]>([
    {
      name: 'Abarrote',
      growthFromStart: 80.2,
      employees: 2,
      salesOfToday: 26,
      createdAt: '01/02/2026',
      totalProducts: 100,
      currentQuantityOfProducts: 50,
    },
    {
      name: 'Abarrote',
      growthFromStart: 80.2,
      employees: 2,
      salesOfToday: 26,
      createdAt: '01/02/2026',
      totalProducts: 100,
      currentQuantityOfProducts: 50,
    },
    {
      name: 'Abarrote',
      growthFromStart: 80.2,
      employees: 2,
      salesOfToday: 26,
      createdAt: '01/02/2026',
      totalProducts: 100,
      currentQuantityOfProducts: 50,
    },
    {
      name: 'Abarrote',
      growthFromStart: 80.2,
      employees: 2,
      salesOfToday: 26,
      createdAt: '01/02/2026',
      totalProducts: 100,
      currentQuantityOfProducts: 50,
    },
  ]);
}