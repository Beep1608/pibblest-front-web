import { Component, effect, inject, OnInit } from "@angular/core";
import { FormBuilder, ReactiveFormsModule, Validators } from "@angular/forms";
import { TranslatePipe } from "@ngx-translate/core";
import { ProductStore } from "../../data-access/lib/store/product.store";

@Component({
	selector: 'app-product-info-page',
	imports: [ReactiveFormsModule, TranslatePipe],
	templateUrl: './product-info-page.component.html'
})
export class ProductInfoPage implements OnInit {
	private fb = inject(FormBuilder);
	productStore = inject(ProductStore);

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
		// Inicializa el formulario cuando el store obtenga el producto seleccionado
		effect(() => {
			const product = this.productStore.selectedProduct();
			if (product) {
				this.productForm.patchValue({
					name: product.name,
					sku: product.sku,
					barcode: product.barcode,
					brand: product.brand,
					basePrice: product.basePrice,
					cost: product.cost,
					quantity: product.quantity, 
					description: product.description
				});
			}
		});

		// Redirección reactiva al confirmar el éxito de la operación
		effect(() => {
			if (this.productStore.isSuccess()) {
				setTimeout(() => {
					this.goBack();
				}, 1500);
			}
		});
	}

	ngOnInit() {
		const id = this.productStore.selectedProductId();
		if (id) {
			this.productStore.loadProductDetails(id);
		} else {
			this.goBack();
		}
	}

	onSubmit() {
		if (this.productForm.valid) {
			const id = this.productStore.selectedProductId();
			if (id) {
				this.productStore.updateProduct({ id, request: this.productForm.getRawValue() });
			}
		} else {
			this.productForm.markAllAsTouched();
		}
	}

	goBack() {
		this.productStore.setSelectedProductId(null);
		this.productStore.setProductView('admin-inventory');
	}
}