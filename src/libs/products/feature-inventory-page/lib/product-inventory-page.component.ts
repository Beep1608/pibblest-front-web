// src/libs/products/feature-inventory-page/lib/product-inventory-page.component.ts
import { Component, inject, output } from '@angular/core';
import { TagButtonsComponent } from '../../../tags/ui/src/lib/tags-buttons.component/tags-buttons.component';
import { ProductStore } from '../../data-access/lib/store/product.store';
import { ProductPreviewComponent } from '../../ui/src/lib/product-preview-component/product-preview.component';
import { ProductTableComponent } from "../../ui/src/lib/product-table-component/product-table.component";
import { TranslatePipe } from '@ngx-translate/core';

@Component({
    selector: 'app-product-invetory-page',
    imports: [ProductPreviewComponent, ProductTableComponent, TagButtonsComponent, TranslatePipe],
    templateUrl: './product-inventory-page.component.html',
})
export class ProductInventoryPage {
    product = inject(ProductStore);
    searchKeyword = output<string>();

    lastKeyword = '';

    onSearch(keyword: string) {
        const cleanKeyword = keyword.trim();
        this.lastKeyword = cleanKeyword;
        this.product.setPage(0); // Reseteo paginación
        this.searchKeyword.emit(cleanKeyword);
    }

    changePage(delta: number) {
        const currentPage = this.product.currentPage();
        this.product.setPage(currentPage + delta);
        // Re-emitimos evento para que el shell cargue la data con la nueva página
        this.searchKeyword.emit(this.lastKeyword);
    }
}
