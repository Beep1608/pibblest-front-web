import { Component, ElementRef, inject, input, viewChild } from "@angular/core";
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
	
	sale = inject(SaleStore);
	cart = inject(CartStore);
	productStore = inject(ProductStore);

	// Referencia estricta al modal nativo de DaisyUI usando signals
	deleteModal = viewChild<ElementRef<HTMLDialogElement>>('deleteModal');

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