import { Routes } from '@angular/router';

import { Login } from './auth/login/login';
import { AdminDashboard } from './admin/dashboard/dashboard';
import { StudentDashboard } from './student/dashboard/dashboard';
import { OrganizerDashboard } from './organizer/dashboard/dashboard';

import { authGuard } from './core/guards/auth-guard';
import { roleGuard } from './core/guards/role-guard';

export const routes: Routes = [
  { path: '', component: Login },

  {
    path: 'admin',
    component: AdminDashboard,
    canActivate: [authGuard, roleGuard],
    data: { role: 'admin' }
  },

  {
    path: 'student',
    component: StudentDashboard,
    canActivate: [authGuard, roleGuard],
    data: { role: 'student' }
  },

  {
    path: 'organizer',
    component: OrganizerDashboard,
    canActivate: [authGuard, roleGuard],
    data: { role: 'organizer' }
  }
];
