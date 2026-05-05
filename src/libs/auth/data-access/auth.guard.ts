import { inject } from "@angular/core";
import { CanActivateFn, Router } from "@angular/router";


const isTokenExpired = (token: string): boolean => {
    try{
        const payloadBase64 = token.split('.')[1];

        const payloadJson = JSON.parse(atob(payloadBase64));

        const expirationDate = payloadJson.exp *  1000;

        return Date.now() > expirationDate;
    } catch( error ){

        return true;
    }
}

export const authGuard: CanActivateFn = () => {
    const router = inject(Router);
    const token = localStorage.getItem('pibblest_token');

    if(token && !isTokenExpired(token)){
        return true;

    }else{
        localStorage.removeItem('pibblest_token');
        router.navigate(['/login']);
        return false;
    }
}