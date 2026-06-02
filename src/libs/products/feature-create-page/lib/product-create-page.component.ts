import { Component, effect, inject } from "@angular/core";
import { FormBuilder, ReactiveFormsModule, Validators } from "@angular/forms";
import { TranslatePipe } from "@ngx-translate/core";
import { ProductStore } from "../../data-access/lib/store/product.store";

@Component({
	selector: 'app-product-create-page',
	imports: [ReactiveFormsModule, TranslatePipe],
	templateUrl: './product-create-page.component.html'
})
export class ProductCreatePageComponent {
	private fb = inject(FormBuilder);
	product = inject(ProductStore);

	productForm = this.fb.nonNullable.group({
		name: ['', [Validators.required]],
		sku: ['', [Validators.required]],
		barcode: ['', [Validators.required]],
		brand: ['', [Validators.required]],
		basePrice: [0, [Validators.required, Validators.min(0)]],
		cost: [0, [Validators.required, Validators.min(0)]],
		quantity: [0, [Validators.required, Validators.min(0)]],
		description: ['', [Validators.required]]
	});

	constructor() {
		// Redirección reactiva al confirmar el éxito de la operación
		effect(() => {
			if (this.product.isSuccess()) {
				setTimeout(() => {
					this.goBack();
				}, 1500); // 1.5s para permitir visualizar la alerta de éxito
			}
		});
	}

	onSubmit() {
		if (this.productForm.valid) {
			this.product.addProduct(this.productForm.getRawValue());
		} else {
			this.productForm.markAllAsTouched();
		}
	}

	goBack() {
		this.product.setProductView('admin-inventory');
	}
}
