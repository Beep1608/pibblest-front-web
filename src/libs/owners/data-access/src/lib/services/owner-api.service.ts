import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { OwnerRegisterResponse, RegisterOwnerDto } from "../models/owner.model";
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})

export class OwnerApiService {

    private http = inject(HttpClient);

    private readonly API_URL = "/api/v1/owners";

    register(dto: RegisterOwnerDto): Observable<OwnerRegisterResponse>{
        return this.http.post<OwnerRegisterResponse>(this.API_URL,dto);
    }
}