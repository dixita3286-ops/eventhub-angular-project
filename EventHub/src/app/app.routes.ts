import { Routes } from '@angular/router';

import { Landing } from './public/landing/landing';
import { Login } from './auth/login/login';
import { Register } from './auth/register/register';

import { AdminHome } from './admin/admin-home/admin-home';
import { OrganizerHome } from './organizer/organizer-home/organizer-home';

import { StudentHome } from './student/student-home/student-home';
import { StudentDashboard } from './student/student-dashboard/student-dashboard';

import { authGuard } from './core/guards/auth-guard';
import { roleGuard } from './core/guards/role-guard';

export const routes: Routes = [
  { path: '', component: Landing },
  { path: 'login', component: Login },
  { path: 'register', component: Register },

  {
    path: 'admin',
    component: AdminHome,
    canActivate: [authGuard, roleGuard],
    data: { role: 'admin' }
  },

  {
  path: 'student',
  canActivate: [authGuard, roleGuard],
  data: { role: 'student' },
  children: [
    { path: '', component: StudentHome },          // HOME
    { path: 'dashboard', component: StudentDashboard } // DASHBOARD
  ]
}
,

  {
    path: 'organizer',
    component: OrganizerHome,
    canActivate: [authGuard, roleGuard],
    data: { role: 'organizer' }
  }
];
