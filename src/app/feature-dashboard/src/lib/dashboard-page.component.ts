import { CommonModule } from "@angular/common";
import { Component, inject, signal, effect } from "@angular/core";
import { OwnerStore } from "../../../../libs/owners/data-access/src";
import { Router } from "@angular/router";
import { DashboardSideBarComponent } from "../../../ui/src";
import { StoreViewAllPage } from "../../../../libs/stores/feature-view-all/src";
import { DashboardStore } from "./data-access/store/dashboard.store";
import { TranslatePipe } from "@ngx-translate/core";
import { StoreCreateComponent } from "../../../../libs/stores/feature-create/src";
import { StorePage } from "../../../../libs/stores/feature-page";
import { StoreMainPage } from "../../../../libs/stores/feature-main/src/lib/store-main-page.component";
import { StoreStore } from "../../../../libs/stores/data-access";

@Component({
  selector: 'app-dashboard-owner-page',
  standalone: true,
  imports: [
    CommonModule,
    DashboardSideBarComponent,
    StoreViewAllPage,
    StoreCreateComponent,
    StorePage,
    StoreMainPage,
    TranslatePipe,
  ],
  templateUrl: './dashboard-page.component.html',
  styleUrl: './dashboard-page.component.css',
})
export class DashboardPageComponent {
  dashboardStore = inject(DashboardStore);
  storeStore = inject(StoreStore);
  readonly store = inject(OwnerStore);
  private router = inject(Router);

  onLogout() {
    this.store.logout();
    this.router.navigate(['/login']);
  }

  setStores(){
    this.storeStore.setView('view-all');
  }
}