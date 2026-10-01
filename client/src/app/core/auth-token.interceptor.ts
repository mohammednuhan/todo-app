import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { AuthService } from './auth.service';

export const authTokenInterceptor: HttpInterceptorFn = (req, next) => {
  const auth = inject(AuthService);
  const router = inject(Router);

  const isApiCall = req.url.startsWith('/api');
  const needsAuth = isApiCall && !req.url.includes('/signin') && !req.url.includes('/signup');

  const authorizedReq = needsAuth && auth.token
    ? req.clone({ setHeaders: { token: auth.token } })
    : req;

  return next(authorizedReq).pipe(
    catchError((err: HttpErrorResponse) => {
      if (err.status === 403 && auth.isLoggedIn) {
        auth.logout();
        router.navigate(['/signin']);
      }
      return throwError(() => err);
    })
  );
};
