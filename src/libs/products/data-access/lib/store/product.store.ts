import { computed, inject } from '@angular/core';
import { tapResponse } from '@ngrx/operators';
import { patchState, signalStore, withComputed, withMethods, withState } from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { exhaustMap, pipe, switchMap, tap } from 'rxjs';
import { CreateProductRequest, Product, ProductPageResponse, UpdateProductRequest } from '../models/product.model';
import { ProductApiService } from '../services/product-api.service';
import { CartItem } from '../../../../cart/data-access/lib/models/cart.model';

export type ProductView = 'admin-inventory' | 'inventory' | 'create' | 'info' | 'edit';
export type DisplayMode = 'grid' | 'table';

interface ProductState {
    isLoading: boolean;
    isSubmitting: boolean;
    error: string | null;
    isSuccess: boolean;
    message: string | null;
    productsPage: ProductPageResponse | null;
    activeTagIds: number[];
    currentView: ProductView;
    selectedProductId: number | null;
    selectedProduct: Product | null;
    currentPage: number; // NUEVO
    pageSize: number;    // NUEVO
    displayMode: DisplayMode; // NUEVO
}

const initialState: ProductState = {
    isLoading: false,
    isSubmitting: false,
    error: null,
    isSuccess: false,
    message: null,
    productsPage: null,
    activeTagIds: [],
    currentView: 'admin-inventory',
    selectedProductId: null,
    selectedProduct: null,
    currentPage: 0,
    pageSize: 10,
    displayMode: 'grid'
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
	withMethods((product, api = inject(ProductApiService)) => ({
		
		setProductView: (view: ProductView) => {
			patchState(product, { currentView: view, isSuccess: false, error: null, message: null });
		},

		resetProductState: () => {
			patchState(product, { isSuccess: false, error: null, message: null, isSubmitting: false });
		},

		setDisplayMode: (mode: DisplayMode) => {
			patchState(product, { displayMode: mode });
		},

		setPage: (page: number) => {
			patchState(product, { currentPage: page });
		},

		setPageSize: (size: number) => {
			patchState(product, { pageSize: size, currentPage: 0 }); // Reset a página 0 al cambiar tamaño
		},

		setSelectedProductId: (id: number | null) => {
			patchState(product, { selectedProductId: id });
		},

		loadProductDetails: rxMethod<number>(
			pipe(
				tap(() => patchState(product, { isLoading: true, error: null, isSuccess: false, selectedProduct: null })),
				switchMap((id) => api.getProductById(id).pipe(
					tapResponse({
						next: (res) => patchState(product, { isLoading: false, selectedProduct: res }),
						error: (err: any) => patchState(product, { isLoading: false, error: err.message || 'Error al cargar detalles' })
					})
				))
			)
		),

		updateProduct: rxMethod<{id: number, request: UpdateProductRequest}>(
			pipe(
				tap(() => patchState(product, { isSubmitting: true, error: null, isSuccess: false, message: null })),
				exhaustMap(({id, request}) => api.editProduct(id, request).pipe(
					tapResponse({
						next: (res) => patchState(product, {
							isSubmitting: false,
							isSuccess: true,
							message: res.message || 'Producto actualizado correctamente'
						}),
						error: (err: any) => patchState(product, {
							isSubmitting: false,
							isSuccess: false,
							error: err.error?.message || err.message || 'Error al actualizar el producto'
						})
					})
				))
			)
		),

		deleteProduct: rxMethod<number>(
			pipe(
				tap(() => patchState(product, { isSubmitting: true, error: null, isSuccess: false, message: null })),
				exhaustMap((id) => api.deleteProduct(id).pipe(
					tapResponse({
						next: (res) => patchState(product, (state) => {
							if (!state.productsPage) return { isSubmitting: false, isSuccess: true };
							
							const updatedProducts = state.productsPage.products.filter(p => p.id !== id);
							
							return {
								isSubmitting: false,
								isSuccess: true,
								message: res.message || 'Producto eliminado exitosamente',
								productsPage: { ...state.productsPage, products: updatedProducts }
							};
						}),
						error: (err: any) => patchState(product, {
							isSubmitting: false,
							isSuccess: false,
							error: err.error?.message || err.message || 'Error al eliminar el producto'
						})
					})
				))
			)
		),

		getAllProducts: rxMethod<{ storeId: number; keyword: string | null }>(
			pipe(
				tap(() => patchState(product, { isLoading: true, error: null, isSuccess: false })),
				switchMap(({ storeId, keyword }) => {
					// Extraemos estado de paginación
					return api.getAllProducts(storeId, keyword, product.currentPage(), product.pageSize()).pipe(
						tapResponse({
							next: response => patchState(product, { isLoading: false, isSuccess: true, productsPage: response }),
							error: (err: any) => patchState(product, { isLoading: false, isSuccess: false, error: err.message || 'Error de conexión' }),
						}),
					);
				}),
			),
		),

		getGlobalProducts: rxMethod<string | null>(
			pipe(
				tap(() => patchState(product, { isLoading: true, error: null, isSuccess: false })),
				switchMap((keyword) => {
					// Extraemos estado de paginación
					return api.getUniverseProducts(keyword, product.currentPage(), product.pageSize()).pipe(
						tapResponse({
							next: response => patchState(product, { isLoading: false, isSuccess: true, productsPage: response }),
							error: (err: any) => patchState(product, { isLoading: false, isSuccess: false, error: err.message || 'Error al cargar' }),
						}),
					);
				}),
			),
		),

		addProduct: rxMethod<CreateProductRequest>(
			pipe(
				tap(() => patchState(product, { isSubmitting: true, error: null, isSuccess: false, message: null })),
				exhaustMap((request) => {
					return api.createProduct(request).pipe(
						tapResponse({
							next: (response) => patchState(product, { isSubmitting: false, isSuccess: true, message: response.message || 'Creado' }),
							error: (err: any) => patchState(product, { isSubmitting: false, isSuccess: false, error: err.error?.message || err.message })
						})
					);
				})
			)
		),

		setActiveTags: (tagIds: number[]) => {
			patchState(product, { activeTagIds: tagIds });
		},

		reduceStockLocally: (soldItems: CartItem[]) => {
			patchState(product, state => {
				if (!state.productsPage) return state;
				const updatedProducts = state.productsPage.products.map(product => {
					const soldItem = soldItems.find(item => item.product.id === product.id);
					if (soldItem) {
						return { ...product, currentQuantity: product.currentQuantity - soldItem.quantity };
					}
					return product;
				});
				return { productsPage: { ...state.productsPage, products: updatedProducts } };
			});
		},
	})),
);
