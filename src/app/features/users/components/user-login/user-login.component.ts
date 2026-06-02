import { Component, ChangeDetectionStrategy, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { RouterLink } from '@angular/router';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-user-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule,
    MatIconModule,
    MatProgressSpinnerModule,
    RouterLink,
  ],
  template: `
    <div class="login-wrapper">
      @if (userService.isAuthenticated()) {
        <mat-card class="welcome-card">
          <mat-card-header>
            <div mat-card-avatar class="user-avatar">
              <img
                [src]="userService.currentUser()?.image"
                [alt]="userService.currentUser()?.firstName"
                class="avatar-img"
              />
            </div>
            <mat-card-title>Welcome, {{ userService.currentUser()?.firstName }}!</mat-card-title>
            <mat-card-subtitle
              >Role: {{ userService.currentUser()?.role | uppercase }}</mat-card-subtitle
            >
          </mat-card-header>
          <mat-card-content class="welcome-content">
            <p>You are successfully authenticated. Explore the shop or manage your account.</p>
          </mat-card-content>
          <mat-card-actions align="end">
            <button mat-flat-button class="mat-warn" (click)="userService.logout()">
              <mat-icon>logout</mat-icon>
              LOGOUT
            </button>
          </mat-card-actions>
        </mat-card>
      } @else {
        <mat-card class="login-card">
          <mat-card-header>
            <mat-card-title>Login</mat-card-title>
            <mat-card-subtitle>Access your personalized dashboard</mat-card-subtitle>
          </mat-card-header>

          <mat-card-content>
            <div class="hint-box">
              <mat-icon>info</mat-icon>
              <span>Try: <b>emilys</b> / <b>emilyspass</b></span>
            </div>

            <form [formGroup]="loginForm" (ngSubmit)="onSubmit()" class="login-form">
              <mat-form-field appearance="outline">
                <mat-label>Username</mat-label>
                <input
                  matInput
                  formControlName="username"
                  placeholder="Enter your username"
                  autocomplete="username"
                />
                <mat-icon matPrefix>person</mat-icon>
                @if (usernameControl.hasError('required') && usernameControl.touched) {
                  <mat-error>Username is required</mat-error>
                }
              </mat-form-field>

              <mat-form-field appearance="outline">
                <mat-label>Password</mat-label>
                <input
                  matInput
                  [type]="hidePassword() ? 'password' : 'text'"
                  formControlName="password"
                  placeholder="Enter your password"
                  autocomplete="current-password"
                />
                <mat-icon matPrefix>lock</mat-icon>
                <button
                  mat-icon-button
                  matSuffix
                  (click)="togglePasswordVisibility($event)"
                  type="button"
                >
                  <mat-icon>{{ hidePassword() ? 'visibility_off' : 'visibility' }}</mat-icon>
                </button>
                @if (passwordControl.hasError('required') && passwordControl.touched) {
                  <mat-error>Password is required</mat-error>
                }
              </mat-form-field>

              @if (error()) {
                <div class="error-message">
                  <mat-icon>error</mat-icon>
                  <span>{{ error() }}</span>
                </div>
              }

              <button
                mat-flat-button
                color="primary"
                type="submit"
                [disabled]="loginForm.invalid || isLoading()"
                class="submit-btn"
              >
                @if (isLoading()) {
                  <mat-spinner diameter="24"></mat-spinner>
                } @else {
                  LOGIN
                }
              </button>
            </form>

            <div class="register-prompt">
              Don't have an account? <a routerLink="/register">Create one</a>
            </div>
          </mat-card-content>
        </mat-card>
      }
    </div>
  `,
  styles: [
    `
      .login-wrapper {
        display: flex;
        justify-content: center;
        padding: 2rem 1rem;
      }
      .login-card,
      .welcome-card {
        width: 100%;
        max-width: 450px;
        border-radius: 16px;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
      }
      .user-avatar {
        display: flex;
        align-items: center;
        justify-content: center;
        overflow: hidden;
        background: #f5f5f5;
      }
      .avatar-img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
      .hint-box {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        background: #e3f2fd;
        color: #1976d2;
        padding: 0.75rem;
        border-radius: 8px;
        margin-bottom: 1.5rem;
        font-size: 0.9rem;
      }
      .login-form {
        display: flex;
        flex-direction: column;
        gap: 0.75rem;
      }
      .welcome-content {
        padding: 1rem 0;
      }
      .submit-btn {
        height: 48px;
        margin-top: 1rem;
        font-weight: 600;
        font-size: 1rem;
      }
      .error-message {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        color: #d32f2f;
        background: #ffebee;
        padding: 0.75rem;
        border-radius: 8px;
        font-size: 0.85rem;
        margin-top: 0.25rem;
      }
      .register-prompt {
        text-align: center;
        margin-top: 1.5rem;
        font-size: 0.9rem;
        color: var(--mat-sys-on-surface-variant);
        a { color: var(--mat-sys-primary); font-weight: 500; text-decoration: none; }
      }
      mat-spinner {
        margin: 0 auto;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserLoginComponent {
  private readonly fb = inject(FormBuilder);
  protected readonly userService = inject(UserService);

  readonly isLoading = signal(false);
  readonly error = signal<string | null>(null);
  readonly hidePassword = signal(true);

  readonly loginForm = this.fb.nonNullable.group({
    username: ['', [Validators.required]],
    password: ['', [Validators.required]],
  });

  // Getters لتسهيل الوصول للحقول وقراءة الأخطاء بشكل أنظف
  get usernameControl() {
    return this.loginForm.controls.username;
  }

  get passwordControl() {
    return this.loginForm.controls.password;
  }

  togglePasswordVisibility(event: MouseEvent) {
    event.preventDefault(); // منع أي تأثير جانبي على الـ Form
    this.hidePassword.set(!this.hidePassword());
  }

  async onSubmit() {
    if (this.loginForm.invalid || this.isLoading()) return;

    this.isLoading.set(true);
    this.error.set(null);

    try {
      await this.userService.login(this.loginForm.getRawValue());
      this.loginForm.reset(); // إفراغ الحقول فور النجاح الأمن
    } catch (err) {
      this.error.set('Invalid username or password. Please try again.');
    } finally {
      this.isLoading.set(false);
    }
  }
}
