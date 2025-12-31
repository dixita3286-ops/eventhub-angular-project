import { Routes } from '@angular/router';

import { Landing } from './public/landing/landing';
import { Login } from './auth/login/login';
import { Register } from './auth/register/register';

// ADMIN
import { AdminHome } from './admin/admin-home/admin-home';
import { AdminDashboard } from './admin/admin-dashboard/admin-dashboard';
import { ManageEvents } from './admin/manage-events/manage-events';
import { ManageUsers } from './admin/manage-users/manage-users';

// ORGANIZER
import { OrganizerHome } from './organizer/organizer-home/organizer-home';
import { OrganizerDashboard } from './organizer/organizer-dashboard/organizer-dashboard';
import { CreateEvents } from './organizer/create-events/create-events';
import { MyEvents } from './organizer/my-events/my-events';

// STUDENT
import { StudentHome } from './student/student-home/student-home';
import { StudentDashboard } from './student/student-dashboard/student-dashboard';
import { StudentRegistrations } from './student/student-registrations/student-registrations';

// GUARDS
import { authGuard } from './core/guards/auth-guard';
import { roleGuard } from './core/guards/role-guard';
import { StudentViewEvents } from './student/student-view-events/student-view-events';

export const routes: Routes = [

  /* ===== PUBLIC ===== */
  { path: '', component: Landing },
  { path: 'login', component: Login },
  { path: 'register', component: Register },

  /* ===== ADMIN ===== */
  {
    path: 'admin',
    component: AdminHome,
    canActivate: [authGuard, roleGuard],
    data: { role: 'admin' }
  },
  {
    path: 'admin/dashboard',
    component: AdminDashboard,
    canActivate: [authGuard, roleGuard],
    data: { role: 'admin' }
  },
  {
    path: 'admin/manage-events',
    component: ManageEvents,
    canActivate: [authGuard, roleGuard],
    data: { role: 'admin' }
  },
  {
    path: 'admin/manage-users',
    component: ManageUsers,
    canActivate: [authGuard, roleGuard],
    data: { role: 'admin' }
  },

  /* ===== STUDENT ===== */
  {
    path: 'student',
    component: StudentHome,
    canActivate: [authGuard, roleGuard],
    data: { role: 'student' }
  },
  {
    path: 'student/dashboard',
    component: StudentDashboard,
    canActivate: [authGuard, roleGuard],
    data: { role: 'student' }
  },
  {
    path: 'student/registrations',
    component: StudentRegistrations,
    canActivate: [authGuard, roleGuard],
    data: { role: 'student' }
  },
  {
    path: 'student/view-events',
    component: StudentViewEvents,
    canActivate: [authGuard, roleGuard],
    data: { role: 'student' }
  },

  /* ===== ORGANIZER ===== */
  {
    path: 'organizer',
    component: OrganizerHome,
    canActivate: [authGuard, roleGuard],
    data: { role: 'organizer' }
  },
  {
    path: 'organizer/dashboard',
    component: OrganizerDashboard,
    canActivate: [authGuard, roleGuard],
    data: { role: 'organizer' }
  },
  {
    path: 'organizer/create-event',
    component: CreateEvents,
    canActivate: [authGuard, roleGuard],
    data: { role: 'organizer' }
  },
  {
    path: 'organizer/my-events',
    component: MyEvents,
    canActivate: [authGuard, roleGuard],
    data: { role: 'organizer' }
  }
];
