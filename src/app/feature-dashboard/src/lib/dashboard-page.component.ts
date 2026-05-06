import { CommonModule } from "@angular/common";
import { Component, inject, signal } from "@angular/core";
import { OwnerStore } from "../../../../libs/owners/data-access/src";
import { Router } from "@angular/router";
import { DashboardSideBarComponent } from "../../../ui/src";
import { StoreViewAllPage } from "../../../../libs/stores/feature-view-all/src";

@Component({
    selector: 'app-dashboard-owner-page',
    standalone:true,
    imports: [CommonModule, DashboardSideBarComponent, StoreViewAllPage],
    templateUrl: './dashboard-page.component.html'
})
export class DashboardPageComponent {
    readonly store = inject(OwnerStore);
    private router = inject(Router);

    currentView = signal('overview');

    changeView(view: string){

        this.currentView.set(view);
    }
    onLogout(){
        this.store.logout();
        this.router.navigate(['/login']);
    }

}