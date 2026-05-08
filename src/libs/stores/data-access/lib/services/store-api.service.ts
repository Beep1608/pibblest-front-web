import { HttpClient, HttpParams } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { SpringPage } from "../../../../shared/data-access/models/sort.model";
import { StorePaginationResponse, StorePreview } from "../models/store.model";


@Injectable({
  providedIn: 'root',
})
export class StoreApiService {
  private http = inject(HttpClient);

  private readonly base_url = 'http://localhost:8081/api/stores';

  getAllStores(page = 0, size = 10, sort= 'id,asc'): Observable<StorePaginationResponse>{
    let params = new HttpParams()
    .set('page', page.toString())
    .set('size', size.toString())
    .set('sort', sort);

    return this.http.get<StorePaginationResponse>(`${this.base_url}/all`, {
      params,
    });
  }
}