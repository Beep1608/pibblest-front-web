// src/libs/products/feature-create-page/lib/product-create-page.component.ts
import { Component, effect, inject, OnInit, signal } from "@angular/core";
import { FormBuilder, ReactiveFormsModule, Validators } from "@angular/forms";
import { TranslatePipe } from "@ngx-translate/core";
import { ProductStore } from "../../data-access/lib/store/product.store";
import { TagStore } from "../../../tags/data-access/store/tag.store";

@Component({
	selector: 'app-product-create-page',
	standalone: true,
	imports: [ReactiveFormsModule, TranslatePipe],
	templateUrl: './product-create-page.component.html'
})
export class ProductCreatePageComponent implements OnInit {
	private fb = inject(FormBuilder);
	product = inject(ProductStore);
	tagStore = inject(TagStore);

	// Bandera reactiva local para bloqueo total e instantáneo en la interfaz
	isProcessing = signal(false);

	productForm = this.fb.nonNullable.group({
		name: ['', [Validators.required]],
		sku: ['', [Validators.required]],
		barcode: [''],
		brand: ['', [Validators.required]],
		basePrice: [0, [Validators.required, Validators.min(0)]],
		cost: [0, [Validators.required, Validators.min(0)]],
		quantity: [0, [Validators.required, Validators.min(0)]],
		description: ['', [Validators.required]],
		tagsId: [[] as number[]]
	});

	constructor() {
		// Redirección instantánea al confirmar el éxito en el Store
		effect(() => {
			if (this.product.isSuccess()) {
				this.goBack();
			}
		});

		// Desbloqueo seguro de la interfaz si ocurre un error en el servidor
		effect(() => {
			if (!this.product.isSubmitting()) {
				this.isProcessing.set(false);
			}
		});
	}

	ngOnInit() {
		this.tagStore.loadAllProductTagsList();
	}

	onTagsChange(event: Event) {
		const selectElement = event.target as HTMLSelectElement;
		const selectedOptions = Array.from(selectElement.selectedOptions);
		const selectedIds = selectedOptions.map(option => Number(option.value));
		this.productForm.controls.tagsId.setValue(selectedIds);
	}

	onSubmit() {
		if (this.productForm.valid && !this.isProcessing()) {
			this.isProcessing.set(true); // Bloqueo en el mismo milisegundo del submit
			this.product.addProduct(this.productForm.getRawValue());
		} else if (this.productForm.invalid) {
			this.productForm.markAllAsTouched();
		}
	}

	goBack() {
		this.product.resetProductState(); 
		this.product.setProductView('admin-inventory');
	}
}
