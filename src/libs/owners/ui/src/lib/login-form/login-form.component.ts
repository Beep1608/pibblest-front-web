import { CommonModule } from "@angular/common";
import { Component, EventEmitter, inject, Input, Output } from "@angular/core";
import { FormBuilder, ReactiveFormsModule, Validators } from "@angular/forms";
import { email } from "@angular/forms/signals";
import { TranslatePipe } from "@ngx-translate/core";


@Component({
    selector: 'app-owner-login-form',
    standalone:true,
    imports:[CommonModule, ReactiveFormsModule, TranslatePipe],
    templateUrl: './login-form.component.html',
})
export class LoginFormComponent{
    private fb = inject(FormBuilder);

    @Input() isLoading = false;
    @Output() submitForm = new EventEmitter<any>();

    form = this.fb.nonNullable.group({
        email: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required]]
    });

    onSubmit() {
        if (this.form.valid){
            this.submitForm.emit(this.form.getRawValue());
        }
    }
}