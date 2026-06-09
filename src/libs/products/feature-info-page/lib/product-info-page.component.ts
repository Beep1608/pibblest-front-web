// src/libs/products/feature-info-page/lib/product-info-page.component.ts
import { Component, effect, inject, OnInit, signal } from "@angular/core";
import { FormBuilder, ReactiveFormsModule, Validators } from "@angular/forms";
import { TranslatePipe } from "@ngx-translate/core";
import { ProductStore } from "../../data-access/lib/store/product.store";
import { TagStore } from "../../../tags/data-access/store/tag.store";

@Component({
	selector: 'app-product-info-page',
	standalone: true,
	imports: [ReactiveFormsModule, TranslatePipe],
	templateUrl: './product-info-page.component.html'
})
export class ProductInfoPage implements OnInit {
	private fb = inject(FormBuilder);
	productStore = inject(ProductStore);
	tagStore = inject(TagStore);

	// Bandera reactiva local para bloqueo total e instantáneo en la interfaz
	isProcessing = signal(false);

	productForm = this.fb.nonNullable.group({
		name: ['', [Validators.required]],
		sku: ['', [Validators.required]],
		barcode: ['', [Validators.required]],
		brand: ['', [Validators.required]],
		basePrice: [0, [Validators.required, Validators.min(0)]],
		cost: [0, [Validators.required, Validators.min(0)]],
		quantity: [0, [Validators.required, Validators.min(0)]],
		description: ['', [Validators.required]],
		tagsId: [[] as number[]]
	});

	constructor() {
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
					description: product.description,
					tagsId: product.tags ? product.tags.map(t => t.id) : []
				});
			}
		});

		// ✨ FIX: Sin retardos artificiales. Redirección absolutamente instantánea.
		effect(() => {
			if (this.productStore.isSuccess()) {
				this.goBack();
			}
		});

		// Desbloqueo seguro de la interfaz si ocurre un error en el servidor
		effect(() => {
			if (!this.productStore.isSubmitting()) {
				this.isProcessing.set(false);
			}
		}, { allowSignalWrites: true });
	}

	ngOnInit() {
		this.tagStore.loadAllProductTagsList();
		
		const id = this.productStore.selectedProductId();
		if (id) {
			this.productStore.loadProductDetails(id);
		} else {
			this.goBack();
		}
	}

	onTagsChange(event: Event) {
		const selectElement = event.target as HTMLSelectElement;
		const selectedOptions = Array.from(selectElement.selectedOptions);
		const selectedIds = selectedOptions.map(option => Number(option.value));
		this.productForm.controls.tagsId.setValue(selectedIds);
	}

	onSubmit() {
		if (this.productForm.valid && !this.isProcessing()) {
			this.isProcessing.set(true); // Bloqueo instantáneo anti-spam
			const id = this.productStore.selectedProductId();
			if (id) {
				this.productStore.updateProduct({ id, request: this.productForm.getRawValue() });
			}
		} else if (this.productForm.invalid) {
			this.productForm.markAllAsTouched();
		}
	}

	goBack() {
		this.productStore.setSelectedProductId(null);
		this.productStore.resetProductState();
		this.productStore.setProductView('admin-inventory');
	}
}