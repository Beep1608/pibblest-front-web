// src/libs/sales/data-access/models/sale.model.ts
import { Product } from "../../../products/data-access/lib/models/product.model";

// Modelos de creación
export interface Sale {
    productId: number;
    quantity: number;
}

export interface SaleCreateDto {
    storeId: number;
    items: Sale[];
}

export interface SaleCreateResponse {
    message: string;
}

// ✨ FIX: Nuevos modelos para el historial de ventas
export interface SaleDetailDto {
    id: number;
    productId: number;
    productName: string;
    quantity: number;
    unitPrice: number;
    subtotal: number;
}

export interface SaleDto {
    id: number;
    storeId: number;
    totalAmount: number;
    status: string;
    createdAt: string;
    employeeUsername: string;
    details: SaleDetailDto[];
}

export interface SalePaginationResponse {
    sales: SaleDto[];
    pageNo: number;
    pageSize: number;
    totalElements: number;
    totalPages: number;
    last: boolean;
}
