import { Component, inject, OnInit } from "@angular/core";
import { TagStore } from "../../../tags/data-access/store/tag.store";
import { ProductStore } from "../../data-access/lib/store/product.store";

@Component({
    selector:'app-product-admin-inventory-page',
    imports:[],
    templateUrl:'./product-admin-inventory-page.component.html'
})
export class ProductAdminInvertoryPage implements OnInit{
    tag = inject(TagStore);
    product = inject(ProductStore);

    ngOnInit(){
        //llamar al endpoint de busqueda
    }

    searchAsAdmin(keword: stirng){
        //busqueda de admin
    }
    
}