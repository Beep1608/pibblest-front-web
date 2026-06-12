import { Component, ElementRef, inject, input, viewChild, output } from "@angular/core";
import { Product } from "../../../../data-access/lib/models/product.model";
import { TranslatePipe } from "@ngx-translate/core";
import { SaleStore } from "../../../../../sales/data-access";
import { CartStore } from "../../../../../cart/data-access/lib/store/cart.store";
import { ProductStore } from "../../../../data-access/lib/store/product.store";

@Component({
    selector:'app-product-table-component',
    imports:[TranslatePipe],
    templateUrl:'./product-table.component.html'
})
export class ProductTableComponent {
    products = input.required<Product[]>();
    viewMode = input<'admin' | 'employee'>('employee'); 
    isGlobal = input<boolean>(false);
    
    productSelect = output<number>(); // ✨ Exponer evento de selección de fila/producto
    
    sale = inject(SaleStore);
    cart = inject(CartStore);
    productStore = inject(ProductStore);

    deleteModalTable = viewChild<ElementRef<HTMLDialogElement>>('deleteModalTable');
    selectedProductForDelete: Product | null = null;

    goToEdit(id: number) {
        this.productStore.setSelectedProductId(id);
        this.productStore.setProductView('info');
    }

    openDeleteModal(product: Product) {
        this.selectedProductForDelete = product;
        this.deleteModalTable()?.nativeElement.showModal();
    }

    closeDeleteModal() {
        this.selectedProductForDelete = null;
        this.deleteModalTable()?.nativeElement.close();
    }

    confirmDelete() {
        if(this.selectedProductForDelete) {
            this.productStore.deleteProduct(this.selectedProductForDelete.id);
        }
        this.closeDeleteModal();
    }
}
