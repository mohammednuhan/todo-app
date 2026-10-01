import { HttpClient } from '@angular/common/http';
import { Injectable, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';

const TOKEN_KEY = 'tode_token';
const USERNAME_KEY = 'tode_username';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);

  readonly username = signal<string | null>(localStorage.getItem(USERNAME_KEY));

  get token(): string | null {
    return localStorage.getItem(TOKEN_KEY);
  }

  get isLoggedIn(): boolean {
    return this.token !== null;
  }

  signup(username: string, password: string): Observable<{ message: string }> {
    return this.http.post<{ message: string }>('/api/signup', { username, password });
  }

  signin(username: string, password: string): Observable<{ token: string }> {
    return this.http
      .post<{ token: string }>('/api/signin', { username, password })
      .pipe(tap(({ token }) => this.storeToken(token, username)));
  }

  logout(): void {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USERNAME_KEY);
    this.username.set(null);
    this.router.navigate(['/signin']);
  }

  private storeToken(token: string, username: string): void {
    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(USERNAME_KEY, username);
    this.username.set(username);
  }
}
