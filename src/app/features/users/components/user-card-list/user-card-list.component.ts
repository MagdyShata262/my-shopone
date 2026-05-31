import { Component, ChangeDetectionStrategy, inject, signal, resource, computed, DestroyRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-user-card-list',
  standalone: true,
  imports: [
    CommonModule, 
    ReactiveFormsModule,
    MatCardModule,
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule,
    MatProgressSpinnerModule,
    MatPaginatorModule
  ],
  template: `
    <div class="user-list-container">
      <div class="header">
        <h2>User Directory</h2>
        <mat-form-field appearance="outline" class="search-field">
          <mat-label>Search users...</mat-label>
          <input 
            matInput 
            [formControl]="searchControl" 
            placeholder="Search by name, email, or role"
          >
        </mat-form-field>
      </div>

      @if (usersResource.isLoading()) {
        <div class="loading-overlay">
          <mat-spinner diameter="50"></mat-spinner>
        </div>
      }

      @if (usersResource.error()) {
        <div class="error-container">
          <p>Error loading users: {{ usersResource.error() }}</p>
          <button mat-stroked-button color="warn" (click)="usersResource.reload()">Retry</button>
        </div>
      } @else {
        <div class="grid">
          @for (user of usersResource.value(); track user.id) {
            <mat-card class="user-card">
              <mat-card-header>
                <img mat-card-avatar [src]="user.image" [alt]="user.firstName">
                <mat-card-title>{{ user.firstName }} {{ user.lastName }}</mat-card-title>
                <mat-card-subtitle>{{ user.role | uppercase }}</mat-card-subtitle>
              </mat-card-header>
              <mat-card-content>
                <p class="email">{{ user.email }}</p>
                <p class="company">{{ user.company?.name }}</p>
              </mat-card-content>
              <mat-card-actions>
                <button mat-button color="primary">DETAILS</button>
              </mat-card-actions>
            </mat-card>
          } @empty {
            <div class="no-results">
              <p>No users found matching your search.</p>
            </div>
          }
        </div>

        <mat-paginator
          [length]="totalUsers()"
          [pageSize]="limit()"
          [pageSizeOptions]="[10, 20, 50]"
          (page)="handlePageEvent($event)"
          class="paginator"
        >
        </mat-paginator>
      }
    </div>
  `,
  styles: [`
    .user-list-container {
      padding: 1rem;
      position: relative;
    }
    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 2rem;
      flex-wrap: wrap;
      gap: 1rem;
    }
    .search-field {
      width: 100%;
      max-width: 400px;
    }
    .grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      gap: 1.5rem;
      margin-bottom: 2rem;
    }
    .user-card {
      transition: transform 0.2s, box-shadow 0.2s;
    }
    .user-card:hover {
      transform: translateY(-4px);
      box-shadow: 0 8px 24px rgba(0,0,0,0.12);
    }
    .email {
      font-size: 0.9rem;
      color: #666;
      margin-top: 0.5rem;
    }
    .company {
      font-size: 0.85rem;
      font-weight: 500;
      color: #333;
    }
    .loading-overlay {
      position: absolute;
      top: 100px;
      left: 0;
      right: 0;
      display: flex;
      justify-content: center;
      z-index: 10;
    }
    .error-container, .no-results {
      text-align: center;
      padding: 3rem;
    }
    .paginator {
      background: transparent;
      margin-top: 1rem;
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserCardListComponent {
  private readonly userService = inject(UserService);
  private readonly destroyRef = inject(DestroyRef);
  
  searchControl = new FormControl('', { nonNullable: true });
  
  // State Signals
  readonly limit = signal(20);
  readonly skip = signal(0);
  readonly searchQuery = signal('');
  readonly totalUsers = signal(0);

  constructor() {
    // Debounced search logic
    this.searchControl.valueChanges
      .pipe(
        debounceTime(400),
        distinctUntilChanged(),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe(val => {
        this.searchQuery.set(val);
        this.skip.set(0); // Reset to first page on search
      });
  }

  // Reactive Resource for fetching users
  usersResource = resource({
    params: () => ({ 
      query: this.searchQuery(),
      limit: this.limit(),
      skip: this.skip()
    }),
    loader: async ({ params }) => {
      let response;
      if (params.query) {
        response = await this.userService.searchUsers(params.query);
      } else {
        response = await this.userService.getUsers(params.limit, params.skip);
      }
      
      this.totalUsers.set(response.total);
      return response.users;
    }
  });

  handlePageEvent(e: PageEvent) {
    this.limit.set(e.pageSize);
    this.skip.set(e.pageIndex * e.pageSize);
  }
}

