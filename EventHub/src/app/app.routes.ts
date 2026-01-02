import { Routes } from '@angular/router';

/* ===== PUBLIC ===== */
import { Landing } from './public/landing/landing';
import { Login } from './auth/login/login';
import { Register } from './auth/register/register';

/* ===== ADMIN ===== */
import { AdminHome } from './admin/admin-home/admin-home';
import { AdminDashboard } from './admin/admin-dashboard/admin-dashboard';
import { ManageEvents } from './admin/manage-events/manage-events';
import { ManageUsers } from './admin/manage-users/manage-users';

/* ===== ORGANIZER ===== */
import { OrganizerHome } from './organizer/organizer-home/organizer-home';

import { CreateEvent } from './organizer/create-event/create-event';
import { MyEvent } from './organizer/my-event/my-event';
import { CategoryEvent } from './organizer/category-event/category-event';
import { EventDetails } from './organizer/event-details/event-details';
import { ModifyEventsOrg } from './organizer/modify-events-org/modify-events-org';
import { RegisteredStudent } from './organizer/registered-student/registered-student';

/* ===== STUDENT ===== */
import { StudentHome } from './student/student-home/student-home';
import { StudentDashboard } from './student/student-dashboard/student-dashboard';
import { StudentRegistrations } from './student/student-registrations/student-registrations';
import { StudentCategoryEvents } from './student/student-category-events/student-category-events';
import { StudentEventDetails } from './student/student-event-details/student-event-details';
import { StudentViewEvents } from './student/student-view-events/student-view-events';

/* ===== GUARDS ===== */
import { authGuard } from './core/guards/auth-guard';
import { roleGuard } from './core/guards/role-guard';

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
    {
    path: 'student/student-category-events',
    component: StudentCategoryEvents,
    canActivate: [authGuard, roleGuard],
    data: { role: 'student' }
  },
 {
  path: 'student/event-details/:id',     // 🔥 FIXED
  component: StudentEventDetails,        // 🔥 FIXED
  canActivate: [authGuard, roleGuard],
  data: { role: 'student' },
  runGuardsAndResolvers: 'always'   
},
  /* ===== ORGANIZER ===== */
  {
    path: 'organizer',
    component: OrganizerHome,
    canActivate: [authGuard, roleGuard],
    data: { role: 'organizer' }
  },
  {
    path: 'organizer/create-event',
    component: CreateEvent,
    canActivate: [authGuard, roleGuard],
    data: { role: 'organizer' }
  },
  {
    path: 'organizer/my-event',
    component: MyEvent,
    canActivate: [authGuard, roleGuard],
    data: { role: 'organizer' }
  },
  {
    path: 'organizer/category-event',
    component: CategoryEvent,
    canActivate: [authGuard, roleGuard],
    data: { role: 'organizer' }
  },
  {
    path: 'organizer/event-details/:id',
    component: EventDetails,
    canActivate: [authGuard, roleGuard],
    data: { role: 'organizer' }
  },
  {
    path: 'organizer/modify-events-org/:id',
    component: ModifyEventsOrg,
    canActivate: [authGuard, roleGuard],
    data: { role: 'organizer' }
  },
  {
    path: 'organizer/registered-student/:eventId',
    component: RegisteredStudent,
    canActivate: [authGuard, roleGuard],
    data: { role: 'organizer' }
  },

  /* ===== FALLBACK ===== */
  { path: '**', redirectTo: '' }
];
