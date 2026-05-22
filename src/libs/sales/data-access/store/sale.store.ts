import { HttpErrorResponse } from '@angular/common/http';
import { computed, inject } from '@angular/core';
import { tapResponse } from '@ngrx/operators';
import { patchState, signalStore, withComputed, withMethods, withState } from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { pipe, switchMap, tap } from 'rxjs';
import { Product } from '../../../products/data-access/lib/models/product.model';
import { SaleApiService } from '../services/sale-api.service';
import { ProductStore } from '../../../products/data-access/lib/store/product.store';
import { SaleCreateDto } from '../models/sale.model';
import { CartItem } from '../../../cart/data-access/lib/models/cart.model';

interface SaleState {
	isLoading: boolean;
	error: string | null;
	isSuccess: boolean;
	message: string | null;
	lastSoldItems: CartItem[]
	
}

const initialState: SaleState = {
	isLoading: false,
	error: null,
	isSuccess: false,
	message: null,
	lastSoldItems: []
};
export const SaleStore = signalStore(
	{ providedIn: 'root' },
	withState(initialState),

	withMethods((store, api = inject(SaleApiService)) => ({
		createSale: rxMethod<SaleCreateDto>(
			pipe(
				tap(() =>
					patchState(store, {
						isLoading: true,
						error: null,
						isSuccess: false,
					}),
				),
				switchMap(dto =>
					api.createSale(dto).pipe(
						tapResponse({
							next: () => {
								patchState(store, { isLoading: false, isSuccess: true });
								setTimeout(() => {
									patchState(store, { isSuccess: false });
								}, 3000);
							},
							error: (error: HttpErrorResponse) => {
								patchState(store, {
									isLoading: false,
									isSuccess: false,
									error: error.error?.message || 'Error al crear la tienda',
								});
							},
						}),
					),
				),
			),
		),
		setLastSoldItems: (items: CartItem[]) => {
			patchState(store, { lastSoldItems: items });
		},

		resetAlerts: () => {
			console.log('miau');
			patchState(store, {
				isSuccess: false,
				error: null,
			});
		},
	})),
);
