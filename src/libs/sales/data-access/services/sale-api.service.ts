import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { SaleCreateDto } from "../models/sale.model";
import { Observable } from "rxjs";

@Injectable({
	providedIn: 'root',
})
export class SaleApiService {
	private http = inject(HttpClient);

	private readonly baseUrl = 'http://localhost:8081/api/sale';

    createSale(dto: SaleCreateDto): Observable<string>{
        return this.http.post<string>(`${this.baseUrl}`,dto);
    }

}