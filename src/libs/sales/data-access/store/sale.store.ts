// src/libs/sales/data-access/store/sale.store.ts
import { HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { tapResponse } from '@ngrx/operators';
import { patchState, signalStore, withMethods, withState } from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { exhaustMap, pipe, switchMap, tap } from 'rxjs';
import { SaleApiService } from '../services/sale-api.service';
import { SaleCreateDto, SalePaginationResponse } from '../models/sale.model';
import { CartItem } from '../../../cart/data-access/lib/models/cart.model';
import { StoreStore } from '../../../stores/data-access/lib/store/store.store';
import { UIStore } from '../../../shared/data-access/store/ui.store';
import { PrinterService } from '../../../printing/services/printer.service';

interface SaleState {
	isLoading: boolean;
	error: string | null;
	isSuccess: boolean;
	message: string | null;
	lastSoldItems: CartItem[];
    salesPage: SalePaginationResponse | null;
    currentPage: number;
    pageSize: number;
    // ✨ FIX Hallazgo #2: Nuevos estados para los filtros
    selectedEmployeeId: string | null;
    startDate: string | null;
    endDate: string | null;
}

const initialState: SaleState = {
	isLoading: false,
	error: null,
	isSuccess: false,
	message: null,
	lastSoldItems: [],
    salesPage: null,
    currentPage: 0,
    pageSize: 10,
    selectedEmployeeId: null,
    startDate: null,
    endDate: null
};

export const SaleStore = signalStore(
	{ providedIn: 'root' },
	withState(initialState),

	withMethods((store, api = inject(SaleApiService), storeStore = inject(StoreStore), ui = inject(UIStore), printer = inject(PrinterService)) => ({
		
        createSale: rxMethod<{ dto: SaleCreateDto; print: boolean }>(
			pipe(
				tap(() => patchState(store, { isLoading: true, error: null, isSuccess: false })),
				switchMap(({ dto, print }) =>
					api.createSale(dto).pipe(
						tapResponse({
							next: (res) => {
								patchState(store, { isLoading: false, isSuccess: true });
                                ui.showToast('Venta confirmada exitosamente');
								setTimeout(() => patchState(store, { isSuccess: false }), 3000);
								
                                // Ticket printing is opt-in: only print when the user chose to.
                                if (print && res.saleId) {
                                    api.getTicket(res.saleId, dto.storeId).subscribe({
                                        next: (ticket) => {
                                            printer.print(ticket).catch(err => {
                                                console.error("Print failed:", err);
                                                ui.showToast("Error: check the printer connection", 'error');
                                            });
                                        },
                                        error: (err) => {
                                            console.error("Ticket fetch failed:", err);
                                            ui.showToast("Error: check the printer connection", 'error');
                                        }
                                    });
                                }
							},
							error: (error: HttpErrorResponse) => {
                                ui.showToast(error.error?.message || 'Error al procesar venta', 'error');
								patchState(store, { isLoading: false, isSuccess: false, error: error.error?.message });
							},
						}),
					),
				),
			),
		),

		setLastSoldItems: (items: CartItem[]) => {
			patchState(store, { lastSoldItems: items });
		},
		
		resetAlerts: () => {
			patchState(store, { isSuccess: false, isLoading: false, error: null, message: null, lastSoldItems: [] });
		},

        setPage: (page: number) => {
            patchState(store, { currentPage: page });
        },

        // ✨ FIX Hallazgo #2: Mutador de filtros
        setFilters(filters: { employeeId?: string | null, startDate?: string | null, endDate?: string | null }) {
            patchState(store, { 
                selectedEmployeeId: filters.employeeId ?? null,
                startDate: filters.startDate ?? null,
                endDate: filters.endDate ?? null,
                currentPage: 0
            });
        },

        loadSales: rxMethod<number>(
            pipe(
                tap(() => patchState(store, { isLoading: true, error: null })),
                switchMap((storeId) => {
                    const scope = (storeStore.isOwnerUser() || storeStore.hasPermission('MODULE_SALES', 'READ')) ? 'ALL' : 'PERSONAL';
                    
                    return api.getSalesByStore(
                        storeId, 
                        scope, 
                        store.selectedEmployeeId(),
                        store.startDate(),
                        store.endDate(),
                        store.currentPage(), 
                        store.pageSize()
                    ).pipe(
                        tapResponse({
                            next: (res) => patchState(store, { isLoading: false, salesPage: res }),
                            error: (err: HttpErrorResponse) => patchState(store, { isLoading: false, error: err.error?.message })
                        })
                    );
                })
            )
        ),

        cancelSale: rxMethod<{saleId: number, storeId: number}>(
            pipe(
                tap(() => patchState(store, { isLoading: true })),
                exhaustMap(({saleId, storeId}) => api.cancelSale(saleId).pipe(
                    tapResponse({
                        next: (res) => {
                            ui.showToast(res.message || 'Venta cancelada exitosamente');
                            const scope = (storeStore.isOwnerUser() || storeStore.hasPermission('MODULE_SALES', 'READ')) ? 'ALL' : 'PERSONAL';
                            api.getSalesByStore(
                                storeId, scope, store.selectedEmployeeId(), store.startDate(), store.endDate(), store.currentPage(), store.pageSize()
                            ).subscribe(res => patchState(store, { isLoading: false, salesPage: res }));
                        },
                        error: (err: HttpErrorResponse) => {
                            ui.showToast(err.error?.message || 'Error al cancelar', 'error');
                            patchState(store, { isLoading: false });
                        }
                    })
                ))
            )
        ),

        deleteSale: rxMethod<{saleId: number, storeId: number}>(
            pipe(
                tap(() => patchState(store, { isLoading: true })),
                exhaustMap(({saleId, storeId}) => api.deleteSale(saleId).pipe(
                    tapResponse({
                        next: () => {
                            ui.showToast('Venta eliminada permanentemente');
                            const scope = (storeStore.isOwnerUser() || storeStore.hasPermission('MODULE_SALES', 'READ')) ? 'ALL' : 'PERSONAL';
                            api.getSalesByStore(
                                storeId, scope, store.selectedEmployeeId(), store.startDate(), store.endDate(), store.currentPage(), store.pageSize()
                            ).subscribe(res => patchState(store, { isLoading: false, salesPage: res }));
                        },
                        error: (err: HttpErrorResponse) => {
                            ui.showToast(err.error?.message || 'Error al eliminar', 'error');
                            patchState(store, { isLoading: false });
                        }
                    })
                ))
            )
        )
	})),
);
