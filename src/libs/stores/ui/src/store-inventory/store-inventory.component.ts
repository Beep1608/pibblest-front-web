
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
		this.tag.getAllTagsForProducts('');
		this.product.getAllProductsFromStore({storeId: this.store.selectedStore() ?? 0, keyword: null});
	}

	searchOnStore(keyword: string) {
		this.product.getAllProductsFromStore( {storeId: this.store.selectedStore() ?? 0, keyword: keyword});
	}
}
