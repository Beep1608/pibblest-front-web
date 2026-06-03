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
    this.store.setPage(0);
    this.fetchData();
    this.store.listenToStoreUpdates();
  }

  onSearch(keyword: string) {
    const cleanKeyword = keyword.trim();
    this.store.setSearchKeyword(cleanKeyword);
    this.fetchData();
  }

  changePage(delta: number) {
    const currentPage = this.store.currentPage();
    this.store.setPage(currentPage + delta);
    this.fetchData();
  }

  private fetchData() {
    if (this.store.currentKeyword()) {
      this.store.searchStores();
    } else {
      this.store.getAllStores();
    }
  }
}