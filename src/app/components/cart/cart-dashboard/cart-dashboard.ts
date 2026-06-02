import { ChangeDetectionStrategy, Component, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { CartService } from '../../../cart.service';

@Component({
  selector: 'app-cart-dashboard',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatIconModule, MatProgressSpinnerModule],
  template: `
    <div class="dashboard-container">
      <div class="dashboard-header">
        <h2>Cart Analytics Dashboard</h2>
        <p class="subtitle">Real-time business intelligence and consumer session telemetry</p>
      </div>

      @if (cartService.cartsResource.isLoading()) {
        <div class="loading-state">
          <mat-spinner diameter="45"></mat-spinner>
          <p>Compiling database analytics...</p>
        </div>

      } @else if (cartService.cartsResource.error()) {
        <div class="error-state">
          <mat-icon class="error-icon">analytics</mat-icon>
          <p>Unable to aggregate data metrics. Please retry.</p>
          <button
            mat-stroked-button
            color="primary"
            class="retry-btn"
            (click)="cartService.cartsResource.reload()"
          >
            <mat-icon>refresh</mat-icon> Refresh Dashboard
          </button>
        </div>

      } @else {
        <div class="stats-grid">
          <mat-card class="stat-card card-primary">
            <mat-card-header class="card-header-flex">
              <div class="icon-wrapper bg-primary-low">
                <mat-icon color="primary">shopping_cart</mat-icon>
              </div>
              <div>
                <mat-card-title class="metric-title">Total Sessions</mat-card-title>
                <mat-card-subtitle class="metric-sub">Active system-wide</mat-card-subtitle>
              </div>
            </mat-card-header>
            <mat-card-content>
              <h1 class="stat-value color-primary">{{ totalCarts() }}</h1>
            </mat-card-content>
          </mat-card>

          <mat-card class="stat-card card-secondary">
            <mat-card-header class="card-header-flex">
              <div class="icon-wrapper bg-secondary-low">
                <mat-icon class="color-secondary">payments</mat-icon>
              </div>
              <div>
                <mat-card-title class="metric-title">Gross Volume</mat-card-title>
                <mat-card-subtitle class="metric-sub">Sum of sample totals</mat-card-subtitle>
              </div>
            </mat-card-header>
            <mat-card-content>
              <h1 class="stat-value color-secondary">{{ totalRevenue() | currency }}</h1>
            </mat-card-content>
          </mat-card>

          <mat-card class="stat-card card-warn">
            <mat-card-header class="card-header-flex">
              <div class="icon-wrapper bg-warn-low">
                <mat-icon color="warn">inventory_2</mat-icon>
              </div>
              <div>
                <mat-card-title class="metric-title">Total Units</mat-card-title>
                <mat-card-subtitle class="metric-sub">Items in current view</mat-card-subtitle>
              </div>
            </mat-card-header>
            <mat-card-content>
              <h1 class="stat-value color-warn">{{ totalUnits() }}</h1>
            </mat-card-content>
          </mat-card>

          <mat-card class="stat-card card-info">
            <mat-card-header class="card-header-flex">
              <div class="icon-wrapper bg-info-low">
                <mat-icon class="color-info">analytics</mat-icon>
              </div>
              <div>
                <mat-card-title class="metric-title">Avg. Basket Value</mat-card-title>
                <mat-card-subtitle class="metric-sub">Revenue / Sample Carts</mat-card-subtitle>
              </div>
            </mat-card-header>
            <mat-card-content>
              <h1 class="stat-value color-info">{{ avgCartValue() | currency }}</h1>
            </mat-card-content>
          </mat-card>
        </div>

        <div class="insights-section">
          <mat-card class="insights-card">
            <mat-card-header class="insights-header">
              <mat-icon>lightbulb</mat-icon>
              <mat-card-title>Automated Business Insights</mat-card-title>
            </mat-card-header>
            <mat-card-content class="insights-content">
              <p>
                The platform is currently maintaining <strong>{{ totalCarts() }}</strong> active
                consumer shopping workflows. Based on the current data chunk evaluation, the
                accumulated gross financial value standing in these carts amounts to
                <strong class="highlight-text">{{ totalRevenue() | currency }}</strong
                >.
              </p>
              <p>
                A deeper look into the consumer behavior patterns reveals that on average, each user
                profile holds
                <strong>{{ averageItemsPerCart() }}</strong> items within their layout, leading to
                an estimated projected transactional revenue of
                <strong class="highlight-text">{{ avgCartValue() | currency }}</strong> per checkout
                event.
              </p>
            </mat-card-content>
          </mat-card>
        </div>
      }
    </div>
  `,
  styles: `
    .dashboard-container {
      max-width: 1200px;
      margin: 2rem auto;
      padding: 0 1rem;
    }

    .dashboard-header {
      margin-bottom: 2rem;

      h2 {
        font-size: 1.8rem;
        font-weight: 700;
        margin: 0;
        color: var(--mat-sys-on-surface);
      }

      .subtitle {
        font-size: 0.9rem;
        color: var(--mat-sys-on-surface-variant);
        margin: 0.25rem 0 0 0;
      }
    }

    /* شبكة متجاوبة مرنة وخفيفة للـ Cards */
    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
      gap: 1.25rem;
      margin-bottom: 2rem;
    }

    .stat-card {
      border-radius: 12px !important;
      border: 1px solid var(--mat-sys-outline-variant, #e0e0e0);
      background: var(--mat-sys-surface-container-lowest, #ffffff) !important;
      box-shadow: none !important;
      overflow: hidden;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      height: 100%;
    }

    /* حواف علوية ملونة تعبر عن حالة بطاقة التحليل */
    .card-primary {
      border-top: 4px solid var(--mat-sys-primary, #3f51b5);
    }
    .card-secondary {
      border-top: 4px solid var(--mat-sys-secondary, #607d8b);
    }
    .card-warn {
      border-top: 4px solid var(--mat-sys-error, #f44336);
    }
    .card-info {
      border-top: 4px solid var(--mat-sys-tertiary, #009688);
    }

    .card-header-flex {
      display: flex;
      align-items: center;
      gap: 0.85rem;
      padding: 1.25rem 1.25rem 0 1.25rem !important;
    }

    /* دوائر خلفية للأيقونات متناسقة مع ألوان النظام */
    .icon-wrapper {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 42px;
      height: 42px;
      border-radius: 10px;
    }

    .bg-primary-low {
      background: var(--mat-sys-primary-container, #e8eaf6);
    }
    .bg-secondary-low {
      background: var(--mat-sys-secondary-container, #eceff1);
    }
    .bg-warn-low {
      background: var(--mat-sys-error-container, #ffebee);
    }
    .bg-info-low {
      background: var(--mat-sys-tertiary-container, #e0f2f1);
    }

    .metric-title {
      font-size: 0.95rem !important;
      font-weight: 600 !important;
      color: var(--mat-sys-on-surface);
    }

    .metric-sub {
      font-size: 0.78rem !important;
      color: var(--mat-sys-on-surface-variant);
    }

    .stat-value {
      font-size: 2.2rem;
      font-weight: 800;
      margin: 1.5rem 1.25rem !important;
      letter-spacing: -1px;
    }

    /* ربط الخطوط بمتغيرات الألوان الرسمية للماتيريال */
    .color-primary {
      color: var(--mat-sys-primary);
    }
    .color-secondary {
      color: var(--mat-sys-secondary);
    }
    .color-warn {
      color: var(--mat-sys-error);
    }
    .color-info {
      color: var(--mat-sys-tertiary);
    }

    /* تنسيقات قسم الرؤى والتقارير */
    .insights-card {
      border-radius: 12px !important;
      border: 1px solid var(--mat-sys-outline-variant);
      background: var(--mat-sys-surface-container-low, #fcfcfc) !important;
      box-shadow: none !important;
    }

    .insights-header {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      padding: 1.25rem 1.5rem 0 1.5rem !important;
      color: var(--mat-sys-primary);

      mat-card-title {
        font-size: 1.1rem !important;
        font-weight: 700 !important;
        color: var(--mat-sys-on-surface);
      }
    }

    .insights-content {
      padding: 1rem 1.5rem 1.5rem 1.5rem !important;
      font-size: 0.95rem;
      line-height: 1.6;
      color: var(--mat-sys-on-surface-variant);

      p {
        margin: 0 0 1rem 0;
        &:last-child {
          margin: 0;
        }
      }

      .highlight-text {
        color: var(--mat-sys-primary);
        font-weight: 600;
      }
    }

    /* واجهات التنبيه والانتظار */
    .loading-state,
    .error-state {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 5rem 1rem;
      text-align: center;
      background: var(--mat-sys-surface-container-lowest);
      border: 1px solid var(--mat-sys-outline-variant);
      border-radius: 12px;
      color: var(--mat-sys-on-surface-variant);
      gap: 0.5rem;
      p {
        margin: 0.5rem 0 0 0;
      }
    }

    .error-icon {
      font-size: 42px;
      width: 42px;
      height: 42px;
      color: var(--mat-sys-error);
    }

    .retry-btn {
      margin-top: 0.5rem;
      border-radius: 8px !important;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CartDashboardComponent {
  protected readonly cartService = inject(CartService);

  // إجمالي عدد السلال الكلي في النظام القادم من السيرفر مباشرة
  readonly totalCarts = computed(() => this.cartService.cartsResource.value()?.total ?? 0);

  // حساب إجمالي الإيرادات لعينة السلال المتاحة حالياً في الـ Resource
  readonly totalRevenue = computed(() => {
    const carts = this.cartService.cartsResource.value()?.carts ?? [];
    return carts.reduce((acc, cart) => acc + (cart.discountedTotal ?? cart.total), 0);
  });

  // حساب إجمالي القطع المشحونة للعينة الحالية
  readonly totalUnits = computed(() => {
    const carts = this.cartService.cartsResource.value()?.carts ?? [];
    return carts.reduce((acc, cart) => acc + (cart.totalQuantity ?? 0), 0);
  });

  // حساب القيمة المتوسطة لكل سلة بشكل آمن لمنع القسمة على صفر
  readonly avgCartValue = computed(() => {
    const total = this.totalRevenue();
    const cartsList = this.cartService.cartsResource.value()?.carts ?? [];
    return cartsList.length > 0 ? total / cartsList.length : 0;
  });

  // معدل القطع لكل سلة منسق برقم عشري واحد مستقر داخل الـ computed لمنع الحساب المتكرر في الـ Template
  readonly averageItemsPerCart = computed(() => {
    const units = this.totalUnits();
    const cartsList = this.cartService.cartsResource.value()?.carts ?? [];
    return cartsList.length > 0 ? (units / cartsList.length).toFixed(1) : '0.0';
  });
}
