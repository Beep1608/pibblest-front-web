// src/libs/tags/data-access/services/tag-api.service.ts
import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { TagPageResponse, CreateTagRequest, Tag } from '../models/tag.model';

@Injectable({
    providedIn: 'root',
})
export class TagApiService {
    private http = inject(HttpClient);
    private readonly baseUrl = 'http://localhost:8081/api/tags';

    // STORES TAGS
    getAllStoreTags(keyword: string | null, page = 0, size = 10): Observable<TagPageResponse> {
        let params = new HttpParams()
            .set('page', page.toString())
            .set('size', size.toString());
            
        if (keyword && keyword.trim() !== '') {
            params = params.set('keyword', keyword.trim());
        }
        return this.http.get<TagPageResponse>(`${this.baseUrl}/all`, { params });
    }

    getAllStoreTagsList(): Observable<{ tags: Tag[] }> {
        return this.http.get<{ tags: Tag[] }>(`${this.baseUrl}/stores/list`);
    }

    createStoreTag(request: CreateTagRequest): Observable<{ tag: Tag }> {
        return this.http.post<{ tag: Tag }>(`${this.baseUrl}/create`, request);
    }

    updateStoreTag(id: number, request: CreateTagRequest): Observable<{ message: string }> {
        return this.http.put<{ message: string }>(`${this.baseUrl}/edit/${id}`, request);
    }

    deleteStoreTag(id: number): Observable<{ message: string }> {
        return this.http.delete<{ message: string }>(`${this.baseUrl}/${id}`);
    }

    // PRODUCTS TAGS
    getAllProductTags(keyword: string | null, page = 0, size = 10): Observable<TagPageResponse> {
        let params = new HttpParams()
            .set('page', page.toString())
            .set('size', size.toString());
        
        if (keyword && keyword.trim() !== '') {
            params = params.set('keyword', keyword.trim());
        }
        return this.http.get<TagPageResponse>(`${this.baseUrl}/get-all-products`, { params });
    }

    getAllProductTagsList(): Observable<{ tags: Tag[] }> {
        return this.http.get<{ tags: Tag[] }>(`${this.baseUrl}/products/list`);
    }

    createProductTag(request: CreateTagRequest): Observable<{ message: string }> {
        return this.http.post<{ message: string }>(`${this.baseUrl}/create-to-products`, request);
    }

    updateProductTag(id: number, request: CreateTagRequest): Observable<{ message: string }> {
        return this.http.put<{ message: string }>(`${this.baseUrl}/products/edit/${id}`, request);
    }

    deleteProductTag(id: number): Observable<{ message: string }> {
        return this.http.delete<{ message: string }>(`${this.baseUrl}/products/${id}`);
    }
}
