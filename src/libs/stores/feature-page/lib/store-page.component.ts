import { DecimalPipe } from "@angular/common";
import { Component, computed, inject, input, signal } from "@angular/core";
import { TranslatePipe } from "@ngx-translate/core";
import { StoreInventoryComponent } from "../../ui/src/store-inventory/store-inventory.component";
import { StoreStore } from "../../data-access";



@Component({
  selector: 'app-store-page',
  imports: [TranslatePipe, DecimalPipe, StoreInventoryComponent
  ],
  templateUrl: './store-page.component.html',
})
export class StorePage {

  store = inject(StoreStore);




}