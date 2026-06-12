// src/libs/stores/feature-view-all/src/lib/viewAll/viewAll.component.ts
import { CommonModule } from "@angular/common";
import { Component, inject, OnInit, signal } from "@angular/core";
import { TranslatePipe } from "@ngx-translate/core";
import { StoreStore } from "../../../../data-access/lib/store/store.store";
import { StorePreviewComponent } from "../../../../ui/src/store-component/store-preview.component";
import { StoreTableComponent } from "../../../../ui/src/lib/store-table/store-table.component";
import { TagStore } from "../../../../../tags/data-access/store/tag.store";
import { TagButtonsComponent } from "../../../../../tags/ui/src/lib/tags-buttons.component/tags-buttons.component";

@Component({
  selector: 'app-store-view-all-page',
  standalone: true,
  imports: [CommonModule, TranslatePipe, StorePreviewComponent, StoreTableComponent, TagButtonsComponent],
  templateUrl: './viewAll.component.html',
})
export class StoreViewAllPage implements OnInit {
  store = inject(StoreStore);
  tagStore = inject(TagStore);

  // ✨ Nueva señal para restringir acceso
  isOwner = signal(false);

  ngOnInit() {
    this.checkUserRole();
    this.store.resetAlerts();
    this.store.loadStores();
    this.store.listenToStoreUpdates();

    // ✨ Configuración inicial de los tags para las tiendas
    this.tagStore.setContext('stores');
    this.tagStore.loadAllStoreTagsList();
  }

  checkUserRole() {
    const token = localStorage.getItem('pibblest_token');
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        this.isOwner.set(payload.role === 'OWNER' || payload.isOwner === true);
      } catch (e) {
        this.isOwner.set(false);
      }
    }
  }

  onSearch(keyword: string) {
    this.store.searchStores(keyword);
  }

  changePage(delta: number) {
    this.store.changePage(delta);
  }
}