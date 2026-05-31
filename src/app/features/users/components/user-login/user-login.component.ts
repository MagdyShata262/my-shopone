import { Component, ChangeDetectionStrategy, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
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
    MatProgressSpinnerModule
  ],
  template: `
    <div class="login-wrapper">
      @if (userService.isAuthenticated()) {
        <mat-card class="welcome-card">
          <mat-card-header>
            <div mat-card-avatar class="user-avatar">
              <mat-icon>account_circle</mat-icon>
            </div>
            <mat-card-title>Welcome, {{ userService.currentUser()?.firstName }}!</mat-card-title>
            <mat-card-subtitle>Role: {{ userService.currentUser()?.role | uppercase }}</mat-card-subtitle>
          </mat-card-header>
          <mat-card-content>
            <p>You are successfully authenticated. Explore the shop or manage your account.</p>
          </mat-card-content>
          <mat-card-actions align="end">
            <button mat-flat-button color="warn" (click)="userService.logout()">
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
                <input matInput formControlName="username" placeholder="Enter your username">
                <mat-icon matPrefix>person</mat-icon>
                @if (loginForm.controls.username.errors?.['required']) {
                  <mat-error>Username is required</mat-error>
                }
              </mat-form-field>

              <mat-form-field appearance="outline">
                <mat-label>Password</mat-label>
                <input matInput [type]="hidePassword() ? 'password' : 'text'" formControlName="password" placeholder="Enter your password">
                <mat-icon matPrefix>lock</mat-icon>
                <button mat-icon-button matSuffix (click)="hidePassword.set(!hidePassword())" type="button">
                  <mat-icon>{{ hidePassword() ? 'visibility_off' : 'visibility' }}</mat-icon>
                </button>
                @if (loginForm.controls.password.errors?.['required']) {
                  <mat-error>Password is required</mat-error>
                }
              </mat-form-field>

              @if (error()) {
                <div class="error-message">
                  <mat-icon>error</mat-icon>
                  <span>{{ error() }}</span>
                </div>
              }

              <button mat-raised-button color="primary" type="submit" [disabled]="loginForm.invalid || isLoading()" class="submit-btn">
                @if (isLoading()) {
                  <mat-spinner diameter="20"></mat-spinner>
                } @else {
                  LOGIN
                }
              </button>
            </form>
          </mat-card-content>
        </mat-card>
      }
    </div>
  `,
  styles: [`
    .login-wrapper {
      display: flex;
      justify-content: center;
      padding: 1rem;
    }
    .login-card, .welcome-card {
      width: 100%;
      max-width: 450px;
      border-radius: 16px;
    }
    .user-avatar {
      display: flex;
      align-items: center;
      justify-content: center;
      background: #e0e0e0;
      color: #757575;
      font-size: 2rem;
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
      gap: 0.5rem;
    }
    .submit-btn {
      height: 48px;
      margin-top: 1rem;
      font-weight: 600;
    }
    .error-message {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      color: #d32f2f;
      background: #ffebee;
      padding: 0.5rem;
      border-radius: 4px;
      font-size: 0.85rem;
      margin-top: 0.5rem;
    }
    mat-spinner {
      margin: 0 auto;
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserLoginComponent {
  private readonly fb = inject(FormBuilder);
  protected readonly userService = inject(UserService);

  isLoading = signal(false);
  error = signal<string | null>(null);
  hidePassword = signal(true);

  loginForm = this.fb.nonNullable.group({
    username: ['', [Validators.required]],
    password: ['', [Validators.required]],
  });

  async onSubmit() {
    if (this.loginForm.invalid) return;

    this.isLoading.set(true);
    this.error.set(null);

    try {
      await this.userService.login(this.loginForm.getRawValue());
    } catch (err) {
      this.error.set('Invalid username or password. Please try again.');
    } finally {
      this.isLoading.set(false);
    }
  }
}

