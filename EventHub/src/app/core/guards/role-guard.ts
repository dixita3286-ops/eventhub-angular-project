import { CanActivateFn, ActivatedRouteSnapshot, Router } from '@angular/router';
import { inject } from '@angular/core';

export const roleGuard: CanActivateFn = (route: ActivatedRouteSnapshot) => {

  const router = inject(Router);
  const userStr = localStorage.getItem('user');

  if (!userStr) {
    router.navigate(['/login']);
    return false;
  }

  const user = JSON.parse(userStr);
  const allowedRole = route.data['role'];

  if (user.role === allowedRole) {
    return true; // ✅ correct role
  }

  // ❌ wrong role → redirect to OWN dashboard
  if (user.role === 'student') {
    router.navigate(['/student']);
  } else if (user.role === 'admin') {
    router.navigate(['/admin']);
  } else if (user.role === 'organizer') {
    router.navigate(['/organizer']);
  }

  return false;
};
