import { Component, inject, OnInit } from "@angular/core";
import { TagStore } from "../../../tags/data-access/store/tag.store";
import { ProductStore } from "../../data-access/lib/store/product.store";
import { ProductInventoryPage } from "../../feature-inventory-page/lib/product-inventory-page.component";

@Component({
    selector:'app-product-admin-inventory-page',
    imports: [ProductAdminInvertoryPage, ProductInventoryPage],
    templateUrl:'./product-admin-inventory-page.component.html'
})
export class ProductAdminInvertoryPage implements OnInit{
    tag = inject(TagStore);
    product = inject(ProductStore);

    ngOnInit(){
       this.product.getAllProducts(null);
    }

    searchAsAdmin(keword: string){
        this.product.getAllProducts(keword);
    }
    
}