import { inject } from '@angular/core';
import { patchState, signalStore, withMethods, withState } from '@ngrx/signals';
import { OwnerApiService } from '../services/owner-api.service';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { LoginOwnerDto, RegisterOwnerDto } from '../models/owner.model';
import { catchError, of, pipe, switchMap, tap } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';

interface OwnerState {
  isLoading: boolean;
  error: string | null;
  isSuccess: boolean;
  token: string | null;
  message: string | null;
}

const initialState: OwnerState = {
  isLoading: false,
  error: null,
  isSuccess: false,
  token: null,
  message: null,
};

export const OwnerStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withMethods(
    (store, api = inject(OwnerApiService), router = inject(Router)) => ({
      registerOwner: rxMethod<RegisterOwnerDto>(
        pipe(
          tap(() =>
            patchState(store, {
              isLoading: true,
              error: null,
              isSuccess: false,
            }),
          ),
          switchMap((dto) =>
            api.register(dto).pipe(
              tap((response) => {
                
                patchState(store, { isLoading: false, isSuccess: true , token: response.token});
                localStorage.setItem('pibblest_token', response.token);
                router.navigate(['/dashboard']);
              }),
              catchError((err: HttpErrorResponse) => {
                patchState(store, { isLoading: false, error: err.error.error, message: err.error.message });
                return of(null);
              }),
            ),
          ),
        ),
      ),
      login: rxMethod<LoginOwnerDto>(
        pipe(
          tap(() =>
            patchState(store, {
              isLoading: true,
              error: null,
              isSuccess: false,
            }),
          ),
          switchMap((credentials) =>
            api.login(credentials).pipe(
              tap((response) => {
                patchState(store, {
                  isLoading: false,
                  isSuccess: true,
                  token: response.token,
                });
                localStorage.setItem('pibblest_token', response.token);
                router.navigate(['/dashboard']);
              }),
              catchError((err: HttpErrorResponse) => {
                patchState(store, {
                  isLoading: false,
                  error: err.error.error,
                });
                return of(null);
              }),
            ),
          ),
        ),
      ),
      logout() {
        patchState(store, { token: null, isSuccess: false });
        localStorage.removeItem('pibblest_token');
      },
      verifyAccount: rxMethod<string>(
        pipe(
          tap(() =>
            patchState(store, {
              isLoading: true,
              error: null,
              isSuccess: false,
            }),
          ),
          switchMap((token) =>
            api.verifyEmail(token).pipe(
              tap(() => {
                patchState(store, { isLoading: false, isSuccess: true });
              }),
              catchError((err: HttpErrorResponse) => {
                const errorTitle =
                  err.error?.error ||
                  'El enlace de verificación es invalido o ha caducado.';
                const errorMessage =
                  err.error?.message ||
                  'El enlace debio haber caducado o es invalido';
                patchState(store, {
                  isLoading: false,
                  error: errorTitle,
                  message: errorMessage,
                });
                return of(null);
              }),
            ),
          ),
        ),
      ),

      clearEmailError(){
        patchState(store, {error:null, message:null});
      },

      setError(errorMessage: string) {
        patchState(store, { error: errorMessage, isLoading: false });
      },
    }),
  ),
);
