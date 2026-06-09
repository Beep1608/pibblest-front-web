// src/libs/owners/data-access/src/lib/models/owner.model.ts
export interface RegisterOwnerDto {
    company: string;
    name: string;
    lastName: string;
    email: string;
    password: string;
}

export interface OwnerRegisterResponse {
    message: string;
    token: string;
}

// Renombrado a un DTO genérico e incluido el organizationCode opcional
export interface LoginCredentialsDto {
    email: string;
    password?: string;
    organizationCode?: string;
}

export interface LoginResponse {
    message: string;
    token: string;
}