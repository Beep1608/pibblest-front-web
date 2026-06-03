// src/app/feature-dashboard/src/lib/data-access/store/dashboard.store.ts
import { patchState, signalStore, withMethods, withState } from "@ngrx/signals";

export type DashboardPage = 'overview' | 'stores' | 'products' | 'tags-stores' | 'tags-products';

type UiState = {
    currentView: DashboardPage;
    selectedStoreId: number | null;
}

const initialState: UiState = {
    currentView: 'stores',
    selectedStoreId: null,
};

export const DashboardStore = signalStore(
    {providedIn: 'root'},
    withState(initialState),
    withMethods( (store) => ({
        setView(view: DashboardPage, storeId?: number){
            patchState(store, {
                currentView: view,
                selectedStoreId: storeId ?? null
            });
        }
    }))
);