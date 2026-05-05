import { authGuard } from '../libs/auth/data-access/auth.guard';
import { loginRoutes } from './../libs/owners/feature-login/src/lib.routes';
import { Route } from '@angular/router';

export const appRoutes: Route[] = [

    {
        path:'register-owner',
        loadChildren: () => 
            import('@pibblest-front-web/owners/feature-registration').then(
                (m) => m.registrationRoutes
            )
    },
    {
        path:'login',
        loadChildren: () => 
            import('@pibblest-front-web/owners/feature-login')
        .then((m) => m.loginRoutes)
    },
    {
        path:'verify',
        loadChildren: () => import('@pibblest-front-web/owners/feature-verify').then(m => m.verifyRoutes),
    },
    {
        path:'dashboard',
        canActivate: [authGuard],
        loadChildren: () => import('@pibblest-fornt-web/owners/dashboard').then(m => m.dashboardRoutes)
    },
    {
        path:'',
        redirectTo: 'login',
        pathMatch: 'full'
    }

];
