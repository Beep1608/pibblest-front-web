import { patchState, signalStore, withMethods, withState } from "@ngrx/signals";


export type DashboardPage =  'overview'  | 'stores' | 'products' | 'tags' ;

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
            patchState(store, {currentView: view,
                selectedStoreId: storeId ?? null
            });
            console.log('el id es: '+ storeId);
        }
        


    }))
)