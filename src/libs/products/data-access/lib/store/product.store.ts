// src/libs/products/data-access/lib/store/product.store.ts
import { computed, inject } from '@angular/core';
import { tapResponse } from '@ngrx/operators';
import { patchState, signalStore, withComputed, withMethods, withState } from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { exhaustMap, pipe, switchMap, tap } from 'rxjs';
import { CreateProductRequest, Product, ProductPageResponse, UpdateProductRequest } from '../models/product.model';
import { ProductApiService } from '../services/product-api.service';
import { CartItem } from '../../../../cart/data-access/lib/models/cart.model';
import { UIStore } from '../../../../shared/data-access/store/ui.store'; // ✨ Importación requerida para las alertas

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
    currentPage: number; 
    pageSize: number;    
    displayMode: DisplayMode; 
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
    // ✨ FIX: Inyectamos el UIStore para las notificaciones de éxito/error
    withMethods((product, api = inject(ProductApiService), ui = inject(UIStore)) => ({
        
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
            patchState(product, { pageSize: size, currentPage: 0 }); 
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

        // ✨ FIX BUGS 1 & 2: Envío de la cantidad meta (desiredQuantity) junto con el stock
        assignProductToStore: rxMethod<{storeId: number, productId: number, desiredQuantity: number}>(
            pipe(
                tap(() => patchState(product, { isSubmitting: true, error: null, isSuccess: false })),
                exhaustMap(({storeId, productId, desiredQuantity}) => api.assignProductToStore(storeId, productId, desiredQuantity).pipe(
                    tapResponse({
                        next: (res) => {
                            patchState(product, { isSubmitting: false, isSuccess: true, message: res.message || 'Producto asignado a la tienda' });
                            ui.showToast('Producto asignado exitosamente');
                        },
                        error: (err: any) => {
                            patchState(product, { isSubmitting: false, isSuccess: false, error: err.error?.message || err.message });
                            ui.showToast(err.error?.message || 'Error al asignar producto', 'error');
                        }
                    })
                ))
            )
        ),

        // ✨ FIX BUG 3: Recibimos desiredQuantity para no destruir el dato al mandar el PUT
        updateStoreProductStock: rxMethod<{storeId: number, productId: number, desiredQuantity: number, stock: number}>(
            pipe(
                tap(() => patchState(product, { isSubmitting: true, error: null, isSuccess: false })),
                exhaustMap(({storeId, productId, desiredQuantity, stock}) => api.updateStoreProductStock(storeId, productId, desiredQuantity, stock).pipe(
                    tapResponse({
                        next: (res) => {
                            patchState(product, { isSubmitting: false, isSuccess: true, message: res.message || 'Stock actualizado' });
                            ui.showToast('Stock actualizado exitosamente');
                        },
                        error: (err: any) => {
                            patchState(product, { isSubmitting: false, isSuccess: false, error: err.error?.message || err.message });
                            ui.showToast(err.error?.message || 'Error al actualizar stock', 'error');
                        }
                    })
                ))
            )
        ),

        removeProductFromStore: rxMethod<{storeId: number, productId: number}>(
            pipe(
                tap(() => patchState(product, { isSubmitting: true, error: null, isSuccess: false })),
                exhaustMap(({storeId, productId}) => api.removeProductFromStore(storeId, productId).pipe(
                    tapResponse({
                        next: (res) => {
                            patchState(product, { isSubmitting: false, isSuccess: true, message: res.message || 'Producto removido de la tienda' });
                            ui.showToast('Producto desvinculado exitosamente');
                        },
                        error: (err: any) => {
                            patchState(product, { isSubmitting: false, isSuccess: false, error: err.error?.message || err.message });
                            ui.showToast(err.error?.message || 'Error al desvincular producto', 'error');
                        }
                    })
                ))
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
