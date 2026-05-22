import { Component, inject, input } from "@angular/core";
import { Product } from "../../../../data-access/lib/models/product.model";
import { StoreStore } from "../../../../../stores/data-access";
import { TranslatePipe } from "@ngx-translate/core";
import { SaleStore } from "../../../../../sales/data-access";
import { CartStore } from "../../../../../cart/data-access/lib/store/cart.store";

@Component({
    selector:'app-product-preview-component',
    imports:[TranslatePipe],
    templateUrl:'./product-preview.component.html'
})
export class ProductPreviewComponent{
    product  = input.required<Product>();
    store = inject(StoreStore);
    sale = inject(SaleStore);
    cart = inject(CartStore);

}