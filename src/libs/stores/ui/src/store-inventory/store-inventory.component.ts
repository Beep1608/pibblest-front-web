// src/libs/stores/ui/src/store-inventory/store-inventory.component.ts
import { Component, inject, OnInit, effect } from '@angular/core';
import { StoreStore } from '../../../data-access';
import { CheckoutComponent } from '../lib/checkout-component/checkout.component';
import { ProductInventoryPage } from '../../../../products/feature-inventory-page/lib/product-inventory-page.component';
import { TagStore } from '../../../../tags/data-access/store/tag.store';
import { ProductStore } from '../../../../products/data-access/lib/store/product.store';

@Component({
    selector: 'app-store-invetory-component',
    imports: [CheckoutComponent, ProductInventoryPage],
    templateUrl: './store-inventory.component.html',
})
export class StoreInventoryComponent implements OnInit {
    store = inject(StoreStore);
    tag = inject(TagStore);
    product = inject(ProductStore);

    constructor() {
        effect(() => {
            const submenu = this.store.selectedSubMenu();
            const storeId = this.store.selectedStore();
            
            if (storeId) {
                if (submenu === 'global-inventory') {
                    this.product.getGlobalProducts(null);
                } else if (submenu === 'products' || submenu === 'sale') {
                    this.product.getAllProducts({ storeId, keyword: null });
                }
            }
        });
    }

    ngOnInit() {
        this.tag.setContext('products');
        this.tag.loadTags();
    }

    buscarEnTienda(keyword: string) {
        const currentStoreId = this.store.selectedStore();
        const submenu = this.store.selectedSubMenu();

        if (currentStoreId) {
            if (submenu === 'global-inventory') {
                this.product.getGlobalProducts(keyword || null);
            } else {
                this.product.getAllProducts({ storeId: currentStoreId, keyword: keyword || null });
            }
        }
    }

    onProductSelect(productId: number) {
        const submenu = this.store.selectedSubMenu();
        
        // ✨ FIX: Reiniciamos el estado isSuccess a false ANTES de cambiar de vista
        // Esto evita que el formulario se auto-cierre inmediatamente tras abrirse.
        this.product.resetProductState();
        
        if (submenu === 'global-inventory') {
            const canCreate = this.store.hasPermission('MODULE_PRODUCTS', 'CREATE');
            if (canCreate || this.store.isOwnerUser()) {
                this.store.setSelectedProductId(productId);
                this.store.setView('assign-global-product'); 
            }
        } else {
            const canUpdate = this.store.hasPermission('MODULE_PRODUCTS', 'UPDATE');
            const canDelete = this.store.hasPermission('MODULE_PRODUCTS', 'DELETE');

            if (canUpdate || canDelete || this.store.isOwnerUser()) {
                this.store.setSelectedProductId(productId);
                this.store.setView('manage-store-product'); 
            }
        }
    }
}
