import { Component, inject, OnInit } from '@angular/core';
import { ProductStore } from '../../data-access/lib/store/product.store';
import { ProductAdminInventoryPage } from '../../feature-admin-inventory-page/lib/product-admin-inventory-page.component';
import { ProductCreatePageComponent } from '../../feature-create-page/lib/product-create-page.component';
import { ProductInventoryPage } from '../../feature-inventory-page/lib/product-inventory-page.component';
import { ProductInfoPage } from '../../feature-info-page/lib/product-info-page.component';

@Component({
	selector: 'app-products-shell',
	imports: [
		ProductAdminInventoryPage,
		ProductCreatePageComponent,
		ProductInventoryPage,
		ProductInfoPage
	],
	templateUrl: './products-shell.component.html'
})
export class ProductsShellComponent implements OnInit {
	product = inject(ProductStore);

	ngOnInit() {
		// NOTA: Aquí se podría inyectar el store de autenticación/roles
		// para definir la vista por defecto:
		// if (auth.isEmployee()) { this.product.setProductView('inventory'); }
	}
}
