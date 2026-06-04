// src/libs/stores/feature-view-all/src/lib/viewAll/viewAll.component.ts
import { CommonModule } from "@angular/common";
import { Component, inject, OnInit } from "@angular/core";
import { TranslatePipe } from "@ngx-translate/core";
import { StoreStore } from "../../../../data-access/lib/store/store.store";
import { StorePreviewComponent } from "../../../../ui/src/store-component/store-preview.component";
import { StoreTableComponent } from "../../../../ui/src/lib/store-table/store-table.component";

@Component({
  selector: 'app-store-view-all-page',
  standalone: true,
  imports: [CommonModule, TranslatePipe, StorePreviewComponent, StoreTableComponent],
  templateUrl: './viewAll.component.html',
})
export class StoreViewAllPage implements OnInit {
  store = inject(StoreStore);

  ngOnInit() {
    this.store.resetAlerts();
    // 1. Forzamos la carga inicial (Internamente enviará keyword="")
    this.store.loadStores();
    this.store.listenToStoreUpdates();
  }

  onSearch(keyword: string) {
    // 2. Delegamos la lógica directamente al Store
    this.store.searchStores(keyword);
  }

  changePage(delta: number) {
    this.store.changePage(delta);
  }
}