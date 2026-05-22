// src/libs/stores/data-access/lib/store/store.store.ts
import { HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { tapResponse } from '@ngrx/operators';
import { patchState, signalStore, withMethods, withState } from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { EMPTY, pipe, switchMap, tap } from 'rxjs';
import { DashboardStore } from '../../../../../app/feature-dashboard/src/lib/data-access/store/dashboard.store';
import { Product } from '../../../../products/data-access/lib/models/product.model';
import { PageRequest } from '../../../../shared/data-access/models/sort.model';
import { UIStore } from '../../../../shared/data-access/store/ui.store';
import {  CreateStoreDto, StorePaginationResponse } from '../models/store.model';
import { StoreApiService } from '../services/store-api.service';

export type StoreSubmenu = 'products' | 'sale' | 'sale-history';
export type StoreView =  'view-all'| 'create-store'|'store-page'| 'product-info' | 'sale-info' | null;
interface StoreState {
	isLoading: boolean;
	error: string | null;
	isSuccess: boolean;
	token: string | null;
	message: string | null;
	selectedStore: number | null,
	selectedSubMenu: StoreSubmenu;
	selectedView: StoreView;
	storesPage: StorePaginationResponse | null;
}

const initialState: StoreState = {
	isLoading: false,
	error: null,
	isSuccess: false,
	token: null,
	message: null,
	selectedStore:null,
	selectedSubMenu: 'sale',
	selectedView: 'view-all',
	storesPage: null,
};

export const StoreStore = signalStore(
	{ providedIn: 'root' },
	withState(initialState),
	withMethods(
		(
			store,
			api = inject(StoreApiService),
			router = inject(Router),
			dashboardStore = inject(DashboardStore),
			ui = inject(UIStore),
		) => ({
			createStore: rxMethod<CreateStoreDto>(
				pipe(
					tap(() =>
						patchState(store, {
							isLoading: true,
							error: null,
							isSuccess: false,
						}),
					),
					switchMap(dto =>
						api.createStore(dto).pipe(
							tapResponse({
								next: () => {
									patchState(store, { isLoading: false, isSuccess: true });

									ui.showToast('Tienda creada con exito');
								},
								error: (error: HttpErrorResponse) => {
									patchState(store, {
										isLoading: false,
										isSuccess: false,
										error: error.error?.message || 'Error al crear la tienda',
									});
									ui.showToast(error?.message, 'error');
								},
							}),
						),
					),
				),
			),

			getAllStores: rxMethod<PageRequest>(
				pipe(
					tap(() =>
						patchState(store, {
							isLoading: true,
							error: null,
							isSuccess: false,
						}),
					),

					switchMap(dto => {
						return api.getAllStores(dto.page, dto.size, dto.sort).pipe(
							tapResponse({
								next: response => {
									console.log(response);
									patchState(store, {
										isLoading: false,
										isSuccess: true,
										storesPage: response,
									});
									
								},
								error: (error: any) => {
									patchState(store, {
										isLoading: false,
										isSuccess: false,
										error: error.message || 'Ocurrion un error al cargar las tiendas',
									});
								},
							}),
						);
					}),
				),
			),
			listenToStoreUpdates: rxMethod<void>(
				pipe(
					switchMap(() => {
						const currentToken = localStorage.getItem('pibblest_token');

						if (!currentToken) {
							console.warn('No se puede conectar al sse ya que no hay token');
							return EMPTY;
						}

						return api.listenToStoreStream(currentToken).pipe(
							tap(storeUpdate => {
								if (!storeUpdate.id) return;
								patchState(store, state => {
									if (!state.storesPage) return state;
									const updatedStores = state.storesPage.stores.map(tiendaActual =>
										tiendaActual.id === storeUpdate.id ? { ...tiendaActual, ...storeUpdate } : tiendaActual,
									);

									return {
										storesPage: {
											...state.storesPage,
											stores: updatedStores,
										},
									};
								});
							}),
						);
					}),
				),
			),

			setSubmenu(submenu: StoreSubmenu) {
				patchState(store, { selectedSubMenu: submenu });
			},

			setView(view: StoreView) {
				patchState(store, { selectedView: view });
				console.log('cambio la view a ', view);
			},

			setSelectedStore(storeId: number){
				patchState(store, { selectedStore: storeId});
			}

		}),
	),
);
