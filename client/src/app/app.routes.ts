import { Routes } from '@angular/router';
import { authGuard, guestGuard } from './core/auth.guard';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'signin' },
  {
    path: 'signin',
    canActivate: [guestGuard],
    loadComponent: () => import('./pages/signin/signin').then((m) => m.Signin)
  },
  {
    path: 'signup',
    canActivate: [guestGuard],
    loadComponent: () => import('./pages/signup/signup').then((m) => m.Signup)
  },
  {
    path: 'todos',
    canActivate: [authGuard],
    loadComponent: () => import('./pages/todos/todos').then((m) => m.Todos)
  },
  { path: '**', redirectTo: 'signin' }
];
