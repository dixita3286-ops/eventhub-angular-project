import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const user = sessionStorage.getItem('user');

  // 🔥 PUBLIC ROUTES (NO ROLE REQUIRED)
  if (!route.data || !route.data['role']) {
    return true;
  }

  // 🔒 PROTECTED ROUTES
  if (!user) {
    router.navigate(['/login']);
    return false;
  }

  return true;
};
