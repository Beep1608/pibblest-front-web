// src/libs/employees/data-access/src/lib/store/employee.store.ts
import { HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { tapResponse } from '@ngrx/operators';
import { patchState, signalStore, withMethods, withState } from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { pipe, switchMap, tap, EMPTY } from 'rxjs';
import { EmployeeApiService } from '../services/employee-api.service';
import { EmployeePageResponse, EmployeeDto, CreateEmployeeRequest, UpdateEmployeeRequest } from '../models/employee.model';
import { UIStore } from '../../../../../shared/data-access/store/ui.store';

export type EmployeeView = 'list' | 'create' | 'edit';

interface EmployeeState {
    isLoading: boolean;
    isSubmitting: boolean;
    error: string | null;
    isSuccess: boolean;
    message: string | null;
    activationLink: string | null;
    employeesPage: EmployeePageResponse | null;
    currentView: EmployeeView;
    selectedEmployeeId: string | null;
    selectedEmployee: EmployeeDto | null;
    currentPage: number;
    pageSize: number;
}

const initialState: EmployeeState = {
    isLoading: false,
    isSubmitting: false,
    error: null,
    isSuccess: false,
    message: null,
    activationLink: null,
    employeesPage: null,
    currentView: 'list',
    selectedEmployeeId: null,
    selectedEmployee: null,
    currentPage: 0,
    pageSize: 10
};

export const EmployeeStore = signalStore(
    { providedIn: 'root' },
    withState(initialState),
    withMethods((store, api = inject(EmployeeApiService), ui = inject(UIStore)) => {
        
        const setView = (view: EmployeeView) => {
            patchState(store, { currentView: view, isSuccess: false, error: null, message: null, activationLink: null });
        };

        const setPage = (page: number) => {
            patchState(store, { currentPage: page });
        };

        const setSelectedEmployeeId = (id: string | null) => {
            patchState(store, { selectedEmployeeId: id });
        };

        const resetAlerts = () => {
            patchState(store, { isSuccess: false, error: null, message: null, activationLink: null, isSubmitting: false });
        };

        const resetStore = () => {
            patchState(store, { 
                selectedEmployee: null, 
                selectedEmployeeId: null,
                currentView: 'list',
                isSuccess: false,
                error: null
            });
        };

        const loadEmployees = rxMethod<void>(
            pipe(
                tap(() => patchState(store, { isLoading: true, error: null })),
                switchMap(() => api.getAllEmployees(store.currentPage(), store.pageSize()).pipe(
                    tapResponse({
                        next: (response) => patchState(store, { isLoading: false, employeesPage: response }),
                        error: (err: HttpErrorResponse) => patchState(store, { isLoading: false, error: err.error?.message || 'Error al cargar empleados' })
                    })
                ))
            )
        );

        const loadEmployeeDetails = rxMethod<string>(
            pipe(
                // ✨ SOLUCIÓN: Recibimos el 'id' en el tap y lo guardamos inmediatamente en el estado
                tap((id) => patchState(store, { 
                    isLoading: true, 
                    error: null, 
                    selectedEmployeeId: id 
                })),
                switchMap((id) => api.getEmployeeById(id).pipe(
                    tapResponse({
                        next: (employee) => {
                            console.log("DATA RECIBIDA DEL BACKEND:", employee);
                            patchState(store, { 
                                isLoading: false, 
                                selectedEmployee: employee,
                                currentView: 'edit' 
                            });
                        },
                        error: (err: HttpErrorResponse) => {
                            console.error("ERROR DE API:", err);
                            patchState(store, { 
                                isLoading: false, 
                                error: err.error?.message || 'Error al cargar detalles del empleado' 
                            });
                        }
                    })
                ))
            )
        );

        const createEmployee = rxMethod<CreateEmployeeRequest>(
            pipe(
                tap(() => {
                    console.log("Iniciando petición HTTP (Creación)...");
                    patchState(store, { isSubmitting: true, error: null, isSuccess: false, message: null });
                }),
                switchMap(req => api.createEmployee(req).pipe(
                    tapResponse({
                        next: (res) => {
                            patchState(store, { isSubmitting: false, isSuccess: true, message: res.message, activationLink: res.activationLink });
                            ui.showToast(res.message);
                            setView('list');
                            loadEmployees();
                        },
                        error: (err: HttpErrorResponse) => {
                            patchState(store, { isSubmitting: false, isSuccess: false, error: err.error?.message || 'Error al crear empleado' });
                            ui.showToast(err.message, 'error');
                        }
                    })
                ))
            )
        );

        const updateEmployee = rxMethod<{ id: string, request: UpdateEmployeeRequest }>(
            pipe(
                tap(() => {
                    console.log("Iniciando petición HTTP (Edición)...");
                    patchState(store, { isSubmitting: true, error: null, isSuccess: false, message: null });
                }),
                switchMap(({ id, request }) => {
                    return api.editEmployee(id, request).pipe(
                        tapResponse({
                            next: (res) => {
                                patchState(store, { isSubmitting: false, isSuccess: true, message: res.message });
                                ui.showToast(res.message);
                                setView('list');
                                loadEmployees();
                            },
                            error: (err: HttpErrorResponse) => {
                                patchState(store, { isSubmitting: false, isSuccess: false, error: err.error?.message || 'Error al editar empleado' });
                                ui.showToast(err.message, 'error');
                            }
                        })
                    );
                })
            )
        );

        const deleteEmployee = rxMethod<string>(
            pipe(
                tap(() => patchState(store, { isSubmitting: true, error: null, isSuccess: false, message: null })),
                switchMap((id) => api.deleteEmployee(id).pipe(
                    tapResponse({
                        next: () => {
                            patchState(store, (state) => {
                                ui.showToast('Empleado eliminado con éxito');
                                if (!state.employeesPage) return { isSubmitting: false, isSuccess: true };
                                const updatedList = state.employeesPage.employees.filter(e => e.id !== id);
                                return {
                                    isSubmitting: false,
                                    isSuccess: true,
                                    employeesPage: { ...state.employeesPage, employees: updatedList }
                                };
                            });
                        },
                        error: (err: HttpErrorResponse) => {
                            patchState(store, { isSubmitting: false, isSuccess: false, error: err.error?.message || 'Error al eliminar empleado' });
                            ui.showToast(err.message, 'error');
                        }
                    })
                ))
            )
        );

        return {
            setView,
            setPage,
            setSelectedEmployeeId,
            resetAlerts,
            resetStore,
            loadEmployees,
            loadEmployeeDetails,
            createEmployee,
            updateEmployee,
            deleteEmployee
        };
    })
);
