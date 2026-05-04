import { CommonModule } from "@angular/common";
import { Component, inject } from "@angular/core";
import { OwnerStore } from "../../../../libs/owners/data-access/src";
import { Router } from "@angular/router";

@Component({
    selector: 'app-dashboard-owner-page',
    standalone:true,
    imports: [CommonModule],
    templateUrl: './dashboard-page.component.html'
})
export class DashboardPageComponent {
    readonly store = inject(OwnerStore);
    private router = inject(Router);

    onLogout(){
        this.store.logout();
        this.router.navigate(['/login']);
    }

}