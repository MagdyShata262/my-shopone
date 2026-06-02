import { Component, ChangeDetectionStrategy, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { Router, RouterLink } from '@angular/router';
import {
  form,
  FormField,
  submit,
  required,
  email,
  minLength,
  validate,
} from '@angular/forms/signals';

import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-user-register',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule,
    MatIconModule,
    MatSnackBarModule,
    RouterLink,
    FormField,
  ],
  template: `
    <div class="register-wrapper">
      <mat-card class="register-card">
        <mat-card-header>
          <mat-card-title>Create Account</mat-card-title>
          <mat-card-subtitle>Join Smart Recipe Box today</mat-card-subtitle>
        </mat-card-header>

        <mat-card-content>
          <form class="register-form">
            <div class="form-row grid-2">
              <mat-form-field appearance="outline">
                <mat-label>First Name</mat-label>
                <input matInput [formField]="registerForm.firstName" placeholder="Emily" />
                @if (registerForm.firstName().touched() && registerForm.firstName().errors().length) {
                  <mat-error>{{ registerForm.firstName().errors()[0].message }}</mat-error>
                }
              </mat-form-field>

              <mat-form-field appearance="outline">
                <mat-label>Last Name</mat-label>
                <input matInput [formField]="registerForm.lastName" placeholder="Johnson" />
                @if (registerForm.lastName().touched() && registerForm.lastName().errors().length) {
                  <mat-error>{{ registerForm.lastName().errors()[0].message }}</mat-error>
                }
              </mat-form-field>
            </div>

            <mat-form-field appearance="outline">
              <mat-label>Username</mat-label>
              <input matInput [formField]="registerForm.username" placeholder="emilyj" />
              <mat-icon matPrefix>person</mat-icon>
              @if (registerForm.username().touched() && registerForm.username().errors().length) {
                <mat-error>{{ registerForm.username().errors()[0].message }}</mat-error>
              }
            </mat-form-field>

            <mat-form-field appearance="outline">
              <mat-label>Email</mat-label>
              <input matInput type="email" [formField]="registerForm.email" placeholder="emily@example.com" />
              <mat-icon matPrefix>email</mat-icon>
              @if (registerForm.email().touched() && registerForm.email().errors().length) {
                <mat-error>{{ registerForm.email().errors()[0].message }}</mat-error>
              }
            </mat-form-field>

            <mat-form-field appearance="outline">
              <mat-label>Password</mat-label>
              <input matInput [type]="hidePassword() ? 'password' : 'text'" [formField]="registerForm.password" />
              <mat-icon matPrefix>lock</mat-icon>
              <button mat-icon-button matSuffix (click)="hidePassword.set(!hidePassword())" type="button">
                <mat-icon>{{ hidePassword() ? 'visibility_off' : 'visibility' }}</mat-icon>
              </button>
              @if (registerForm.password().touched() && registerForm.password().errors().length) {
                <mat-error>{{ registerForm.password().errors()[0].message }}</mat-error>
              }
            </mat-form-field>

            <button
              mat-flat-button
              color="primary"
              class="submit-btn"
              [disabled]="registerForm().invalid() || isRegistering()"
              (click)="onRegister()"
            >
              @if (isRegistering()) {
                CREATING ACCOUNT...
              } @else {
                REGISTER
              }
            </button>
          </form>

          <div class="login-prompt">
            Already have an account? <a routerLink="/login">Login here</a>
          </div>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: `
    .register-wrapper {
      display: flex;
      justify-content: center;
      padding: 2rem 1rem;
    }
    .register-card {
      width: 100%;
      max-width: 500px;
      border-radius: 16px;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
    }
    .register-form {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
      margin-top: 1.5rem;
    }
    .grid-2 {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 1rem;
    }
    .submit-btn {
      height: 48px;
      margin-top: 1rem;
      font-weight: 600;
    }
    .login-prompt {
      text-align: center;
      margin-top: 1.5rem;
      font-size: 0.9rem;
      color: var(--mat-sys-on-surface-variant);
      a { color: var(--mat-sys-primary); font-weight: 500; text-decoration: none; }
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserRegisterComponent {
  private readonly userService = inject(UserService);
  private readonly snackBar = inject(MatSnackBar);
  private readonly router = inject(Router);

  readonly isRegistering = signal(false);
  readonly hidePassword = signal(true);

  readonly registerModel = signal({
    firstName: '',
    lastName: '',
    username: '',
    email: '',
    password: '',
  });

  readonly registerForm = form(this.registerModel, (s) => {
    required(s.firstName, { message: 'First name is required' });
    required(s.lastName, { message: 'Last name is required' });
    required(s.username, { message: 'Username is required' });
    required(s.email, { message: 'Email is required' });
    email(s.email, { message: 'Invalid email' });
    required(s.password, { message: 'Password is required' });
    minLength(s.password, 6, { message: 'Min 6 characters' });
  });

  onRegister() {
    submit(this.registerForm, async () => {
      this.isRegistering.set(true);
      try {
        await this.userService.addUser(this.registerModel());
        this.snackBar.open('Registration successful (mock)! Please login.', 'Close', { duration: 5000 });
        this.router.navigate(['/login']);
      } catch (err) {
        this.snackBar.open('Registration failed. Please try again.', 'Close', { duration: 3000 });
      } finally {
        this.isRegistering.set(false);
      }
    });
  }
}
