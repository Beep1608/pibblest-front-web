import { patchState, signalStore, withMethods, withState } from "@ngrx/signals";


export type DashboardPage =  'overview'  | 'store' | 'tags' | 'create-store' | 'store-page' | 'product-info' | 'sale-page';

type UiState = {
    currentView: DashboardPage;
    selectedStoreId: number | null;
}
const initialState: UiState = {
  currentView: 'store',
  selectedStoreId: null,
};

export const DashboardStore = signalStore(
    {providedIn: 'root'},
    withState(initialState),
    withMethods( (store) => ({

        setView(view: DashboardPage, storeId?: number){
            patchState(store, {currentView: view,
                selectedStoreId: storeId ?? null
            });
            console.log('el id es: '+ storeId);
        }
        


    }))
)