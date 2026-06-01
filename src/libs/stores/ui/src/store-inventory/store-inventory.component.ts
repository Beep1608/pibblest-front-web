
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
export class StoreInventoryComponent  {
	store = inject(StoreStore);
	tag = inject(TagStore);
	product = inject(ProductStore);

	//ngOnInit() {
	//	//Llamar a los endpoint tag y product para que sean especificos por tienda
	//}

	buscarEnTienda(keyword: string) {
		const currentStoreId = this.store.selectedStore();
		//this.product.getAllProducts( keyword, currentStoreId);
	}
}
