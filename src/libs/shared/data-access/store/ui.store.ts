import { patchState, signalStore, withMethods, withState } from "@ngrx/signals";


export const UIStore = signalStore(
    {providedIn:'root'},
    withState({
        toastMessage: null as string | null,
        toastType: 'succes' as 'success' | 'error' | 'info'
    }),
    withMethods((store) => ({
        showToast(message: string, type: 'success' | 'error' | 'info' = 'success'){
            patchState(store, {toastMessage: message, toastType: type});

            setTimeout(() => patchState(store, {toastMessage:null}), 3000);
        }
    }))

)