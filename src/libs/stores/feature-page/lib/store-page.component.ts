// src/libs/stores/feature-page/lib/store-page.component.ts
import { DecimalPipe } from "@angular/common";
import { Component, inject, OnInit, effect } from "@angular/core";
import { TranslatePipe } from "@ngx-translate/core";
import { StoreInventoryComponent } from "../../ui/src/store-inventory/store-inventory.component";
import { StoreStore } from "../../data-access";
// ✨ Importamos el nuevo componente del historial
import { SaleHistoryComponent } from "../../../sales/ui/src/lib/sale-history/sale-history.component";

@Component({
  selector: 'app-store-page',
  standalone: true,
  imports: [TranslatePipe, DecimalPipe, StoreInventoryComponent, SaleHistoryComponent],
  templateUrl: './store-page.component.html',
})
export class StorePage implements OnInit {
  store = inject(StoreStore);
  
  constructor() {
    effect(() => {
      const current = this.store.selectedSubMenu();
      if (!this.store.isOwnerUser()) {
        const canViewProducts = this.store.hasPermission('MODULE_PRODUCTS');
        const canReadGlobal = this.store.hasPermission('MODULE_PRODUCTS', 'READ');

        // Sales now live inside the 'products' submenu; keep users on a submenu they can see.
        if (current === 'products' && !canViewProducts) {
           this.store.setSubmenu('sale-history');
        }
        if (current === 'global-inventory' && !canReadGlobal) {
           if (canViewProducts) this.store.setSubmenu('products');
           else this.store.setSubmenu('sale-history');
        }
      }
    }); 
  }

  ngOnInit() {
  }
}