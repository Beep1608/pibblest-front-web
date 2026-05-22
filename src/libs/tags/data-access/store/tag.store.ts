import { HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { tapResponse } from '@ngrx/operators';
import { patchState, signalStore, withMethods, withState } from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { pipe, switchMap, tap } from 'rxjs';
import { TagPageResponse } from '../models/tag.model';
import { TagServiceApi } from '../service/tag.service';

interface TagsState {
	isLoading: boolean;
	error: string | null;
	isSuccess: boolean;
	message: string | null;
	tagsPage: TagPageResponse | null;
}
const initialState: TagsState = {
	isLoading: false,
	error: null,
	isSuccess: false,
	message: null,
	tagsPage: null,
};

export const TagStore = signalStore(
	{ providedIn: 'root' },
	withState(initialState),

	withMethods((tag, api = inject(TagServiceApi), router = inject(Router)) => ({
		getAllTagsForProducts: rxMethod<string>(
			pipe(
				tap(() => patchState(tag, { isLoading: true, error: null, isSuccess: false })),
				switchMap(keyword =>
					api.getAllTagsForProducts(keyword).pipe(
						tapResponse({
							next: response => {
								patchState(tag, { isLoading: false, isSuccess: true, tagsPage: response });
								console.log(response.tags);
							},
							error: (error: HttpErrorResponse) => {
								patchState(tag, {
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
	})),
);
