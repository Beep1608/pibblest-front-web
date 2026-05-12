import { CommonModule } from "@angular/common";
import { Component, inject, signal } from "@angular/core";
import { TranslatePipe } from "@ngx-translate/core";
import { StorePreview } from "../../../../data-access/lib/models/store.model";
import { StoreStore } from "../../../../data-access/lib/store/store.store";
import { StorePreviewComponent } from "../../../../ui/src/store-component/store-preview.component";


@Component({
  selector: 'app-store-view-all-page',
  imports: [CommonModule, TranslatePipe, StorePreviewComponent],
  templateUrl: './viewAll.component.html',
})
export class StoreViewAllPage {

  store = inject(StoreStore);

  ngOnInit(){
    this.store.getAllStores({page:0, size:10, sort:'id,desc'});
  }
}