import { Component, ElementRef, inject, input, output, viewChild } from "@angular/core";
import { Product } from "../../../../data-access/lib/models/product.model";
import { TranslatePipe } from "@ngx-translate/core";
import { SaleStore } from "../../../../../sales/data-access";
import { CartStore } from "../../../../../cart/data-access/lib/store/cart.store";
import { ProductStore } from "../../../../data-access/lib/store/product.store";

@Component({
	selector:'app-product-preview-component',
	imports:[TranslatePipe],
	templateUrl:'./product-preview.component.html'
})
export class ProductPreviewComponent {
	product = input.required<Product>();
	viewMode = input<'admin' | 'employee'>('employee'); 
	
	// ✨ FIX: Oficialmente exponemos el evento para que suba hasta la tienda
	productSelect = output<number>();
	
	sale = inject(SaleStore);
	cart = inject(CartStore);
	productStore = inject(ProductStore);

	deleteModal = viewChild<ElementRef<HTMLDialogElement>>('deleteModal');

	// ✨ FIX: Función que delega el clic internamente
	onCardClick() {
		if (this.viewMode() === 'employee') {
			this.productSelect.emit(this.product().id);
		}
	}

	goToEdit() {
		this.productStore.setSelectedProductId(this.product().id);
		this.productStore.setProductView('info');
	}

	openDeleteModal() {
		this.deleteModal()?.nativeElement.showModal();
	}

	closeDeleteModal() {
		this.deleteModal()?.nativeElement.close();
	}

	confirmDelete() {
		this.productStore.deleteProduct(this.product().id);
		this.closeDeleteModal();
	}
}