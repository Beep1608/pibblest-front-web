// src/libs/products/feature-admin-inventory-page/lib/product-admin-inventory-page.component.ts
import { Component, inject, OnInit, OnDestroy } from "@angular/core";
import { Subscription } from "rxjs";
import { TagStore } from "../../../tags/data-access/store/tag.store";
import { ProductStore } from "../../data-access/lib/store/product.store";
import { ProductPreviewComponent } from "../../ui/src/lib/product-preview-component/product-preview.component";
import { ProductTableComponent } from "../../ui/src/lib/product-table-component/product-table.component";
import { TagButtonsComponent } from "../../../tags/ui/src/lib/tags-buttons.component/tags-buttons.component";
import { TranslatePipe } from "@ngx-translate/core";
import { BarcodeScannerService } from "../../../shared/data-access/services/barcode-scanner.service";

@Component({
    selector: 'app-product-admin-inventory-page',
    standalone: true,
    imports: [ProductPreviewComponent, ProductTableComponent, TagButtonsComponent, TranslatePipe],
    templateUrl: './product-admin-inventory-page.component.html'
})
export class ProductAdminInventoryPage implements OnInit, OnDestroy {
    tag = inject(TagStore);
    product = inject(ProductStore);
    private scanner = inject(BarcodeScannerService);

    private scanSub?: Subscription;

    lastKeyword = '';

    ngOnInit() {
        this.product.getGlobalProducts(null);
        // Garantizamos que los botones de filtro siempre tengan la lista global de productos
        this.tag.loadAllProductTagsList();

        // Owner global inventory: scanning opens the product edit/detail view (searchByBarcode sets currentView 'info').
        this.scanSub = this.scanner.scan$.subscribe(barcode => {
            this.product.searchByBarcode(barcode);
        });
    }

    ngOnDestroy() {
        this.scanSub?.unsubscribe();
    }

    searchAsAdmin(keyword: string) {
        const cleanKeyword = keyword.trim();
        this.lastKeyword = cleanKeyword;
        this.product.setPage(0);
        this.product.getGlobalProducts(cleanKeyword);
    }

    changePage(delta: number) {
        const currentPage = this.product.currentPage();
        this.product.setPage(currentPage + delta);
        this.product.getGlobalProducts(this.lastKeyword);
    }

    navigateToCreate() {
        this.product.setProductView('create');
    }
}