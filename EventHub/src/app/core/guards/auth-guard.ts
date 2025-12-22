import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';

export const authGuard: CanActivateFn = () => {
  const router = inject(Router);
  const user = localStorage.getItem('user');

  if (user) {
    return true; // logged in → allow
  }

  // not logged in → redirect to login
  return router.createUrlTree(['/']);
};
