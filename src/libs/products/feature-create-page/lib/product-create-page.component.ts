// src/libs/products/feature-create-page/lib/product-create-page.component.ts
import { Component, effect, inject, OnInit } from "@angular/core";
import { FormBuilder, ReactiveFormsModule, Validators } from "@angular/forms";
import { TranslatePipe } from "@ngx-translate/core";
import { ProductStore } from "../../data-access/lib/store/product.store";
import { TagStore } from "../../../tags/data-access/store/tag.store";

@Component({
	selector: 'app-product-create-page',
	imports: [ReactiveFormsModule, TranslatePipe],
	templateUrl: './product-create-page.component.html'
})
export class ProductCreatePageComponent implements OnInit {
	private fb = inject(FormBuilder);
	product = inject(ProductStore);
	tagStore = inject(TagStore);

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
			if (this.product.isSuccess()) {
				setTimeout(() => {
					this.goBack();
				}, 1500); 
			}
		});
	}

	ngOnInit() {
		this.tagStore.loadProductTags();
	}

	onTagsChange(event: Event) {
		const selectElement = event.target as HTMLSelectElement;
		const selectedOptions = Array.from(selectElement.selectedOptions);
		const selectedIds = selectedOptions.map(option => Number(option.value));
		this.productForm.controls.tagsId.setValue(selectedIds);
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
