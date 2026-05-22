import { Component, inject } from "@angular/core";
import { ProductStore } from "../../data-access/lib/store/product.store";
import { ProductPreviewComponent } from "../../ui/src/lib/product-preview-component/product-preview.component";
import { TagButtonsComponent } from "../../../tags/ui/src/lib/tags-buttons.component/tags-buttons.component";
import { TagStore } from "../../../tags/data-access/store/tag.store";


@Component({
	selector: 'app-product-invetory-page',
	imports: [ProductPreviewComponent, TagButtonsComponent],
	templateUrl: './product-inventory-page.component.html',
})
export class ProductInventoryPage {
	product = inject(ProductStore);
	tag = inject(TagStore);
	ngOnInit() {
		this.tag.getAllTagsForProducts('');

		this.product.getAllProducts(null);
	}

    lastKeyword = '';

	onSearch(keyword: string) {
        const cleanKeyword = keyword.trim();


        if(cleanKeyword == this.lastKeyword){
            return;
        }

        this.lastKeyword =cleanKeyword;
		this.product.getAllProducts(cleanKeyword);
	}
}