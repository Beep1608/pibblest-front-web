import { patchState, signalStore, withMethods, withState } from "@ngrx/signals";
import { ProductPageResponse } from "../models/product.model";
import { inject } from "@angular/core";
import { ProductApiService } from "../services/product-api.service";
import { rxMethod } from "@ngrx/signals/rxjs-interop";
import { pipe, switchMap, tap } from "rxjs";
import { UIStore } from "../../../../shared/data-access/store/ui.store";
import { DashboardStore } from "../../../../../app/feature-dashboard/src/lib/data-access/store/dashboard.store";
import { tapResponse } from "@ngrx/operators";

interface ProductState{
    isLoading: boolean,
    error: string | null,
    isSuccess: boolean,
    message: string | null,
    productsPage: ProductPageResponse | null
}

const initialState : ProductState = {
    isLoading: false,
    error: null,
    isSuccess: false,
    message: null,
    productsPage: null
}

export const ProductStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withMethods((product, api = inject(ProductApiService), dashboardStore = inject(DashboardStore)) => ({
    getAllProducts: rxMethod<string | null>(
        pipe(
            tap(  () => 
                patchState(product, {
                    isLoading: true, 
                    error: null,
                    isSuccess: false
                })

            ),
            switchMap((keyword) =>{
                const storeId: number = dashboardStore.selectedStoreId() ?? 0;
                return api.getAllProducts(storeId, keyword).pipe(
                    tapResponse({
                        next: (response) => {
                            patchState(product, {
                                isLoading: false,
                                isSuccess: true,
                                productsPage: response
                            });
                            console.log('respuesta');
                            console.log(response);

                        },
                        error: (errr: any) => {
                            console.log('error');
                            patchState(product, {
                                isLoading: false,
                                isSuccess: false,
                                error: errr.message || 'Hay un error nihao'
                            })
                        }
                    })
                )
            })
        )
    )
  })),
);