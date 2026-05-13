import { inject } from "@angular/core";
import { patchState, signalStore, withMethods, withState } from "@ngrx/signals";
import { StoreApiService } from "../services/store-api.service";
import { Router } from "@angular/router";
import { rxMethod } from "@ngrx/signals/rxjs-interop";
import { PageRequest } from "../../../../shared/data-access/models/sort.model";
import { StorePaginationResponse, StorePreview } from "../models/store.model";
import { catchError, EMPTY, pipe, switchMap, tap } from "rxjs";
import { HttpErrorResponse } from "@angular/common/http";
import { tapResponse } from "@ngrx/operators";


interface StoreState{
    isLoading: boolean,
    error: string | null,
    isSuccess: boolean,
    token: string | null,
    message: string | null,
    storesPage: StorePaginationResponse | null
}

const initialState : StoreState  = {
    isLoading: false,
    error: null,
    isSuccess: false,
    token: null,
    message: null,
    storesPage: null
};

export const StoreStore = signalStore(
    { providedIn: 'root' },
    withState(initialState),
    withMethods(
        (store, api  = inject(StoreApiService), router = inject(Router)) => ({

            getAllStores: rxMethod<PageRequest>(
                pipe(

                    tap(
                        () => patchState(store, {
                            isLoading:true,
                            error: null,
                            isSuccess: false
                    })),

                    switchMap((dto) => {
                       return api.getAllStores(dto.page, dto.size, dto.sort).pipe(

                        tapResponse({
                            next: (response) => {
                                console.log(response);
                                patchState (store, {
                                    isLoading:  false,
                                    isSuccess:  true,
                                    storesPage: response
                                });
                            },
                            error: (error: any) => {
                                patchState(store, {
                                    isLoading: false,
                                    isSuccess: false,
                                    error: error.message || 'Ocurrion un error al cargar las tiendas'
                                });
                            }
                        })
                        
                       )
                    }
                     
                    )

                )

            ),
            listenToStoreUpdates: rxMethod<void>(
                pipe(
                    switchMap(() => {
                        const currentToken = localStorage.getItem('pibblest_token');

                        if(!currentToken){
                            console.warn('No se puede conectar al sse ya que no hay token');
                            return EMPTY;
                        }


                        return api.listenToStoreStream(currentToken).pipe(
                            tap((storeUpdate) => {
                                if(!storeUpdate.id) return;
                                patchState(store, (state) => {
                                    if(!state.storesPage) return state;
                                    const updatedStores = state.storesPage.stores.map((tiendaActual) => 
                                        tiendaActual.id === storeUpdate.id ? {...tiendaActual, ...storeUpdate}: tiendaActual
                                    );
                                    
                                    return {
                                        storesPage: {
                                            ...state.storesPage,
                                            stores: updatedStores
                                        }
                                    }
                                })
                            })
                        )
                    })
                )

            )
        })

    )
);