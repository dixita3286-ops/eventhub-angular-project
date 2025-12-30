import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';

export const roleGuard: CanActivateFn = (route) => {
  const router = inject(Router);
  const user = JSON.parse(localStorage.getItem('user') || 'null');

  if (!user) {
    return router.createUrlTree(['/login']);
  }

  const allowedRole = route.data?.['role'];

  if (user.role === allowedRole) {
    return true;
  }

  // wrong role → redirect to own dashboard
  return router.createUrlTree([`/${user.role}`]);
};
