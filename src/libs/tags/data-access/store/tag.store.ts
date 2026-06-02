// src/libs/tags/data-access/store/tag.store.ts
import { HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { tapResponse } from '@ngrx/operators';
import { patchState, signalStore, withMethods, withState } from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { pipe, switchMap, tap } from 'rxjs';
import { TagForProductDto, TagPageResponse } from '../models/tag.model';
import { TagServiceApi } from '../service/tag.service';
import { TagApiService } from '../services/tag-api.service';

interface TagsState {
	isLoading: boolean;
	error: string | null;
	isSuccess: boolean;
	message: string | null;
	tagsPage: TagPageResponse | null;
	productTags: TagForProductDto[];
}

const initialState: TagsState = {
	isLoading: false,
	error: null,
	isSuccess: false,
	message: null,
	tagsPage: null,
	productTags: [],
};

export const TagStore = signalStore(
	{ providedIn: 'root' },
	withState(initialState),

	withMethods((tagStore, api = inject(TagServiceApi), tagApi = inject(TagApiService), router = inject(Router)) => ({
		getAllTagsForProducts: rxMethod<string>(
			pipe(
				tap(() => patchState(tagStore, { isLoading: true, error: null, isSuccess: false })),
				switchMap(keyword =>
					api.getAllTagsForProducts(keyword).pipe(
						tapResponse({
							next: response => {
								patchState(tagStore, { isLoading: false, isSuccess: true, tagsPage: response });
								console.log(response.tags);
							},
							error: (error: HttpErrorResponse) => {
								patchState(tagStore, {
									isLoading: false,
									isSuccess: false,
									error: error.error?.message || 'Error al obtener los tags',
								});
							},
						}),
					),
				),
			),
		),

		loadProductTags: rxMethod<void>(
			pipe(
				tap(() => patchState(tagStore, { isLoading: true, error: null })),
				switchMap(() => tagApi.getAllProductTagsList().pipe(
					tapResponse({
						next: (res) => patchState(tagStore, { productTags: res.tags, isLoading: false }),
						error: (err: any) => patchState(tagStore, { error: err.message, isLoading: false })
					})
				))
			)
		)
	})),
);
