import { Component, effect, inject, signal } from "@angular/core";
import { StoreStore } from "../../../../data-access";
import { TranslatePipe } from "@ngx-translate/core";
import { SaleStore } from "../../../../../sales/data-access/store/sale.store";
import { SaleCreateDto } from "../../../../../sales/data-access/models/sale.model";
import { DecimalPipe } from "@angular/common";
import { ProductStore } from "../../../../../products/data-access/lib/store/product.store";
import { CartStore } from "../../../../../cart/data-access/lib/store/cart.store";


@Component({
	selector: 'app-checkout-component',
	imports: [TranslatePipe, DecimalPipe],
	templateUrl: './checkout.component.html',
})
export class CheckoutComponent {
	store = inject(StoreStore);
	sale = inject(SaleStore);
	product  = inject(ProductStore);
	cart = inject(CartStore);

	// Opt-in ticket printing: the user decides whether to print after the sale.
	shouldPrint = signal(false);

	constructor(){
		effect(() => {
			if(this.sale.isSuccess()){
				console.log('cambio')
				const soldItems = this.sale.lastSoldItems();
				this.product.reduceStockLocally(soldItems);
				this.cart.clearCart();
			}
		})
	}

	ngOnInit() {
	
		this.sale.resetAlerts();
	}
	createSale() {
		const cartItems = this.cart.cart();

		if (cartItems.length === 0) {
			console.log('Carrito vacío');
			return;
		}

		this.sale.setLastSoldItems(cartItems);
		const dto: SaleCreateDto = {
			items: cartItems.map(item => ({
				productId: item.product.id,
				quantity: item.quantity,
			})),
			storeId: this.store.selectedStore() ?? 0,
		};

		const canPrint = this.store.hasPermission('MODULE_SALES', 'CREATE');
		this.sale.createSale({ dto, print: canPrint && this.shouldPrint() });
	}

	togglePrint(value: boolean) {
		this.shouldPrint.set(value);
	}
}