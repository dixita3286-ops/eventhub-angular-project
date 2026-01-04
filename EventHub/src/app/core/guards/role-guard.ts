import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const roleGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const user = JSON.parse(sessionStorage.getItem('user') || 'null');

  // 🔥 ALLOW PUBLIC ROUTES
  if (!route.data || !route.data['role']) {
    return true;
  }

  if (!user) {
    router.navigate(['/login']);
    return false;
  }

  if (user.role !== route.data['role']) {
    router.navigate(['/login']);
    return false;
  }

  return true;
};
