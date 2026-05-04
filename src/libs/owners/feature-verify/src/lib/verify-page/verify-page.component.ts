import { CommonModule } from "@angular/common";
import { Component, inject, OnInit } from "@angular/core";
import { ActivatedRoute, RouterModule } from "@angular/router";
import { OwnerStore } from "../../../../data-access/src";

@Component({
    selector: 'app-verify-page',
    standalone: true,
    imports: [CommonModule, RouterModule],
    templateUrl: './verify-page.component.html'
})
export class VerifyPageComponent implements OnInit{

    readonly store = inject(OwnerStore);
    private route = inject(ActivatedRoute);

    ngOnInit(): void {
        const token = this.route.snapshot.queryParamMap.get('token');
        if(token){
            this.store.verifyAccount(token);
        }else{
            this.store.setError('No se encontró ningún código de verificación en el enlace');
        }
    }
}