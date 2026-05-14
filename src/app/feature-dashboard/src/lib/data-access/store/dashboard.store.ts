import { patchState, signalStore, withMethods, withState } from "@ngrx/signals";


export type DashboardPage =  'overview'  | 'store' | 'tags' | 'create-store';

type UiState = {
    currentView: DashboardPage;
}
const initialState: UiState = {
  currentView: 'create-store',
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