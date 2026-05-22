import { computed, inject } from '@angular/core';
import { tapResponse } from '@ngrx/operators';
import { patchState, signalStore, withComputed, withMethods, withState } from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { pipe, switchMap, tap } from 'rxjs';
import { StoreStore } from '../../../../stores/data-access';
import { ProductPageResponse } from '../models/product.model';
import { ProductApiService } from '../services/product-api.service';
import { CartItem } from '../../../../cart/data-access/lib/models/cart.model';

interface ProductState {
	isLoading: boolean;
	error: string | null;
	isSuccess: boolean;
	message: string | null;
	productsPage: ProductPageResponse | null;
	activeTagIds: number[]; 
}

const initialState: ProductState = {
	isLoading: false,
	error: null,
	isSuccess: false,
	message: null,
	productsPage: null,
	activeTagIds: [],
};

export const ProductStore = signalStore(
	{ providedIn: 'root' },
	withState(initialState),
	withComputed(({ productsPage, activeTagIds }) => ({
		filteredProducts: computed(() => {
			const allProducts = productsPage()?.products || [];
			const selectedTags = activeTagIds();

			if (selectedTags.length === 0) {
				return allProducts;
			}

			return allProducts.filter(product => {
				return product.tags.some(tag => selectedTags.includes(tag.id));
			});
		}),
	})),
	withMethods((product, api = inject(ProductApiService), store = inject(StoreStore)) => ({
		getAllProducts: rxMethod<string | null>(
			pipe(
				tap(() =>
					patchState(product, {
						isLoading: true,
						error: null,
						isSuccess: false,
					}),
				),
				switchMap(keyword => {
					const storeId: number = store.selectedStore() ?? 0;
					return api.getAllProducts(storeId, keyword).pipe(
						tapResponse({
							next: response => {
								patchState(product, {
									isLoading: false,
									isSuccess: true,
									productsPage: response,
								});
								console.log('respuesta');
								console.log(response);
							},
							error: (errr: any) => {
								console.log('error');
								patchState(product, {
									isLoading: false,
									isSuccess: false,
									error: errr.message || 'Hay un error nihao',
								});
							},
						}),
					);
				}),
			),
		),
		setActiveTags: (tagIds: number[]) => {
			patchState(product, { activeTagIds: tagIds });
		},

		reduceStockLocally: (soldItems: CartItem[]) => {
			console.log(soldItems);
			patchState(product, state => {
				if (!state.productsPage) return state;
				const updatedProducts = state.productsPage.products.map(product => {
					const soldItem = soldItems.find(item => item.product.id === product.id);
					if (soldItem) {
						return { ...product, currentQuantity: product.currentQuantity - soldItem.quantity };
					}
					return product;
				});
				return {
					productsPage: { ...state.productsPage, products: updatedProducts },
				};
			});
		},
	})),
);
