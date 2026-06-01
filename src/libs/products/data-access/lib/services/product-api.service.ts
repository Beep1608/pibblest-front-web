// src/libs/products/data-access/lib/services/product-api.service.ts
import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ProductPageResponse } from '../models/product.model';

@Injectable({
	providedIn: 'root',
})
export class ProductApiService {
	private http = inject(HttpClient);

	private readonly baseUrl = 'http://localhost:8081/api/products';

	getAllProducts(storeId: number, keyword: string | null, page = 0, size = 10): Observable<ProductPageResponse> {
		let params = new HttpParams();

		if (keyword?.trim()) {
			console.log('Llegó la keyword:', keyword);
			// ¡IMPORTANTE: reasignar la variable!
			params = params.set('keyword', keyword);
		}

		// Reasignar también aquí
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

		// Apuntamos al endpoint global /api/products/all según el controlador backend
		return this.http.get<ProductPageResponse>(`${this.baseUrl}/all`, { params });
	}
}
