import { Product } from "../../../products/data-access/lib/models/product.model";

export interface Sale{
    productId: number,
    quantity: number
}

export interface SaleCreateDto{
    storeId: number,
    items: Sale[]
}

export interface SaleCreateResponse{
    message: string
}

