import { authGuard } from '../libs/auth/data-access/auth.guard';
import { loginRoutes } from './../libs/owners/feature-login/src/lib.routes';
import { Route } from '@angular/router';
import { ownerOnlyGuard } from './core/guards/owner-only.guard';

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
        path: 'auth/activate-account',
        loadComponent: () => import('./auth/feature-activate/activate-account.component').then(m => m.ActivateAccountComponent)
    },
    {
        path: 'employees',
        loadComponent: () => import('../libs/employees/feature-shell/src/lib/employee-shell.component').then(m => m.EmployeeShellComponent),
        canActivate: [ownerOnlyGuard]
    },
    {
        path:'dashboard',
      //  canActivate: [authGuard],
        loadChildren: () => import('@pibblest-fornt-web/owners/dashboard').then(m => m.dashboardRoutes)
    },
    {
        path:'',
        redirectTo: 'login',
        pathMatch: 'full'
    }

];
