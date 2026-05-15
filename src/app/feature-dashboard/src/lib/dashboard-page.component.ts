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

@Component({
  selector: 'app-dashboard-owner-page',
  standalone: true,
  imports: [
    CommonModule,
    DashboardSideBarComponent,
    StoreViewAllPage,
    StoreCreateComponent,
    StorePage,
    TranslatePipe,
  ],
  templateUrl: './dashboard-page.component.html',
  styleUrl: './dashboard-page.component.css',
})
export class DashboardPageComponent {
  dashboardStore = inject(DashboardStore);
  readonly store = inject(OwnerStore);
  private router = inject(Router);

  onLogout() {
    this.store.logout();
    this.router.navigate(['/login']);
  }
}