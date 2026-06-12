// src/libs/stores/feature-page/lib/store-page.component.ts
import { DecimalPipe } from "@angular/common";
import { Component, inject, OnInit, effect } from "@angular/core";
import { TranslatePipe } from "@ngx-translate/core";
import { StoreInventoryComponent } from "../../ui/src/store-inventory/store-inventory.component";
import { StoreStore } from "../../data-access";

@Component({
  selector: 'app-store-page',
  standalone: true,
  imports: [TranslatePipe, DecimalPipe, StoreInventoryComponent],
  templateUrl: './store-page.component.html',
})
export class StorePage implements OnInit {
  store = inject(StoreStore);
  
  constructor() {
    // ✨ FIX: Eliminada la configuración deprecada de allowSignalWrites
    effect(() => {
      const current = this.store.selectedSubMenu();
      if (!this.store.isOwnerUser()) {
        const canViewSales = this.store.hasPermission('MODULE_SALES');
        const canViewProducts = this.store.hasPermission('MODULE_PRODUCTS');
        const canReadGlobal = this.store.hasPermission('MODULE_PRODUCTS', 'READ');
        
        if (current === 'sale' && !canViewSales) {
           if (canViewProducts) this.store.setSubmenu('products');
        }
        if (current === 'sale-history' && !canViewSales) {
           if (canViewProducts) this.store.setSubmenu('products');
        }
        if (current === 'products' && !canViewProducts) {
           if (canViewSales) this.store.setSubmenu('sale');
        }
        if (current === 'global-inventory' && !canReadGlobal) {
           if (canViewProducts) this.store.setSubmenu('products');
           else if (canViewSales) this.store.setSubmenu('sale');
        }
      }
    }); 
  }

  ngOnInit() {
  }
}