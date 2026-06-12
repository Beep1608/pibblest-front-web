// src/libs/stores/data-access/lib/store/store.store.ts
import { HttpErrorResponse } from '@angular/common/http';
import { computed, inject } from '@angular/core';
import { Router } from '@angular/router';
import { tapResponse } from '@ngrx/operators';
import { patchState, signalStore, withComputed, withMethods, withState } from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { EMPTY, pipe, switchMap, tap, distinctUntilChanged } from 'rxjs';
import { DashboardStore } from '../../../../../app/feature-dashboard/src/lib/data-access/store/dashboard.store';
import { UIStore } from '../../../../shared/data-access/store/ui.store';
import { CreateStoreDto, StorePaginationResponse, StorePreview, UpdateStoreRequest } from '../models/store.model';
import { StoreApiService } from '../services/store-api.service';

export type StoreSubmenu = 'products' | 'sale' | 'sale-history' | 'global-inventory';
export type StoreView = 'view-all' | 'create-store' | 'store-page' | 'product-info' | 'sale-info' | 'edit-store' | 'manage-store-product' | 'assign-global-product' | null;
export type DisplayMode = 'grid' | 'table';

interface StoreState {
    isLoading: boolean;
    isSubmitting: boolean;
    error: string | null;
    isSuccess: boolean;
    token: string | null;
    message: string | null;
    selectedStore: number | null;
    selectedStoreDetails: StorePreview | null;
    selectedProductId: number | null;
    selectedSubMenu: StoreSubmenu;
    selectedView: StoreView;
    storesPage: StorePaginationResponse | null;
    displayMode: DisplayMode;
    currentPage: number;
    pageSize: number;
    currentKeyword: string;
    activeTagIds: number[];
}

const initialState: StoreState = {
    isLoading: false,
    isSubmitting: false,
    error: null,
    isSuccess: false,
    token: null,
    message: null,
    selectedStore: null,
    selectedStoreDetails: null,
    selectedProductId: null,
    selectedSubMenu: 'sale',
    selectedView: 'view-all',
    storesPage: null,
    displayMode: 'grid',
    currentPage: 0,
    pageSize: 10,
    currentKeyword: '',
    activeTagIds: []
};

export const StoreStore = signalStore(
    { providedIn: 'root' },
    withState(initialState),
    withComputed(({ token, storesPage, activeTagIds }) => ({
        isOwnerUser: computed(() => {
            const jwt = token();
            if (!jwt) return false;
            try {
                const payload = JSON.parse(atob(jwt.split('.')[1]));
                return payload.role === 'OWNER' || payload.isOwner === true;
            } catch {
                return false;
            }
        }),

        userAuthorities: computed(() => {
            const jwt = token();
            if (!jwt) return [];
            try {
                const payload = JSON.parse(atob(jwt.split('.')[1]));
                // ✨ FIX BUG 4: Mapeamos 'permissions' del payload JWT (coincidiendo con tu backend)
                const rawPerms = payload.permissions || payload.authorities || [];
                if (Array.isArray(rawPerms)) return rawPerms as string[];
                if (typeof rawPerms === 'string') return rawPerms.split(',');
                return [];
            } catch {
                return [];
            }
        }),

        filteredStores: computed(() => {
            const allStores = storesPage()?.stores || [];
            const selectedTags = activeTagIds();
            if (selectedTags.length === 0) return allStores;
            return allStores.filter(store => store.tags?.some(tag => selectedTags.includes(tag.id)));
        }),
    })),
    withMethods((
        store,
        api = inject(StoreApiService),
        router = inject(Router),
        dashboardStore = inject(DashboardStore),
        ui = inject(UIStore),
    ) => {

        const hasPermission = (moduleCode: string, action?: 'CREATE' | 'READ' | 'UPDATE' | 'DELETE'): boolean => {
            if (store.isOwnerUser()) return true;
            const storeId = store.selectedStore();
            if (!storeId) return false;
            
            if (action) {
                return store.userAuthorities().includes(`STORE_${storeId}_${moduleCode}_${action}`);
            }
            return store.userAuthorities().some((auth: string) => auth.includes(`STORE_${storeId}_${moduleCode}`));
        };

        const performFetch = rxMethod<{ kw: string, p: number, force?: boolean }>(
            pipe(
                distinctUntilChanged((prev, curr) => curr.force ? false : (prev.kw === curr.kw && prev.p === curr.p)),
                tap(() => patchState(store, { isLoading: true, error: null, isSuccess: false })),
                switchMap(({ kw, p }) => {
                    const fetchObservable = store.isOwnerUser() 
                        ? api.getStores(kw, p, store.pageSize(), 'id,desc')
                        : api.getMyStores(kw, p, store.pageSize(), 'id,desc');

                    return fetchObservable.pipe(
                        tapResponse({
                            next: response => patchState(store, { isLoading: false, isSuccess: true, storesPage: response }),
                            error: (error: HttpErrorResponse) => patchState(store, { isLoading: false, isSuccess: false, error: error.message || 'Error al cargar tiendas' }),
                        })
                    );
                })
            )
        );

        return {
            hasPermission,
            resetAlerts() { patchState(store, { isSuccess: false, error: null, message: null, isSubmitting: false }); },
            setSubmenu(submenu: StoreSubmenu) { patchState(store, { selectedSubMenu: submenu }); },
            setView(view: StoreView) { patchState(store, { selectedView: view, isSuccess: false, error: null, message: null }); },
            setDisplayMode(mode: DisplayMode) { patchState(store, { displayMode: mode }); },
            setSelectedStore(storeId: number | null) { patchState(store, { selectedStore: storeId }); },
            setSelectedStoreDetails(details: StorePreview | null) { patchState(store, { selectedStoreDetails: details }); },
            setSelectedProductId(productId: number | null) { patchState(store, { selectedProductId: productId }); },
            setPage(page: number) { patchState(store, { currentPage: page }); },
            setPageSize(size: number) { patchState(store, { pageSize: size, currentPage: 0 }); },
            setSearchKeyword(keyword: string) { patchState(store, { currentKeyword: keyword, currentPage: 0 }); },
            setActiveTags(tagIds: number[]) { patchState(store, { activeTagIds: tagIds }); },
            
            // ✨ FIX BUG 1, 2 y 3: Reseteo y Flushing absoluto del estado global al cambiar de sesión
            loadStores() { 
                const currentToken = localStorage.getItem('pibblest_token');
                patchState(store, { 
                    token: currentToken,
                    storesPage: null, 
                    currentPage: 0,
                    currentKeyword: '',
                    selectedView: 'view-all', // Redirección mandatoria al menú maestro
                    selectedStore: null,      // Limpieza de estados huérfanos
                    selectedProductId: null,  // Limpieza de memoria intermedia
                    activeTagIds: []          // Limpieza de filtros previos
                });
                
                // Pasamos force: true para saltar la optimización de caché reactiva
                performFetch({ kw: '', p: 0, force: true }); 
            },

            searchStores: rxMethod<string>(
                pipe(tap((keyword) => {
                    const kw = keyword.trim();
                    patchState(store, { currentKeyword: kw, currentPage: 0 });
                    performFetch({ kw, p: 0 });
                }))
            ),
            changePage: rxMethod<number>(
                pipe(tap((delta) => {
                    const nextPage = store.currentPage() + delta;
                    patchState(store, { currentPage: nextPage });
                    performFetch({ kw: store.currentKeyword(), p: nextPage });
                }))
            ),
            createStore: rxMethod<CreateStoreDto>(
                pipe(
                    tap(() => patchState(store, { isSubmitting: true, error: null, isSuccess: false, message: null })),
                    switchMap(dto => api.createStore(dto).pipe(
                        tapResponse({
                            next: () => {
                                patchState(store, { isSubmitting: false, isSuccess: true });
                                ui.showToast('Tienda creada con éxito');
                                performFetch({ kw: store.currentKeyword(), p: store.currentPage(), force: true });
                            },
                            error: (error: HttpErrorResponse) => patchState(store, { isSubmitting: false, error: error.error?.message }),
                        }),
                    )),
                ),
            ),
            updateStore: rxMethod<{ id: number, request: UpdateStoreRequest }>(
                pipe(
                    tap(() => patchState(store, { isSubmitting: true, error: null, isSuccess: false, message: null })),
                    switchMap(({ id, request }) => api.updateStore(id, request).pipe(
                        tapResponse({
                            next: () => {
                                patchState(store, { isSubmitting: false, isSuccess: true });
                                ui.showToast('Tienda actualizada con éxito');
                                performFetch({ kw: store.currentKeyword(), p: store.currentPage(), force: true });
                            },
                            error: (error: HttpErrorResponse) => patchState(store, { isSubmitting: false, error: error.error?.message }),
                        }),
                    )),
                ),
            ),
            deleteStore: rxMethod<number>(
                pipe(
                    tap(() => patchState(store, { isSubmitting: true, error: null, isSuccess: false, message: null })),
                    switchMap((id) => api.deleteStore(id).pipe(
                        tapResponse({
                            next: (res) => patchState(store, (state) => {
                                ui.showToast(res.message || 'Tienda eliminada');
                                if (!state.storesPage) return { isSubmitting: false, isSuccess: true };
                                const updatedStores = state.storesPage.stores.filter(s => s.id !== id);
                                return { isSubmitting: false, isSuccess: true, storesPage: { ...state.storesPage, stores: updatedStores } };
                            }),
                            error: (err: HttpErrorResponse) => patchState(store, { isSubmitting: false, error: err.error?.message })
                        })
                    ))
                )
            ),
            listenToStoreUpdates: rxMethod<void>(
                pipe(
                    switchMap(() => {
                        const currentToken = store.token();
                        if (!currentToken) return EMPTY;
                        return api.listenToStoreStream(currentToken).pipe(
                            tap(storeUpdate => {
                                if (!storeUpdate.id) return;
                                patchState(store, state => {
                                    if (!state.storesPage) return state;
                                    const updatedStores = state.storesPage.stores.map(tiendaActual =>
                                        tiendaActual.id === storeUpdate.id ? { ...tiendaActual, ...storeUpdate } : tiendaActual,
                                    );
                                    return { storesPage: { ...state.storesPage, stores: updatedStores } };
                                });
                            }),
                        );
                    }),
                ),
            ),
        };
    })
);
