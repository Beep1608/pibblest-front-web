// src/app/feature-dashboard/src/lib/dashboard-page.component.ts
import { CommonModule } from "@angular/common";
import { Component, inject, signal, OnInit } from "@angular/core";
import { OwnerStore } from "../../../../libs/owners/data-access/src";
import { Router } from "@angular/router";
import { DashboardStore } from "./data-access/store/dashboard.store";
import { TranslatePipe } from "@ngx-translate/core";
import { StoreMainPage } from "../../../../libs/stores/feature-main/src/lib/store-main-page.component";
import { ProductsShellComponent } from "../../../../libs/products/feature-shell";
import { TagsShellComponent } from "../../../../libs/tags/feature-shell/src/lib/tags-shell.component";
import { EmployeeShellComponent } from "../../../../libs/employees/feature-shell/src/lib/employee-shell.component";
import { StoreStore } from "../../../../libs/stores/data-access/lib/store/store.store";
import { BarcodeScannerService } from "../../../../libs/shared/data-access/services/barcode-scanner.service";

import { OverviewContainerComponent } from './overview/overview-container.component';

@Component({
  selector: 'app-dashboard-owner-page',
  standalone: true,
  imports: [
    CommonModule,
    StoreMainPage,
    TranslatePipe,
    ProductsShellComponent,
    TagsShellComponent,
    EmployeeShellComponent,
    OverviewContainerComponent
  ],
  templateUrl: './dashboard-page.component.html',
  styleUrl: './dashboard-page.component.css',
})
export class DashboardPageComponent implements OnInit {
  dashboardStore = inject(DashboardStore);
  readonly store = inject(OwnerStore);
  storeStore = inject(StoreStore); // Inyectamos el Store maestro de tiendas
  readonly scanner = inject(BarcodeScannerService);
  private router = inject(Router);

  // ✨ Signal para controlar el estado colapsado/expandido en Desktop
  isSidebarExpanded = signal(true); 

  // ✨ NUEVA SEÑAL PARA PROTEGER LA UI
  isOwnerUser = signal(false);

  ngOnInit() {
    this.checkUserRole();
    
    // ✨ DISPARADOR DE FLUSHING: Obliga al Store a leer el token nuevo,
    // limpiar la caché y redirigir a 'view-all' de manera instantánea.
    this.storeStore.loadStores(); 

    if (!this.isOwnerUser()) {
       this.dashboardStore.setView('stores');
    }
  }

  // Decodificación segura y en tiempo de ejecución del JWT
  checkUserRole() {
    const token = localStorage.getItem('pibblest_token');
    if (token) {
      try {
        const payloadBase64 = token.split('.')[1];
        const payloadJson = JSON.parse(atob(payloadBase64));
        this.isOwnerUser.set(payloadJson.isOwner === true || payloadJson.role === 'OWNER');
      } catch (e) {
        this.isOwnerUser.set(false);
      }
    }
  }

  toggleSidebar() {
    this.isSidebarExpanded.update(v => !v);
  }

  toggleScanner() {
    this.scanner.toggle();
  }

  expandSidebar() {
    this.isSidebarExpanded.set(true);
  }

  onLogout() {
    this.store.logout();
    this.router.navigate(['/login']);
  }
}