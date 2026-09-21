import { CanActivateFn, Router } from '@angular/router';
import { map } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';
import { inject } from '@angular/core';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);

  const router = inject(Router);

  const token = localStorage.getItem('token');

  if (!token) {
    return router.navigate(['/login']);
  }

  return authService.testToken(token).pipe(
    map((isValid) => {
      if (!isValid) {
        router.navigate(['/login']);
        return false;
      }
      return true;
    }),
  );
};
