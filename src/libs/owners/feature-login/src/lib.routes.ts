import { Route } from "@angular/router";
import { LoginPageComponent } from "./lib/login-page/login-page.component";


export const loginRoutes : Route[] = [
    {
        path: '',
        component: LoginPageComponent
    }
]