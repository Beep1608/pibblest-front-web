import { CommonModule } from "@angular/common";
import { Component, inject, signal } from "@angular/core";
import { TranslatePipe } from "@ngx-translate/core";
import { StoreStore } from "../../../../data-access/lib/store/store.store";
import { StorePreviewComponent } from "../../../../ui/src/store-component/store-preview.component";
import { DashboardStore } from "../../../../../../app/feature-dashboard/src/lib/data-access/store/dashboard.store";


@Component({
  selector: 'app-store-view-all-page',
  imports: [CommonModule, TranslatePipe, StorePreviewComponent],
  templateUrl: './viewAll.component.html',
})
export class StoreViewAllPage {

  dashboardStore = inject(DashboardStore);
  store = inject(StoreStore);

  ngOnInit(){
    this.store.getAllStores({page:0, size:10, sort:'id,desc'});

    this.store.listenToStoreUpdates();
  }
}