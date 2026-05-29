import { ChangeDetectionStrategy, Component, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { CartService } from '../../../cart.service';

@Component({
  selector: 'app-cart-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatGridListModule,
    MatIconModule,
    MatProgressSpinnerModule,
  ],
  template: `
    <div class="container mt-4">
      <h2 class="mb-4">Cart Analytics Dashboard</h2>

      @if (cartService.cartsResource.isLoading()) {
        <div class="d-flex justify-content-center p-5">
          <mat-spinner diameter="50"></mat-spinner>
        </div>
      } @else {
        <div class="row g-4">
          <div class="col-md-3">
            <mat-card class="stat-card">
              <mat-card-header>
                <mat-icon mat-card-avatar color="primary">shopping_cart</mat-icon>
                <mat-card-title>Total Carts</mat-card-title>
                <mat-card-subtitle>Active system-wide</mat-card-subtitle>
              </mat-card-header>
              <mat-card-content>
                <h1 class="stat-value">{{totalCarts()}}</h1>
              </mat-card-content>
            </mat-card>
          </div>

          <div class="col-md-3">
            <mat-card class="stat-card">
              <mat-card-header>
                <mat-icon mat-card-avatar color="accent">payments</mat-icon>
                <mat-card-title>Gross Revenue</mat-card-title>
                <mat-card-subtitle>Sum of all cart totals</mat-card-subtitle>
              </mat-card-header>
              <mat-card-content>
                <h1 class="stat-value text-accent">{{totalRevenue() | currency}}</h1>
              </mat-card-content>
            </mat-card>
          </div>

          <div class="col-md-3">
            <mat-card class="stat-card">
              <mat-card-header>
                <mat-icon mat-card-avatar color="warn">inventory_2</mat-icon>
                <mat-card-title>Total Units</mat-card-title>
                <mat-card-subtitle>Items across all carts</mat-card-subtitle>
              </mat-card-header>
              <mat-card-content>
                <h1 class="stat-value text-warn">{{totalUnits()}}</h1>
              </mat-card-content>
            </mat-card>
          </div>

          <div class="col-md-3">
            <mat-card class="stat-card">
              <mat-card-header>
                <mat-icon mat-card-avatar color="primary">analytics</mat-icon>
                <mat-card-title>Avg. Cart Value</mat-card-title>
                <mat-card-subtitle>Revenue / Total Carts</mat-card-subtitle>
              </mat-card-header>
              <mat-card-content>
                <h1 class="stat-value text-primary">{{avgCartValue() | currency}}</h1>
              </mat-card-content>
            </mat-card>
          </div>
        </div>

        <div class="row mt-4">
          <div class="col-12">
            <mat-card>
              <mat-card-header>
                <mat-card-title>Business Insights</mat-card-title>
              </mat-card-header>
              <mat-card-content>
                <p class="mt-3">
                  The system is currently tracking <strong>{{totalCarts()}}</strong> active shopping sessions. 
                  The total potential revenue from these sessions is <strong>{{totalRevenue() | currency}}</strong>.
                </p>
                <p>
                  On average, each customer has <strong>{{(totalUnits() / (totalCarts() || 1)).toFixed(1)}}</strong> items 
                  in their cart with a projected spend of <strong>{{avgCartValue() | currency}}</strong>.
                </p>
              </mat-card-content>
            </mat-card>
          </div>
        </div>
      }
    </div>
  `,
  styles: [`
    .container { max-width: 1200px; }
    .stat-card { height: 100%; border-top: 4px solid var(--mat-sys-primary); }
    .stat-value { font-size: 3rem; font-weight: 300; margin: 1rem 0; }
    .text-accent { color: var(--mat-sys-secondary); }
    .text-warn { color: var(--mat-sys-error); }
    .text-primary { color: var(--mat-sys-primary); }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CartDashboardComponent {
  protected readonly cartService = inject(CartService);

  totalCarts = computed(() => this.cartService.cartsResource.value()?.total ?? 0);
  
  totalRevenue = computed(() => {
    const carts = this.cartService.cartsResource.value()?.carts ?? [];
    return carts.reduce((acc, cart) => acc + cart.total, 0);
  });

  totalUnits = computed(() => {
    const carts = this.cartService.cartsResource.value()?.carts ?? [];
    return carts.reduce((acc, cart) => acc + cart.totalQuantity, 0);
  });

  avgCartValue = computed(() => {
    const total = this.totalRevenue();
    const count = this.totalCarts();
    return count > 0 ? total / count : 0;
  });
}
