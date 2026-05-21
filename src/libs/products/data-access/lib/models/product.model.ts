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
    tags: Tag[]

}

export interface ProductPageResponse{
    pageNo: number,
    pageSize: number,
    totalElements: number,
    totalPages: number,
    lats: boolean,
    products: Product[]
}