// src/libs/employees/data-access/src/lib/models/employee.model.ts
export interface ModulePermissionDto {
    moduleId: number;
    moduleCode: string;
    actions: string[];
}

export interface StoreAssignmentDto {
    storeId: number;
    storeName: string;
    modules: ModulePermissionDto[];
}

export interface EmployeeDto {
    id: string;
    name: string;
    lastName: string;
    username: string;
    role: string;
    storeAssignments: StoreAssignmentDto[];
}

export interface EmployeePageResponse {
    employees: EmployeeDto[];
    pageNo: number;
    pageSize: number;
    totalElements: number;
    totalPages: number;
    last: boolean;
}

export interface ModulePermissionRequest {
    moduleId: number;
    actions: string[];
}

export interface StoreAssignmentRequest {
    storeId: number;
    permissions: ModulePermissionRequest[];
}

export interface CreateEmployeeRequest {
    name: string;
    lastName: string;
    storeAssignments: StoreAssignmentRequest[];
}

export interface UpdateEmployeeRequest {
    name: string;
    lastName: string;
    storeAssignments: StoreAssignmentRequest[];
}
