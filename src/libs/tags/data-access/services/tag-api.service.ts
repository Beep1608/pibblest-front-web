// src/libs/tags/data-access/services/tag-api.service.ts
import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { GetAllProductTagsListResponse } from '../models/tag.model';

@Injectable({
    providedIn: 'root',
})
export class TagApiService {
    private http = inject(HttpClient);
    private readonly baseUrl = 'http://localhost:8081/api/tags';

    getAllProductTagsList(): Observable<GetAllProductTagsListResponse> {
        return this.http.get<GetAllProductTagsListResponse>(`${this.baseUrl}/products/list`);
    }
}
