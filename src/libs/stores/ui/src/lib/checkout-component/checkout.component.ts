import { Component, inject, signal } from "@angular/core";
import { Product } from "../../../../../products/data-access/lib/models/product.model";
import { StoreStore } from "../../../../data-access";
import { TranslatePipe } from "@ngx-translate/core";
import { SaleStore } from "../../../../../sales/data-access/store/sale.store";
import { DashboardStore } from "../../../../../../app/feature-dashboard/src/lib/data-access/store/dashboard.store";
import { SaleCreateDto } from "../../../../../sales/data-access/models/sale.model";
import { DecimalPipe } from "@angular/common";


@Component({
	selector: 'app-checkout-component',
	imports: [TranslatePipe, DecimalPipe],
	templateUrl: './checkout.component.html',
})
export class CheckoutComponent {
	store = inject(StoreStore);
	sale = inject(SaleStore);
	dashboard = inject(DashboardStore);
	ngOnInit() {
	
		this.sale.resetAlerts();
	}
	createSale() {
		const cartItems = this.sale.cart();

		if (cartItems.length === 0) {
			console.log('Carrito vacío');
			return;
		}

		const dto: SaleCreateDto = {
			items: cartItems.map(item => ({
				productId: item.product.id,
				quantity: item.quantity,
			})),
			storeId: this.dashboard.selectedStoreId() ?? 0,
		};

		this.sale.createSale(dto);
	}
}