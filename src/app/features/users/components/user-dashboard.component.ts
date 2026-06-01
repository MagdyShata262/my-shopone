import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserLoginComponent } from './user-login/user-login.component';
import { UserCardListComponent } from './user-card-list/user-card-list.component';
import { UserService } from '../services/user.service';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-user-dashboard',
  standalone: true,
  imports: [CommonModule, UserLoginComponent, UserCardListComponent, MatIconModule],
  template: `
    <div class="dashboard-container">
      <header class="dashboard-header">
        <h1>User Management Dashboard</h1>
        <p>Manage authentication and explore the comprehensive user directory.</p>
      </header>

      <div class="dashboard-grid">
        <aside class="sidebar-section">
          <app-user-login />
        </aside>

        <main class="main-section">
          @if (userService.isAuthenticated()) {
            <div class="list-wrapper">
              <app-user-card-list />
            </div>
          } @else {
            <div class="protected-blur-box">
              <mat-icon class="lock-icon">lock</mat-icon>
              <h3>Access Restricted</h3>
              <p>
                Please log in using the credentials provided on the sidebar to unlock and explore
                the user directory.
              </p>
            </div>
          }
        </main>
      </div>
    </div>
  `,
  styles: [
    `
      :host {
        display: block;
        background-color: var(--sys-background, #f8f9fa);
        min-height: 100vh;
      }
      .dashboard-container {
        max-width: 1300px;
        margin: 0 auto;
        padding: 2rem 1.5rem;
      }
      .dashboard-header {
        text-align: center;
        margin-bottom: 2.5rem;
      }
      .dashboard-header h1 {
        font-size: 2.2rem;
        color: var(--sys-on-background, #212529);
        margin-bottom: 0.5rem;
        font-weight: 700;
      }
      .dashboard-header p {
        color: #6c757d;
        font-size: 1.05rem;
      }

      /* نظام التوزيع الشبكي المتجاوب */
      .dashboard-grid {
        display: grid;
        grid-template-columns: 1fr;
        gap: 2rem;
      }

      /* تحويل التخطيط إلى عمودين في الشاشات الكبيرة Desktop */
      @media (min-width: 992px) {
        .dashboard-grid {
          grid-template-columns: 380px 1fr;
          align-items: start;
        }
      }

      .sidebar-section {
        position: sticky;
        top: 2rem;
      }
      .main-section {
        background: var(--sys-surface, #ffffff);
        border-radius: 16px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.03);
        min-height: 400px;
        display: flex;
        flex-direction: column;
      }
      .list-wrapper {
        padding: 1.5rem;
      }

      /* واجهة القفل الجمالية */
      .protected-blur-box {
        flex: 1;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        padding: 3rem 2rem;
        text-align: center;
        color: #6c757d;
      }
      .lock-icon {
        font-size: 48px;
        width: 48px;
        height: 48px;
        color: #ced4da;
        margin-bottom: 1rem;
      }
      .protected-blur-box h3 {
        font-size: 1.3rem;
        color: #495057;
        margin-bottom: 0.5rem;
        font-weight: 600;
      }
      .protected-blur-box p {
        max-width: 400px;
        font-size: 0.95rem;
        line-height: 1.5;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserDashboardComponent {
  protected readonly userService = inject(UserService);
}
