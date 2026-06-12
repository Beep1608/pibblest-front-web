// src/libs/stores/ui/src/store-inventory/store-inventory.component.ts
import { Component, inject, OnInit } from '@angular/core';
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

	ngOnInit() {
		const currentStoreId = this.store.selectedStore();
		if (currentStoreId) {
			this.product.getAllProducts({ storeId: currentStoreId, keyword: null });
		}
		this.tag.setContext('products');
		this.tag.loadTags();
	}

	buscarEnTienda(keyword: string) {
		const currentStoreId = this.store.selectedStore();
		if (currentStoreId) {
			this.product.getAllProducts({ storeId: currentStoreId, keyword: keyword || null });
		}
	}

    // ✨ FIX: Comprobación fluida y reactiva usando la lógica unificada del Store
    onProductSelect(productId: number) {
        const canUpdate = this.store.hasPermission('MODULE_PRODUCTS', 'UPDATE');
        const canDelete = this.store.hasPermission('MODULE_PRODUCTS', 'DELETE');

        if (canUpdate || canDelete || this.store.isOwnerUser()) {
            this.store.setSelectedProductId(productId);
            this.store.setView('manage-store-product'); 
        }
    }
}
