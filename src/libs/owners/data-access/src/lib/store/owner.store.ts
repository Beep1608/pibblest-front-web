// src/libs/owners/data-access/src/lib/store/owner.store.ts
import { inject } from '@angular/core';
import { patchState, signalStore, withMethods, withState } from '@ngrx/signals';
import { OwnerApiService } from '../services/owner-api.service';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { LoginCredentialsDto, RegisterOwnerDto } from '../models/owner.model';
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
              message: null
            }),
          ),
          switchMap((dto) =>
            api.register(dto).pipe(
              tap(() => {
                // Se elimina el almacenamiento del token y la redirección. 
                // Solo activamos el estado de éxito para que la UI muestre el mensaje.
                patchState(store, { isLoading: false, isSuccess: true });
              }),
              catchError((err: HttpErrorResponse) => {
                patchState(store, { 
                    isLoading: false, 
                    error: err.error?.error || 'Error al registrar', 
                    message: err.error?.message || 'No se pudo completar el registro' 
                });
                return of(null);
              }),
            ),
          ),
        ),
      ),
      login: rxMethod<LoginCredentialsDto>(
        pipe(
          tap(() =>
            patchState(store, {
              isLoading: true,
              error: null,
              isSuccess: false,
              message: null
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
                  error: err.error?.error || 'Error de autenticación',
                  message: err.error?.message || 'Verifica tus credenciales'
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
              message: null
            }),
          ),
          switchMap((token) =>
            api.verifyEmail(token).pipe(
              tap(() => {
                patchState(store, { isLoading: false, isSuccess: true });
              }),
              catchError((err: HttpErrorResponse) => {
                patchState(store, {
                  isLoading: false,
                  error: err.error?.error || 'Enlace inválido',
                  message: err.error?.message || 'El enlace de verificación ha expirado o es incorrecto.',
                });
                return of(null);
              }),
            ),
          ),
        ),
      ),
      clearEmailError() {
        patchState(store, { error: null, message: null });
      },
      setError(errorMessage: string) {
        patchState(store, { error: errorMessage, isLoading: false });
      },
    }),
  ),
);
