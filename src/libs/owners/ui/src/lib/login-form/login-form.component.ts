// src/libs/owners/ui/src/lib/login-form/login-form.component.ts
import { CommonModule } from "@angular/common";
import { Component, inject, input, output, signal } from "@angular/core";
import { FormBuilder, ReactiveFormsModule, Validators } from "@angular/forms";
import { TranslatePipe } from "@ngx-translate/core";

@Component({
  selector: 'app-owner-login-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, TranslatePipe],
  templateUrl: './login-form.component.html',
  styles: [`
    @keyframes slideDown {
      from { opacity: 0; transform: translateY(-10px); }
      to { opacity: 1; transform: translateY(0); }
    }
    .animate-slide-down {
      animation: slideDown 0.3s ease-out forwards;
    }
  `]
})
export class LoginFormComponent {
  private fb = inject(FormBuilder);

  isLoading = input<boolean>(false);
  submitForm = output<any>();

  loginType = signal<'owner' | 'employee'>('owner');

  form = this.fb.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]],
    organizationCode: ['']
  });

  onToggleChange(event: Event) {
    const isChecked = (event.target as HTMLInputElement).checked;
    this.toggleLoginType(isChecked ? 'employee' : 'owner');
  }

  toggleLoginType(type: 'owner' | 'employee') {
    this.loginType.set(type);
    
    const orgControl = this.form.controls.organizationCode;
    const identifierControl = this.form.controls.email; // Usado para email o username
    
    if (type === 'employee') {
      orgControl.setValidators([Validators.required]);
      // Si es empleado, solo es requerido, NO tiene que ser un correo
      identifierControl.setValidators([Validators.required]);
    } else {
      orgControl.clearValidators();
      orgControl.setValue('');
      // Si es dueño, obligatoriamente debe ser un formato de correo válido
      identifierControl.setValidators([Validators.required, Validators.email]);
    }
    
    orgControl.updateValueAndValidity();
    identifierControl.updateValueAndValidity();
  }

  onSubmit() {
    if (this.form.valid) {
      const rawData = this.form.getRawValue();
      if (this.loginType() === 'owner') {
        delete (rawData as any).organizationCode;
      }
      this.submitForm.emit(rawData);
    } else {
      this.form.markAllAsTouched();
    }
  }
}