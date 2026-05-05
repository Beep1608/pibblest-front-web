import { HttpErrorResponse, HttpInterceptorFn } from "@angular/common/http";
import { inject } from "@angular/core";
import { Router } from "@angular/router";
import { catchError, throwError } from "rxjs";

export const authInterceptor: HttpInterceptorFn = (req, next) => {
    const router = inject(Router);
    const token = localStorage.getItem('pibblest_token');
    let authReq = req;
    if(token){
        authReq = req.clone({
            setHeaders: {
                Authorization: `Bearer ${token}`
            }
        });
    }

    return next(authReq).pipe(

        catchError((error: HttpErrorResponse) => {
            if(error.status === 401 || error.status === 403){
                console.warn('Acceso denegado o sesión expirada. Redirigiendo al login');
                localStorage.removeItem('pibblest_token');
                router.navigate(['login']);
            }

            return throwError(() => error);
        })

    )
}