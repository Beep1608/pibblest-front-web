// src/app/feature-dashboard/src/lib/dashboard-page.component.ts
import { CommonModule } from "@angular/common";
import { Component, inject, signal } from "@angular/core";
import { OwnerStore } from "../../../../libs/owners/data-access/src";
import { Router } from "@angular/router";
import { DashboardStore } from "./data-access/store/dashboard.store";
import { TranslatePipe } from "@ngx-translate/core";
import { StoreMainPage } from "../../../../libs/stores/feature-main/src/lib/store-main-page.component";
import { ProductsShellComponent } from "../../../../libs/products/feature-shell";
import { TagsShellComponent } from "../../../../libs/tags/feature-shell/src/lib/tags-shell.component";

@Component({
  selector: 'app-dashboard-owner-page',
  standalone: true,
  imports: [
    CommonModule,
    StoreMainPage,
    TranslatePipe,
    ProductsShellComponent,
    TagsShellComponent
  ],
  templateUrl: './dashboard-page.component.html',
  styleUrl: './dashboard-page.component.css',
})
export class DashboardPageComponent {
  dashboardStore = inject(DashboardStore);
  readonly store = inject(OwnerStore);
  private router = inject(Router);

  // ✨ Signal para controlar el estado colapsado/expandido en Desktop
  isSidebarExpanded = signal(true); 

  toggleSidebar() {
    this.isSidebarExpanded.update(v => !v);
  }

  expandSidebar() {
    this.isSidebarExpanded.set(true);
  }

  onLogout() {
    this.store.logout();
    this.router.navigate(['/login']);
  }
}