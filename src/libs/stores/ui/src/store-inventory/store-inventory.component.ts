// src/libs/stores/ui/src/store-inventory/store-inventory.component.ts
import { Component, inject, OnInit, effect, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { StoreStore } from '../../../data-access';
import { CheckoutComponent } from '../lib/checkout-component/checkout.component';
import { ProductInventoryPage } from '../../../../products/feature-inventory-page/lib/product-inventory-page.component';
import { TagStore } from '../../../../tags/data-access/store/tag.store';
import { ProductStore } from '../../../../products/data-access/lib/store/product.store';
import { CartStore } from '../../../../cart/data-access/lib/store/cart.store';
import { BarcodeScannerService } from '../../../../shared/data-access/services/barcode-scanner.service';
import { UIStore } from '../../../../shared/data-access/store/ui.store';
import { TranslateService } from '@ngx-translate/core';

@Component({
    selector: 'app-store-invetory-component',
    imports: [CheckoutComponent, ProductInventoryPage],
    templateUrl: './store-inventory.component.html',
})
export class StoreInventoryComponent implements OnInit, OnDestroy {
    store = inject(StoreStore);
    tag = inject(TagStore);
    product = inject(ProductStore);
    cart = inject(CartStore);
    scanner = inject(BarcodeScannerService);
    ui = inject(UIStore);
    translate = inject(TranslateService);

    private scanSub?: Subscription;

    constructor() {
        effect(() => {
            const submenu = this.store.selectedSubMenu();
            const storeId = this.store.selectedStore();
            
            if (storeId) {
                if (submenu === 'global-inventory') {
                    this.product.getGlobalProducts(null);
                } else if (submenu === 'products') {
                    this.product.getAllProducts({ storeId, keyword: null });
                }
            }
        });
    }

    ngOnInit() {
        this.tag.setContext('products');
        this.tag.loadTags();

        // Suscripción al escáner de códigos de barras
        this.scanSub = this.scanner.scan$.subscribe(barcode => {
            const submenu = this.store.selectedSubMenu();
            const foundProduct = this.product.filteredProducts().find(p => p.barcode === barcode);

            if (submenu === 'products') {
                // Modo Venta: hot-path en memoria, solo si existe en la tienda y hay stock.
                if (!foundProduct) {
                    this.ui.showToast(this.translate.instant('sales.scan.notFoundInStore'), 'error');
                } else if (foundProduct.currentQuantity > 0) {
                    this.cart.addToCart(foundProduct);
                    this.ui.showToast(this.translate.instant('sales.scan.addedToCart', { name: foundProduct.name }));
                } else {
                    this.ui.showToast(this.translate.instant('sales.scan.noStock'), 'error');
                }
            } else if (submenu === 'global-inventory') {
                // Modo Inventario Global: abre el modal/vista de vínculo producto-tienda.
                if (foundProduct) {
                    this.onProductSelect(foundProduct.id);
                } else {
                    this.ui.showToast(this.translate.instant('sales.scan.notFoundInStore'), 'error');
                }
            }
        });
    }

    ngOnDestroy() {
        if (this.scanSub) {
            this.scanSub.unsubscribe();
        }
    }

    buscarEnTienda(keyword: string) {
        const currentStoreId = this.store.selectedStore();
        const submenu = this.store.selectedSubMenu();

        if (currentStoreId) {
            if (submenu === 'global-inventory') {
                this.product.getGlobalProducts(keyword || null);
            } else {
                this.product.getAllProducts({ storeId: currentStoreId, keyword: keyword || null });
            }
        }
    }

    onProductSelect(productId: number) {
        const submenu = this.store.selectedSubMenu();
        
        // ✨ FIX: Reiniciamos el estado isSuccess a false ANTES de cambiar de vista
        // Esto evita que el formulario se auto-cierre inmediatamente tras abrirse.
        this.product.resetProductState();
        
        if (submenu === 'global-inventory') {
            const canCreate = this.store.hasPermission('MODULE_PRODUCTS', 'CREATE');
            if (canCreate || this.store.isOwnerUser()) {
                this.store.setSelectedProductId(productId);
                this.store.setView('assign-global-product'); 
            }
        } else {
            const canUpdate = this.store.hasPermission('MODULE_PRODUCTS', 'UPDATE');
            const canDelete = this.store.hasPermission('MODULE_PRODUCTS', 'DELETE');

            if (canUpdate || canDelete || this.store.isOwnerUser()) {
                this.store.setSelectedProductId(productId);
                this.store.setView('manage-store-product'); 
            }
        }
    }
}
