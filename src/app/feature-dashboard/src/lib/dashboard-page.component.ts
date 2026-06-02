import { CommonModule } from "@angular/common";
import { Component, inject, signal, effect } from "@angular/core";
import { OwnerStore } from "../../../../libs/owners/data-access/src";
import { Router } from "@angular/router";
import { StoreViewAllPage } from "../../../../libs/stores/feature-view-all/src";
import { DashboardStore } from "./data-access/store/dashboard.store";
import { TranslatePipe } from "@ngx-translate/core";
import { StoreCreateComponent } from "../../../../libs/stores/feature-create/src";
import { StorePage } from "../../../../libs/stores/feature-page";
import { StoreMainPage } from "../../../../libs/stores/feature-main/src/lib/store-main-page.component";
import { StoreStore } from "../../../../libs/stores/data-access";
import { ProductInventoryPage } from "../../../../libs/products/feature-inventory-page/lib/product-inventory-page.component";
import { ProductAdminInventoryPage } from "../../../../libs/products/feature-admin-inventory-page/lib/product-admin-inventory-page.component";
import { ProductsShellComponent } from "../../../../libs/products/feature-shell";

@Component({
  selector: 'app-dashboard-owner-page',
  standalone: true,
  imports: [
    CommonModule,
    StoreViewAllPage,
    StoreCreateComponent,
    StorePage,
    StoreMainPage,
    TranslatePipe,
    ProductInventoryPage,
    ProductsShellComponent
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



}