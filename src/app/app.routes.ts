import { Route } from '@angular/router';

export const appRoutes: Route[] = [

    {
        path:'register-owner',
        loadChildren: () => 
            import('@pibblest-front-web/owners/feature-registration').then(
                (m) => m.registrationRoutes
            )
    }

];
