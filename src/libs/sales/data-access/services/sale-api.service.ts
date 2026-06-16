// src/libs/sales/data-access/services/sale-api.service.ts
import { HttpClient, HttpParams } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { SaleCreateDto, SaleCreateResponse, SalePaginationResponse } from "../models/sale.model";
import { Observable } from "rxjs";
import { TicketResponse } from "../../../printing/services/printer.service";

@Injectable({
	providedIn: 'root',
})
export class SaleApiService {
	private http = inject(HttpClient);

	private readonly baseUrl = 'http://localhost:8081/api/sale';
    private readonly employeeUrl = 'http://localhost:8081/api/employees';

    createSale(dto: SaleCreateDto): Observable<SaleCreateResponse & { saleId?: number }>{
        return this.http.post<SaleCreateResponse & { saleId?: number }>(`${this.baseUrl}`, dto);
    }

    getTicket(saleId: number, storeId: number): Observable<TicketResponse> {
        return this.http.post<TicketResponse>(`${this.baseUrl}/ticket`, { saleId, storeId });
    }

    // ✨ FIX Hallazgo #1: Inyección dinámica de los parámetros de fecha y empleado
    getSalesByStore(
        storeId: number, 
        scope: string, 
        employeeId?: string | null,
        startDate?: string | null,
        endDate?: string | null,
        page = 0, 
        size = 10
    ): Observable<SalePaginationResponse> {
        let params = new HttpParams()
            .set('scope', scope)
            .set('page', page.toString())
            .set('size', size.toString());
            
        if (employeeId) params = params.set('employeeId', employeeId);
        if (startDate) params = params.set('startDate', startDate);
        if (endDate) params = params.set('endDate', endDate);
            
        return this.http.get<SalePaginationResponse>(`${this.baseUrl}/store/${storeId}`, { params });
    }

    cancelSale(id: number): Observable<{message: string}> {
        return this.http.put<{message: string}>(`${this.baseUrl}/${id}/cancel`, {});
    }

    deleteSale(id: number): Observable<void> {
        return this.http.delete<void>(`${this.baseUrl}/${id}`);
    }

    // ✨ FIX: Helper para poblar el dropdown de empleados
    getSimpleEmployeesByStore(storeId: number): Observable<{id: string, username: string}[]> {
        return this.http.get<{id: string, username: string}[]>(`${this.employeeUrl}/store/${storeId}/simple`);
    }
}