import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { LoginOwnerDto, LoginOwnerResponse, OwnerRegisterResponse, RegisterOwnerDto } from "../models/owner.model";
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})

export class OwnerApiService {

    private http = inject(HttpClient);

    private readonly base_url = "http://localhost:8081/api";

    register(dto: RegisterOwnerDto): Observable<OwnerRegisterResponse>{
        return this.http.post<OwnerRegisterResponse>(`${this.base_url}/owners/register`,dto);
    }

    login(dto: LoginOwnerDto): Observable<LoginOwnerResponse>{
        return this.http.post<LoginOwnerResponse>(`${this.base_url}/login`,dto);
    }

    verifyEmail(token: string): Observable<any> {
        return this.http.get<any>(`${this.base_url}/owners/verify?token=${token}`)
    }
}