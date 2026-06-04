// src/libs/tags/data-access/store/tag.store.ts
import { HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { tapResponse } from '@ngrx/operators';
import { patchState, signalStore, withMethods, withState } from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { Observable, pipe, switchMap, tap, debounceTime, filter } from 'rxjs';
import { Tag, TagPageResponse, CreateTagRequest } from '../models/tag.model';
import { TagApiService } from '../services/tag-api.service';
import { UIStore } from '../../../shared/data-access/store/ui.store';

export type TagContext = 'stores' | 'products';
export type TagView = 'list' | 'create' | 'edit';

interface TagsState {
    isLoading: boolean;
    isSubmitting: boolean;
    error: string | null;
    isSuccess: boolean;
    message: string | null;
    tagsPage: TagPageResponse | null;
    allStoreTagsList: Tag[];
    allProductTagsList: Tag[];
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
    allStoreTagsList: [],
    allProductTagsList: [],
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

        // Nuevo método dedicado exclusivamente a la búsqueda
        // Reemplaza tu método searchTags con este:
        searchTags: rxMethod<string>(
            pipe(
                // 1. ANTI-SPAM: Espera 300ms antes de procesar. Si el HTML lanza 2 eventos simultáneos, ignora el primero.
                debounceTime(300),
                
                // 2. FILTRO INTELIGENTE: Bloquea la petición si estás buscando exactamente lo mismo y ya estás en la página 0.
                filter((keyword) => {
                    const cleanKeyword = keyword.trim();
                    const isSameKeyword = store.currentKeyword() === cleanKeyword;
                    const isFirstPage = store.currentPage() === 0;
                    return !(isSameKeyword && isFirstPage); // Solo pasa si NO es una búsqueda idéntica en la pág 0
                }),

                // 3. ACTUALIZACIÓN DE ESTADO
                tap((keyword) => patchState(store, { 
                    currentKeyword: keyword.trim(), 
                    currentPage: 0, 
                    isLoading: true, 
                    error: null, 
                    isSuccess: false 
                })),

                // 4. PETICIÓN AL BACKEND
                switchMap((keyword) => {
                    const ctx = store.currentContext();
                    const s = store.pageSize();

                    const req = ctx === 'stores' 
                        ? api.getAllStoreTags(keyword.trim(), 0, s)
                        : api.getAllProductTags(keyword.trim(), 0, s);
                    
                    return req.pipe(
                        tapResponse({
                            next: (res) => patchState(store, { tagsPage: res, isLoading: false }),
                            error: (err: HttpErrorResponse) => patchState(store, { error: err.message, isLoading: false })
                        })
                    );
                })
            )
        ),

        // Nuevo método dedicado a cambiar de página conservando el keyword
        changePage: rxMethod<number>(
            pipe(
                tap((delta) => patchState(store, (state) => ({ 
                    currentPage: state.currentPage + delta, 
                    isLoading: true, 
                    error: null 
                }))),
                switchMap(() => {
                    const ctx = store.currentContext();
                    const kw = store.currentKeyword();
                    const p = store.currentPage();
                    const s = store.pageSize();

                    const req = ctx === 'stores' 
                        ? api.getAllStoreTags(kw, p, s)
                        : api.getAllProductTags(kw, p, s);
                    
                    return req.pipe(
                        tapResponse({
                            next: (res) => patchState(store, { tagsPage: res, isLoading: false }),
                            error: (err: HttpErrorResponse) => patchState(store, { error: err.message, isLoading: false })
                        })
                    );
                })
            )
        ),

        // Carga inicial genérica
        loadTags: rxMethod<void>(
            pipe(
                tap(() => patchState(store, { isLoading: true, error: null, isSuccess: false })),
                switchMap(() => {
                    const ctx = store.currentContext();
                    const kw = store.currentKeyword();
                    const p = store.currentPage();
                    const s = store.pageSize();

                    const req = ctx === 'stores' 
                        ? api.getAllStoreTags(kw, p, s)
                        : api.getAllProductTags(kw, p, s);
                    
                    return req.pipe(
                        tapResponse({
                            next: (res) => patchState(store, { tagsPage: res, isLoading: false }),
                            error: (err: HttpErrorResponse) => patchState(store, { error: err.message, isLoading: false })
                        })
                    );
                })
            )
        ),

        loadAllStoreTagsList: rxMethod<void>(
            pipe(
                tap(() => patchState(store, { isLoading: true, error: null })),
                switchMap(() => api.getAllStoreTagsList().pipe(
                    tapResponse({
                        next: (res) => patchState(store, { allStoreTagsList: res.tags, isLoading: false }),
                        error: (err: HttpErrorResponse) => patchState(store, { error: err.message, isLoading: false })
                    })
                ))
            )
        ),

        loadAllProductTagsList: rxMethod<void>(
            pipe(
                tap(() => patchState(store, { isLoading: true, error: null })),
                switchMap(() => api.getAllProductTagsList().pipe(
                    tapResponse({
                        next: (res) => patchState(store, { allProductTagsList: res.tags, isLoading: false }),
                        error: (err: HttpErrorResponse) => patchState(store, { error: err.message, isLoading: false })
                    })
                ))
            )
        ),

        createTag: rxMethod<CreateTagRequest>(
            pipe(
                tap(() => patchState(store, { isSubmitting: true, error: null, isSuccess: false })),
                switchMap((req) => {
                    const apiCall = (store.currentContext() === 'stores'
                        ? api.createStoreTag(req)
                        : api.createProductTag(req)) as Observable<{ tag?: Tag, message?: string }>;
                        
                    return apiCall.pipe(
                        tapResponse({
                            next: (res) => patchState(store, (state) => {
                                ui.showToast('Tag creado exitosamente');
                                
                                const newTag: Tag = res.tag ? res.tag : { id: Date.now(), name: req.name, usageCount: 0 };
                                const updatedTags = state.tagsPage ? [newTag, ...state.tagsPage.tags] : [newTag];
                                
                                return { 
                                    isSubmitting: false, 
                                    isSuccess: true, 
                                    message: 'Tag creado exitosamente',
                                    tagsPage: state.tagsPage ? { ...state.tagsPage, tags: updatedTags, totalElements: state.tagsPage.totalElements + 1 } : null
                                };
                            }),
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
                            next: (res) => patchState(store, (state) => {
                                ui.showToast('Tag actualizado exitosamente');
                                
                                if (!state.tagsPage) return { isSubmitting: false, isSuccess: true, message: 'Tag actualizado exitosamente' };
                                
                                const updatedTags = state.tagsPage.tags.map(t => t.id === id ? { ...t, name: request.name } : t);
                                
                                return {
                                    isSubmitting: false,
                                    isSuccess: true,
                                    message: 'Tag actualizado exitosamente',
                                    tagsPage: { ...state.tagsPage, tags: updatedTags }
                                };
                            }),
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
                                    tagsPage: { ...state.tagsPage, tags: updatedTags, totalElements: state.tagsPage.totalElements - 1 }
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
