// src/libs/employees/data-access/src/lib/services/employee-api.service.ts
import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CreateEmployeeRequest, EmployeeDto, EmployeePageResponse, UpdateEmployeeRequest } from '../models/employee.model';

@Injectable({
    providedIn: 'root'
})
export class EmployeeApiService {
    private http = inject(HttpClient);
    private readonly baseUrl = 'http://localhost:8081/api/employees';

    getAllEmployees(page = 0, size = 10, search = ''): Observable<EmployeePageResponse> {
        let params = new HttpParams().set('page', page.toString()).set('size', size.toString());
        if (search) {
            params = params.set('search', search);
        }
        return this.http.get<EmployeePageResponse>(this.baseUrl, { params });
    }

    getEmployeeById(id: string): Observable<EmployeeDto> {
        return this.http.get<EmployeeDto>(`${this.baseUrl}/${id}`);
    }

    createEmployee(request: CreateEmployeeRequest): Observable<{ message: string, activationLink: string }> {
        console.log("ApiService: Intentando POST a", this.baseUrl, request);
        return this.http.post<{ message: string, activationLink: string }>(this.baseUrl, request);
    }

    editEmployee(id: string, request: UpdateEmployeeRequest): Observable<{ message: string }> {
        console.log("ApiService: Intentando PUT a", `${this.baseUrl}/${id}`, request);
        return this.http.put<{ message: string }>(`${this.baseUrl}/${id}`, request);
    }

    deleteEmployee(id: string): Observable<void> {
        return this.http.delete<void>(`${this.baseUrl}/${id}`);
    }

    resendActivation(id: string): Observable<{ message: string, activationLink: string }> {
        return this.http.post<{ message: string, activationLink: string }>(`${this.baseUrl}/${id}/resend-activation`, {});
    }

    activateAccount(token: string, password: string): Observable<{ message: string }> {
        return this.http.post<{ message: string }>(`${this.baseUrl}/activate`, { token, password });
    }
}
