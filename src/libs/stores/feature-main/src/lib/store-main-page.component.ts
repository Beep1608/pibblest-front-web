// src/libs/stores/feature-main/src/lib/store-main-page.component.ts
import { Component, inject } from "@angular/core";
import { StoreStore } from "../../../data-access";
import { StoreViewAllPage } from "../../../feature-view-all/src";
import { StorePage } from "../../../feature-page";
import { StoreCreateComponent } from "../../../feature-create/src/lib/store-create.component";
import { StoreEditComponent } from "../../../feature-edit/src/lib/store-edit.component";

@Component({
  selector: 'app-store-main-page',
  standalone: true,
  imports: [StoreViewAllPage, StorePage, StoreCreateComponent, StoreEditComponent],
  templateUrl: './store-main-page.component.html'
})
export class StoreMainPage {
  store = inject(StoreStore);
}