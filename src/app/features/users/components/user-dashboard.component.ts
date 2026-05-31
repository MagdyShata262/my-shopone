import { Component, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserLoginComponent } from './user-login/user-login.component';
import { UserCardListComponent } from './user-card-list/user-card-list.component';

@Component({
  selector: 'app-user-dashboard',
  standalone: true,
  imports: [CommonModule, UserLoginComponent, UserCardListComponent],
  template: `
    <div class="dashboard-container">
      <header class="dashboard-header">
        <h1>User Management Dashboard</h1>
        <p>Manage authentication and explore the user directory.</p>
      </header>

      <section class="auth-section">
        <app-user-login />
      </section>

      <hr class="divider">

      <section class="list-section">
        <app-user-card-list />
      </section>
    </div>
  `,
  styles: [`
    .dashboard-container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 2rem;
    }
    .dashboard-header {
      text-align: center;
      margin-bottom: 3rem;
    }
    .dashboard-header h1 {
      font-size: 2.5rem;
      color: #333;
      margin-bottom: 0.5rem;
    }
    .dashboard-header p {
      color: #666;
      font-size: 1.1rem;
    }
    .auth-section {
      margin-bottom: 3rem;
    }
    .divider {
      border: 0;
      border-top: 1px solid #eee;
      margin: 3rem 0;
    }
    .list-section {
      background: #fafafa;
      border-radius: 16px;
      padding: 1rem;
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserDashboardComponent {}
