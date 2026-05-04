import { Route } from "@angular/router";
import { DashboardPageComponent } from "./lib/dashboard-page.component";

export const dashboardRoutes: Route[] = [
    {
        path: '',
        component: DashboardPageComponent
    }
]