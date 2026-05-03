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
    }

];
