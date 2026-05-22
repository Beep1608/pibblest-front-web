import { Component, inject, output } from '@angular/core';
import { TagButtonsComponent } from '../../../tags/ui/src/lib/tags-buttons.component/tags-buttons.component';
import { ProductStore } from '../../data-access/lib/store/product.store';
import { ProductPreviewComponent } from '../../ui/src/lib/product-preview-component/product-preview.component';

//Todo hacer tonto este componente
@Component({
	selector: 'app-product-invetory-page',
	imports: [ProductPreviewComponent, TagButtonsComponent],
	templateUrl: './product-inventory-page.component.html',
})
export class ProductInventoryPage {
	product = inject(ProductStore);

	searchKeyword = output<string>();

	lastKeyword = '';

	onSearch(keyword: string) {
		const cleanKeyword = keyword.trim();

		if (cleanKeyword === this.lastKeyword) {
			return;
		}

		this.lastKeyword = cleanKeyword;

		this.searchKeyword.emit(cleanKeyword);
	}
}
