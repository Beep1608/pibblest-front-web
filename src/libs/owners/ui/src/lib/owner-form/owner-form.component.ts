import { CommonModule } from "@angular/common";
import { Component, inject, input, output } from "@angular/core";
import { FormBuilder, ReactiveFormsModule, Validators } from "@angular/forms";
import { RegisterOwnerDto } from "../../../../data-access/src";
import { email, FormField } from "@angular/forms/signals";
@Component({
    selector: 'app-pos-owner-form',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule, FormField],
    templateUrl: './owner-form.component.html'
})
export class OwnerFormComponent {
    private fb = inject(FormBuilder);

    isLoading = input<boolean>(false);
    submitForm = output<RegisterOwnerDto>();
    
    form = this.fb.nonNullable.group({
        company: ['', [Validators.required, Validators.minLength(2)]],
        name: ['', Validators.required],
        lastName: ['', [Validators.required, Validators.minLength(2)]],
        email: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required, Validators.minLength(8)]]
    });

    onSubmit(){
        if(this.form.valid && !this.isLoading()){
            this.submitForm.emit(this.form.getRawValue());
        }else{
            this.form.markAllAsTouched();
        }
    }


}