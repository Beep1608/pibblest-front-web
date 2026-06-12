// src/libs/stores/feature-page/lib/store-page.component.ts
import { DecimalPipe } from "@angular/common";
import { Component, inject, OnInit, signal, effect } from "@angular/core";
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
  
  isOwner = signal(false);
  authorities = signal<string[]>([]);

  constructor() {
    effect(() => {
      // ✨ Redirección automática si intenta acceder a un tab sin permiso
      const current = this.store.selectedSubMenu();
      if (!this.isOwner()) {
        const canViewSales = this.hasPermission('MODULE_SALES');
        const canViewProducts = this.hasPermission('MODULE_PRODUCTS');
        
        if (current === 'sale' && !canViewSales) {
           if (canViewProducts) this.store.setSubmenu('products');
        }
        if (current === 'sale-history' && !canViewSales) {
           if (canViewProducts) this.store.setSubmenu('products');
        }
        if (current === 'products' && !canViewProducts) {
           if (canViewSales) this.store.setSubmenu('sale');
        }
      }
    }, { allowSignalWrites: true });
  }

  ngOnInit() {
    this.checkAuth();
  }

  checkAuth() {
    const token = localStorage.getItem('pibblest_token');
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        this.isOwner.set(payload.role === 'OWNER' || payload.isOwner === true);
        
        // Carga robusta de permisos
        let auths: string[] = [];
        if (Array.isArray(payload.authorities)) {
           auths = payload.authorities;
        } else if (typeof payload.authorities === 'string') {
           auths = payload.authorities.split(',');
        }
        this.authorities.set(auths);
      } catch (e) {
        this.isOwner.set(false);
      }
    }
  }

  // ✨ FIX: Soporte para acciones granulares (UPDATE, DELETE, etc.)
  hasPermission(moduleCode: string, action?: 'CREATE' | 'READ' | 'UPDATE' | 'DELETE'): boolean {
    if (this.isOwner()) return true;
    const storeId = this.store.selectedStore();
    if (!storeId) return false;
    
    if (action) {
        // Validación exacta de la acción
        return this.authorities().some(auth => auth === `STORE_${storeId}_${moduleCode}_${action}`);
    }
    // Validación general de lectura/acceso al módulo
    return this.authorities().some(auth => auth.includes(`STORE_${storeId}_${moduleCode}`));
  }
}