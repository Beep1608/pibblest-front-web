// src/libs/tags/data-access/store/tag.store.ts
import { HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { tapResponse } from '@ngrx/operators';
import { patchState, signalStore, withMethods, withState } from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { pipe, switchMap, tap } from 'rxjs';
import { Tag, TagPageResponse, CreateTagRequest } from '../models/tag.model';
import { TagApiService } from '../services/tag-api.service';
import { UIStore } from '../../../../shared/data-access/store/ui.store';

export type TagContext = 'stores' | 'products';
export type TagView = 'list' | 'create' | 'edit';

interface TagsState {
    isLoading: boolean;
    isSubmitting: boolean;
    error: string | null;
    isSuccess: boolean;
    message: string | null;
    tagsPage: TagPageResponse | null;
    currentContext: TagContext;
    currentView: TagView;
    selectedTag: Tag | null;
    currentPage: number;
    pageSize: number;
    currentKeyword: string;
}

const initialState: TagsState = {
    isLoading: false,
    isSubmitting: false,
    error: null,
    isSuccess: false,
    message: null,
    tagsPage: null,
    currentContext: 'stores',
    currentView: 'list',
    selectedTag: null,
    currentPage: 0,
    pageSize: 10,
    currentKeyword: '',
};

export const TagStore = signalStore(
    { providedIn: 'root' },
    withState(initialState),
    withMethods((store, api = inject(TagApiService), ui = inject(UIStore)) => ({
        
        setContext(context: TagContext) {
            patchState(store, { currentContext: context, currentView: 'list', currentPage: 0, currentKeyword: '' });
        },
        setView(view: TagView) {
            patchState(store, { currentView: view, isSuccess: false, error: null, message: null });
        },
        setPage(page: number) {
            patchState(store, { currentPage: page });
        },
        setKeyword(keyword: string) {
            patchState(store, { currentKeyword: keyword, currentPage: 0 });
        },
        setSelectedTag(tag: Tag | null) {
            patchState(store, { selectedTag: tag });
        },
        resetAlerts() {
            patchState(store, { error: null, isSuccess: false, message: null });
        },

        loadTags: rxMethod<void>(
            pipe(
                tap(() => patchState(store, { isLoading: true, error: null, isSuccess: false })),
                switchMap(() => {
                    const req = store.currentContext() === 'stores' 
                        ? api.getAllStoreTags(store.currentPage(), store.pageSize())
                        : api.getAllProductTags(store.currentKeyword(), store.currentPage(), store.pageSize());
                    
                    return req.pipe(
                        tapResponse({
                            next: (res) => patchState(store, { tagsPage: res, isLoading: false }),
                            error: (err: HttpErrorResponse) => patchState(store, { error: err.message, isLoading: false })
                        })
                    );
                })
            )
        ),

        createTag: rxMethod<CreateTagRequest>(
            pipe(
                tap(() => patchState(store, { isSubmitting: true, error: null, isSuccess: false })),
                switchMap((req) => {
                    const apiCall = store.currentContext() === 'stores'
                        ? api.createStoreTag(req)
                        : api.createProductTag(req);
                        
                    return apiCall.pipe(
                        tapResponse({
                            next: (res) => {
                                patchState(store, { isSubmitting: false, isSuccess: true, message: 'Tag creado exitosamente' });
                                ui.showToast('Tag creado exitosamente');
                            },
                            error: (err: HttpErrorResponse) => {
                                patchState(store, { isSubmitting: false, error: err.error?.message || 'Error al crear' });
                                ui.showToast(err.error?.message || 'Error al crear', 'error');
                            }
                        })
                    );
                })
            )
        ),

        updateTag: rxMethod<{id: number, request: CreateTagRequest}>(
            pipe(
                tap(() => patchState(store, { isSubmitting: true, error: null, isSuccess: false })),
                switchMap(({id, request}) => {
                    const apiCall = store.currentContext() === 'stores'
                        ? api.updateStoreTag(id, request)
                        : api.updateProductTag(id, request);
                        
                    return apiCall.pipe(
                        tapResponse({
                            next: (res) => {
                                patchState(store, { isSubmitting: false, isSuccess: true, message: 'Tag actualizado exitosamente' });
                                ui.showToast('Tag actualizado exitosamente');
                            },
                            error: (err: HttpErrorResponse) => {
                                patchState(store, { isSubmitting: false, error: err.error?.message || 'Error al actualizar' });
                                ui.showToast(err.error?.message || 'Error al actualizar', 'error');
                            }
                        })
                    );
                })
            )
        ),

        deleteTag: rxMethod<number>(
            pipe(
                tap(() => patchState(store, { isSubmitting: true, error: null, isSuccess: false })),
                switchMap((id) => {
                    const apiCall = store.currentContext() === 'stores'
                        ? api.deleteStoreTag(id)
                        : api.deleteProductTag(id);
                        
                    return apiCall.pipe(
                        tapResponse({
                            next: (res) => patchState(store, (state) => {
                                ui.showToast('Tag eliminado');
                                if (!state.tagsPage) return { isSubmitting: false, isSuccess: true };
                                const updatedTags = state.tagsPage.tags.filter(t => t.id !== id);
                                return {
                                    isSubmitting: false,
                                    isSuccess: true,
                                    tagsPage: { ...state.tagsPage, tags: updatedTags }
                                };
                            }),
                            error: (err: HttpErrorResponse) => patchState(store, { isSubmitting: false, error: err.error?.message || 'Error al eliminar' })
                        })
                    );
                })
            )
        )
    }))
);
