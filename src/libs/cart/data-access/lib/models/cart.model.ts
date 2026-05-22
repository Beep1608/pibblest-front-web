import { Product } from "../../../../products/data-access/lib/models/product.model";

export interface CartItem {
    product: Product;
    quantity: number;
}
