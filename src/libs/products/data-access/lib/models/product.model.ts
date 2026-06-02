import { Tag } from "../../../../tags/data-access/models/tag.model"

export interface Product{
    id: number,
    name: string,
    description: string,
    brand: string,
    barcode: string,
    sku: string,
    basePrice: number,
    cost: number,
    quantity: number,
    desiredQuantity:number,
    currentQuantity: number,
    tags: Tag[]
}

export interface ProductPageResponse{
    pageNo: number,
    pageSize: number,
    totalElements: number,
    totalPages: number,
    last: boolean,
    products: Product[]
}

export interface CreateProductRequest {
    name: string;
    sku: string;
    barcode: string;
    description: string;
    brand: string;
    basePrice: number;
    cost: number;
    quantity: number;
}

export interface CreateProductResponse {
    id: number;
    message: string;
}

export interface UpdateProductRequest {
    name: string;
    sku: string;
    barcode: string;
    description: string;
    brand: string;
    basePrice: number;
    cost: number;
    quantity: number;
}

export interface UpdateProductResponse {
    id: number;
    message: string;
}

export interface DeleteProductResponse {
    message?: string;
}