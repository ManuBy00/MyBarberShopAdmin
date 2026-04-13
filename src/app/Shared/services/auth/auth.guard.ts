import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { AuthService } from './auth-service';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
    
  // Comprobamos si hay un token válido
  if (authService.getToken() && authService.isAdmin()) {
    return true; // Permite el acceso
  } else {
    // Si no hay token, lo mandamos al login
    router.navigate(['/login']);
    return false; // Bloqueamos el acceso
  }
};