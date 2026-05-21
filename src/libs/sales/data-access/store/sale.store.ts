import { HttpErrorResponse } from '@angular/common/http';
import { computed, inject } from '@angular/core';
import { tapResponse } from '@ngrx/operators';
import { patchState, signalStore, withComputed, withMethods, withState } from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { pipe, switchMap, tap } from 'rxjs';
import { Product } from '../../../products/data-access/lib/models/product.model';
import { CartItem, SaleCreateDto } from '../models/sale.model';
import { SaleApiService } from '../services/sale-api.service';

interface SaleState {
	isLoading: boolean;
	error: string | null;
	isSuccess: boolean;
	message: string | null;
	cart: CartItem[];
}

const initialState: SaleState = {
	isLoading: false,
	error: null,
	isSuccess: false,
	message: null,
	cart: [],
};
export const SaleStore = signalStore(
	{ providedIn: 'root' },
	withState(initialState),
	withComputed(sale => ({
		totalPrice: computed(() => {
			return sale.cart().reduce((total, item) => total + item.product.basePrice * item.quantity, 0);
		}),

		totalItems: computed(() => {
			return sale.cart().reduce((total, item) => total + item.quantity, 0);
		}),
	})),
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
								patchState(store, { isLoading: false, isSuccess: true, cart: [] });
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
		clearCart: () => {
			patchState(store, {
				cart: [], 
			});
		},
		addToCart(product: Product) {
			patchState(store, state => {
				const alreadyExists = state.cart.find(item => item.product.id === product.id);
				if (alreadyExists) {
					return {
						cart: state.cart.map(item =>
							item.product.id === product.id ? { ...item, quantity: item.quantity + 1 } : item,
						),
					};
				} else {
					return {
						cart: [...state.cart, { product: product, quantity: 1 }],
					};
				}
			});
		},

		removeFromCart(product: Product) {
			patchState(store, state => ({
				cart: state.cart.filter(item => item.product.id !== product.id),
			}));
		},

		decreaseQuantity(product: Product) {
			patchState(store, state => {
				return {
					cart: state.cart
						
						.map(item => (item.product.id === product.id ? { ...item, quantity: item.quantity - 1 } : item))
						
						.filter(item => item.quantity > 0),
				};
			});
		},

		resetAlerts: () => {
			console.log('miau')
			patchState(store, {
				isSuccess: false,
				error: null,
			});
		},
	})),
);
