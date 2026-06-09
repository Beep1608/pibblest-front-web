// src/libs/owners/feature-login/src/lib/login-page/login-page.component.ts
import { CommonModule } from "@angular/common";
import { Component, inject } from "@angular/core";
import { LoginFormComponent } from "../../../../ui/src";
import { LoginCredentialsDto, OwnerStore } from "../../../../data-access/src";
import { TranslatePipe } from "@ngx-translate/core";

@Component({
    selector: 'app-owner-login-page',
    standalone: true,
    imports: [CommonModule, LoginFormComponent, TranslatePipe],
    templateUrl: './login-page.component.html'
})
export class LoginPageComponent {
    readonly store = inject(OwnerStore);
    
    onLogin(credentials: LoginCredentialsDto) {
        this.store.login(credentials);
    }
}