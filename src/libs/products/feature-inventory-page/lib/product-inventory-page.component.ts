// src/libs/products/feature-inventory-page/lib/product-inventory-page.component.ts
import { Component, inject, OnInit, output } from '@angular/core';
import { TagButtonsComponent } from '../../../tags/ui/src/lib/tags-buttons.component/tags-buttons.component';
import { ProductStore } from '../../data-access/lib/store/product.store';
import { ProductPreviewComponent } from '../../ui/src/lib/product-preview-component/product-preview.component';
import { ProductTableComponent } from "../../ui/src/lib/product-table-component/product-table.component";
import { TranslatePipe } from '@ngx-translate/core';
import { TagStore } from '../../../tags/data-access/store/tag.store';

@Component({
    selector: 'app-product-invetory-page',
    standalone: true,
    imports: [ProductPreviewComponent, ProductTableComponent, TagButtonsComponent, TranslatePipe],
    templateUrl: './product-inventory-page.component.html',
})
export class ProductInventoryPage implements OnInit {
    product = inject(ProductStore);
    tag = inject(TagStore);
    searchKeyword = output<string>();

    lastKeyword = '';

    ngOnInit() {
        // Garantizamos que la vista de empleados también cargue la lista independiente para el filtro
        this.tag.loadAllProductTagsList();
    }

    onSearch(keyword: string) {
        const cleanKeyword = keyword.trim();
        this.lastKeyword = cleanKeyword;
        this.product.setPage(0);
        this.searchKeyword.emit(cleanKeyword);
    }

    changePage(delta: number) {
        const currentPage = this.product.currentPage();
        this.product.setPage(currentPage + delta);
        this.searchKeyword.emit(this.lastKeyword);
    }
}
