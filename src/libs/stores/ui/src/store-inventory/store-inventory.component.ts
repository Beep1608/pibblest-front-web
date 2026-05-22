
import { Component, inject } from '@angular/core';
import { StoreStore } from '../../../data-access';
import { CheckoutComponent } from '../lib/checkout-component/checkout.component';
import { ProductInventoryPage } from '../../../../products/feature-inventory-page/lib/product-inventory-page.component';



@Component({
	selector: 'app-store-invetory-component',
	imports: [CheckoutComponent, ProductInventoryPage],
	templateUrl: './store-inventory.component.html',
})
export class StoreInventoryComponent {
	store = inject(StoreStore);








	
}
