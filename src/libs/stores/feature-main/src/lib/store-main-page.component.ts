import { Component, inject } from "@angular/core";
import { StoreStore } from "../../../data-access";
import { StoreViewAllPage } from "../../../feature-view-all/src";
import { StorePage } from "../../../feature-page";

@Component({
    selector:'app-store-main-page',
    imports:[StoreViewAllPage,StorePage],
    templateUrl: './store-main-page.component.html'
})
export class StoreMainPage{
    store = inject(StoreStore);
}