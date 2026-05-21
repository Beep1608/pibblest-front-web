import { HttpClient, HttpParams } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { SpringPage } from "../../../shared/data-access/models/sort.model";
import { Tag, TagPageResponse } from "../models/tag.model";

@Injectable({
  providedIn: 'root',
})
export class TagServiceApi {
  private http = inject(HttpClient);

  private readonly base_url = 'http://localhost:8081/api/tags';

  getAllTagsForProducts(keyword: string, page = 0, size = 10 ): Observable<TagPageResponse>{
    let params = new HttpParams()
    .set('keyword', keyword)
    .set('page', page.toString())
    .set('size', size.toString());

    return this.http.get<TagPageResponse>(`${this.base_url}/get-all-products`, {
      params,
    });
  }
}