// src/libs/products/feature-admin-inventory-page/lib/product-admin-inventory-page.component.ts
import { Component, inject, OnInit } from "@angular/core";
import { TagStore } from "../../../tags/data-access/store/tag.store";
import { ProductStore } from "../../data-access/lib/store/product.store";
import { ProductPreviewComponent } from "../../ui/src/lib/product-preview-component/product-preview.component";
import { TagButtonsComponent } from "../../../tags/ui/src/lib/tags-buttons.component/tags-buttons.component";
import { TranslatePipe } from "@ngx-translate/core";

@Component({
	selector: 'app-product-admin-inventory-page',
	imports: [ProductPreviewComponent, TagButtonsComponent, TranslatePipe],
	templateUrl: './product-admin-inventory-page.component.html'
})
export class ProductAdminInventoryPage implements OnInit {
	tag = inject(TagStore);
	product = inject(ProductStore);

	lastKeyword = '';

	ngOnInit() {
		this.product.getGlobalProducts(null);
	}

	searchAsAdmin(keyword: string) {
		const cleanKeyword = keyword.trim();

		if (cleanKeyword === this.lastKeyword) {
			return;
		}

		this.lastKeyword = cleanKeyword;
		
		this.product.getGlobalProducts(cleanKeyword);
	}

	navigateToCreate() {
		// Usamos el estado del módulo en vez del global
		this.product.setProductView('create');
	}
}