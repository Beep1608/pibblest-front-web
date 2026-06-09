// src/app/auth/feature-activate/activate-account.component.ts
import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { EmployeeApiService } from '../../../libs/employees/data-access/src/lib/services/employee-api.service';

@Component({
  selector: 'app-activate-account',
  standalone: true,
  imports: [ReactiveFormsModule],
  template: `
    <div class="flex h-screen items-center justify-center bg-base-200">
      <div class="card w-96 bg-base-100 shadow-xl p-8">
        <h2 class="text-xl font-bold mb-4">Activar cuenta</h2>
        <form [formGroup]="form" (ngSubmit)="activate()" class="space-y-4">
          <input type="password" formControlName="password" placeholder="Nueva contraseña" class="input input-bordered w-full" />
          <button class="btn btn-primary w-full" [disabled]="form.invalid || loading()">
            {{ loading() ? 'Activando...' : 'Finalizar Registro' }}
          </button>
        </form>
      </div>
    </div>
  `
})
export class ActivateAccountComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private api = inject(EmployeeApiService);
  private fb = inject(FormBuilder);
  
  loading = signal(false);
  token = '';
  form = this.fb.nonNullable.group({ password: ['', Validators.required] });

  ngOnInit() {
    this.token = this.route.snapshot.queryParams['token'] || '';
  }

  activate() {
    const passwordVal = this.form.value.password;
    if (!this.token || !passwordVal) return;

    this.loading.set(true);
    this.api.activateAccount(this.token, passwordVal).subscribe({
      next: () => {
        this.loading.set(false);
        this.router.navigate(['/login']);
      },
      error: (err) => {
        this.loading.set(false);
        console.error("Error al activar cuenta:", err);
      }
    });
  }
}
