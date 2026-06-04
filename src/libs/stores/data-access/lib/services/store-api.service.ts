// src/libs/stores/data-access/lib/services/store-api.service.ts
import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CreateStoreDto, Store, StorePaginationResponse, StorePreview, UpdateStoreRequest } from '../models/store.model';

@Injectable({
  providedIn: 'root',
})
export class StoreApiService {
  private http = inject(HttpClient);
  private readonly base_url = 'http://localhost:8081/api/stores';

  // ✨ Único endpoint para listar y buscar. Garantiza que NO vengan las eliminadas.
  getStores(keyword: string = '', page = 0, size = 10, sort = 'id,desc'): Observable<StorePaginationResponse> {
    let params = new HttpParams()
      .set('keyword', keyword)
      .set('page', page.toString())
      .set('size', size.toString())
      .set('sort', sort);

    return this.http.get<StorePaginationResponse>(`${this.base_url}/search`, { params });
  }

  createStore(dto: CreateStoreDto): Observable<Store> {
    return this.http.post<Store>(`${this.base_url}/create`, dto);
  }

  updateStore(id: number, dto: UpdateStoreRequest): Observable<Store> {
    return this.http.put<Store>(`${this.base_url}/edit/${id}`, dto);
  }

  deleteStore(id: number): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.base_url}/${id}`);
  }

  listenToStoreStream(token: string): Observable<Partial<StorePreview>> {
    return new Observable((subscriber) => {
      const eventSource = new EventSource(`${this.base_url}/stream/storePreview?token=${encodeURIComponent(token)}`);
      const processData = (event: MessageEvent) => {
        try {
          const storeUpdate: Partial<StorePreview> = JSON.parse(event.data);
          subscriber.next(storeUpdate);
        } catch (error) {
          console.error('error al convertir json del sse', error);
        }
      };

      eventSource.addEventListener('STORE_UPDATE', processData);

      eventSource.onerror = (error) => {
        console.error('SSE Error: ', error);
      };

      return () => {
        eventSource.close();
        console.log('Conexion SSE cerrada');
      };
    });
  }
}
