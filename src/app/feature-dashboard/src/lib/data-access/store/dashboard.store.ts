import { patchState, signalStore, withMethods, withState } from "@ngrx/signals";


export type DashboardPage =  'overview'  | 'store' | 'tags' | 'create-store' | 'store-page';

type UiState = {
    currentView: DashboardPage;
}
const initialState: UiState = {
  currentView: 'store',
};

export const DashboardStore = signalStore(
    {providedIn: 'root'},
    withState(initialState),
    withMethods( (store) => ({

        setView(view: DashboardPage){
            patchState(store, {currentView: view});
        }


    }))
)