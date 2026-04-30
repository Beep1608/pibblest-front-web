import { inject } from "@angular/core";
import { patchState, signalStore, withMethods, withState } from "@ngrx/signals";
import { OwnerApiService } from "../services/owner-api.service";
import { rxMethod } from "@ngrx/signals/rxjs-interop";
import { RegisterOwnerDto } from "../models/owner.model";
import { catchError, of, pipe, switchMap, tap } from "rxjs";
import { HttpErrorResponse } from "@angular/common/http";

interface OwnerState{
    isLoading: boolean;
    error: string | null;
    isSuccess: boolean;
}

const initialState: OwnerState = {
    isLoading: false,
    error: null,
    isSuccess: false,
}

export const OwnerStore = signalStore(
   {providedIn: "root"},
    withState(initialState),
    withMethods(    (store, api = inject(OwnerApiService)) => ({

        registerOwner: rxMethod<RegisterOwnerDto>(
            pipe(
                tap(() => patchState(store, {isLoading: true, error: null, isSuccess: false})),
                switchMap((dto) => 
                    api.register(dto).pipe(
                        tap(() => patchState(store, {isLoading: false, isSuccess: true})),
                        catchError((err: HttpErrorResponse) => {
                            patchState(store, {isLoading:false, error: err.message});
                            return of(null);
                        })
                    )
                )
            )
        )
    }))
    
);