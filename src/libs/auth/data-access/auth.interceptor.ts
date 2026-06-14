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
            // 401 = sesión inválida/expirada -> cerrar sesión y redirigir al login.
            // 403 = autenticado pero sin permisos -> NO redirigir; propagar el error
            // para que la capa que hizo la petición muestre el mensaje (toast).
            if(error.status === 401){
                console.warn('Sesión expirada o inválida. Redirigiendo al login');
                localStorage.removeItem('pibblest_token');
                router.navigate(['login']);
            }

            return throwError(() => error);
        })

    )
}