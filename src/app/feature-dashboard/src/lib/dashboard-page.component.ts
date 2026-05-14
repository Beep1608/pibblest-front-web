import { CommonModule } from "@angular/common";
import { Component, inject, signal } from "@angular/core";
import { OwnerStore } from "../../../../libs/owners/data-access/src";
import { Router } from "@angular/router";
import { DashboardSideBarComponent } from "../../../ui/src";
import { StoreViewAllPage } from "../../../../libs/stores/feature-view-all/src";
import { DashboardStore } from "./data-access/store/dashboard.store";
import { CreateStorePage } from "../../../../libs/stores/feature-create-store/src/lib/create-store-page.component";
import { TranslatePipe } from "@ngx-translate/core";

@Component({
    selector: 'app-dashboard-owner-page',
    standalone:true,
    imports: [CommonModule, DashboardSideBarComponent, StoreViewAllPage, CreateStorePage, TranslatePipe],
    templateUrl: './dashboard-page.component.html',
    styleUrl:'./dashboard-page.component.css'
})
export class DashboardPageComponent {
    dashboardStore = inject(DashboardStore);
    readonly store = inject(OwnerStore);
    private router = inject(Router);


    onLogout(){
        this.store.logout();
        this.router.navigate(['/login']);
    }

}