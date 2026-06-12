// src/libs/products/data-access/lib/services/product-api.service.ts
import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { 
    CreateProductRequest, 
    CreateProductResponse, 
    DeleteProductResponse,
    Product, 
    ProductPageResponse, 
    UpdateProductRequest, 
    UpdateProductResponse 
} from '../models/product.model';

@Injectable({
    providedIn: 'root',
})
export class ProductApiService {
    private http = inject(HttpClient);

    private readonly baseUrl = 'http://localhost:8081/api/products';

    getAllProducts(storeId: number, keyword: string | null, page = 0, size = 10): Observable<ProductPageResponse> {
        let params = new HttpParams();

        if (keyword?.trim()) {
            params = params.set('keyword', keyword);
        }

        params = params.set('page', page.toString());
        params = params.set('size', size.toString());

        return this.http.get<ProductPageResponse>(`${this.baseUrl}/${storeId.toString()}`, { params });
    }

    getUniverseProducts(keyword: string | null, page = 0, size = 10): Observable<ProductPageResponse> {
        let params = new HttpParams();

        if (keyword?.trim()) {
            params = params.set('keyword', keyword);
        }

        params = params.set('page', page.toString());
        params = params.set('size', size.toString());

        return this.http.get<ProductPageResponse>(`${this.baseUrl}/all`, { params });
    }

    createProduct(request: CreateProductRequest): Observable<CreateProductResponse> {
        return this.http.post<CreateProductResponse>(this.baseUrl, request);
    }

    getProductById(id: number): Observable<Product> {
        return this.http.get<Product>(`${this.baseUrl}/detail/${id}`);
    }

    editProduct(id: number, request: UpdateProductRequest): Observable<UpdateProductResponse> {
        return this.http.put<UpdateProductResponse>(`${this.baseUrl}/${id}`, request);
    }

    deleteProduct(id: number): Observable<DeleteProductResponse> {
        return this.http.delete<DeleteProductResponse>(`${this.baseUrl}/${id}`);
    }

    // ✨ FIX BUG 1 & 2: Nuevas rutas y estructuras de payload exactas para el backend

    assignProductToStore(storeId: number, productId: number, desiredQuantity: number): Observable<{message: string}> {
        // Payload estructurado según AssignProductsToStoreRequest (Lista de items)
        const payload = {
            items: [
                { productId: productId, quantity: desiredQuantity }
            ]
        };
        return this.http.post<{message: string}>(`${this.baseUrl}/store/${storeId}/associate`, payload);
    }

    updateStoreProductStock(storeId: number, productId: number, desiredQuantity: number, currentQuantity: number): Observable<{message: string}> {
        // Payload estructurado según UpdateStoreProductQuantitiesRequest
        const payload = { desiredQuantity, currentQuantity };
        return this.http.put<{message: string}>(`${this.baseUrl}/store/${storeId}/quantities/${productId}`, payload);
    }

    removeProductFromStore(storeId: number, productId: number): Observable<{message: string}> {
        // Payload estructurado según DissociateProductsRequest (Lista de productIds enviada en el body de un DELETE)
        const payload = {
            productIds: [productId]
        };
        return this.http.delete<{message: string}>(`${this.baseUrl}/store/${storeId}/associations`, { body: payload });
    }
}
