// src/app/core/guards/owner-only.guard.ts
import { inject } from '@angular/core';
import { Router } from '@angular/router';

export const ownerOnlyGuard = () => {
  const router = inject(Router);
  const token = localStorage.getItem('pibblest_token');
  
  if (token) {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      if (payload.role === 'OWNER') return true;
    } catch (e) {
      console.error("Error al validar rol:", e);
    }
  }
  
  router.navigate(['/dashboard']);
  return false;
};
