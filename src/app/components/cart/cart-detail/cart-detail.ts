import { ChangeDetectionStrategy, Component, inject, input, numberAttribute } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatListModule } from '@angular/material/list';
import { Router, RouterModule } from '@angular/router';
import { CartService } from '../../../cart.service';

@Component({
  selector: 'app-cart-detail',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatListModule,
    RouterModule,
  ],
  template: `
    <div class="cart-detail-container">
      <div class="detail-header">
        <button mat-icon-button routerLink="/carts" aria-label="Go back to carts list">
          <mat-icon>arrow_back</mat-icon>
        </button>
        <h2>Cart Management #{{ cartId() }}</h2>
      </div>

      @if (cartService.cartResource.isLoading()) {
        <div class="loading-state">
          <mat-spinner diameter="45"></mat-spinner>
          <p>Fetching full cart telemetry...</p>
        </div>
      } @else if (cartService.cartResource.error()) {
        <div class="error-state">
          <mat-icon class="error-icon">error_outline</mat-icon>
          <p>Failed to load the requested cart details.</p>
          <button mat-stroked-button color="primary" (click)="cartService.cartResource.reload()">
            <mat-icon>refresh</mat-icon> Retry Request
          </button>
        </div>
      } @else {
        @let cart = cartService.cartResource.value();

        @if (cart) {
          <div class="layout-grid">
            <div class="products-section">
              <mat-card class="custom-card">
                <mat-card-header class="card-header-styled">
                  <mat-card-title>Consolidated Itemized Manifest</mat-card-title>
                </mat-card-header>

                <mat-card-content class="card-content-flush">
                  <mat-list class="styled-list">
                    @for (item of cart.products; track item.id) {
                      <mat-list-item class="product-item">
                        <img
                          matListItemAvatar
                          class="product-thumb"
                          [src]="item.thumbnail"
                          [alt]="item.title"
                        />
                        <span matListItemTitle class="product-title">{{ item.title }}</span>
                        <span matListItemLine class="product-meta-line">
                          {{ item.quantity }} units &times; {{ item.price | currency }}
                          <span class="sub-total-text">= {{ item.total | currency }}</span>
                        </span>

                        <div matListItemMeta class="discount-badge-container">
                          @if (item.discountPercentage > 0) {
                            <span class="discount-pill">-{{ item.discountPercentage }}% Off</span>
                          }
                        </div>
                      </mat-list-item>
                    }
                  </mat-list>
                </mat-card-content>
              </mat-card>
            </div>

            <div class="summary-section">
              <mat-card class="custom-card summary-card">
                <mat-card-header class="card-header-styled">
                  <mat-card-title>Financial Summary</mat-card-title>
                </mat-card-header>

                <mat-card-content class="summary-content">
                  <div class="summary-row">
                    <span class="label">Total Products:</span>
                    <span class="value font-mono">{{ cart.totalProducts }} types</span>
                  </div>
                  <div class="summary-row">
                    <span class="label">Total Item Volume:</span>
                    <span class="value font-mono">{{ cart.totalQuantity }} items</span>
                  </div>

                  <div class="divider-line"></div>

                  <div class="summary-row">
                    <span class="label">Subtotal Before Discounts:</span>
                    <span class="value original-price">{{ cart.total | currency }}</span>
                  </div>

                  <div class="summary-row total-row">
                    <span class="label-highlight">Net Chargeable Amount:</span>
                    <span class="value-highlight">{{ cart.discountedTotal | currency }}</span>
                  </div>
                </mat-card-content>

                <mat-card-actions class="actions-container">
                  <button mat-flat-button color="primary" class="checkout-btn" routerLink="/checkout">
                    <mat-icon>shopping_cart_checkout</mat-icon> PROCEED TO CHECKOUT
                  </button>
                  <button
                    mat-flat-button
                    color="warn"
                    class="delete-btn"
                    (click)="onDelete(cart.id)"
                  >
                    <mat-icon>delete_forever</mat-icon> DECOMMISSION CART
                  </button>
                </mat-card-actions>
              </mat-card>
            </div>
          </div>
        }
      }
    </div>
  `,
  styles: `
    .cart-detail-container {
      max-width: 1200px;
      margin: 2rem auto;
      padding: 0 1rem;
    }

    .detail-header {
      display: flex;
      align-items: center;
      gap: 1rem;
      margin-bottom: 2rem;

      h2 {
        font-size: 1.6rem;
        font-weight: 700;
        margin: 0;
        color: var(--mat-sys-on-surface);
      }
    }

    /* تقسيم الشاشة بـ CSS Grid المتجاوب */
    .layout-grid {
      display: grid;
      grid-template-columns: 1fr;
      gap: 1.5rem;
    }

    @media (min-width: 768px) {
      .layout-grid {
        grid-template-columns: 2fr 1fr;
      }
    }

    .custom-card {
      border-radius: 12px !important;
      border: 1px solid var(--mat-sys-outline-variant, #e0e0e0);
      background: var(--mat-sys-surface-container-lowest, #ffffff) !important;
      box-shadow: none !important;
      overflow: hidden;
    }

    .card-header-styled {
      background: var(--mat-sys-surface-container-low, #fcfcfc);
      padding: 1rem 1.5rem !important;
      border-bottom: 1px solid var(--mat-sys-outline-variant);

      mat-card-title {
        font-size: 1rem !important;
        font-weight: 600 !important;
        letter-spacing: 0.2px;
        color: var(--mat-sys-on-surface-variant);
      }
    }

    .card-content-flush {
      padding: 0 !important;
    }

    .styled-list {
      padding: 0 !important;
    }

    .product-item {
      padding: 1rem 1.5rem !important;
      border-bottom: 1px solid var(--mat-sys-outline-variant);
      height: auto !important;

      &:last-child {
        border-bottom: none;
      }
    }

    .product-thumb {
      width: 50px !important;
      height: 50px !important;
      border-radius: 8px !important;
      object-fit: cover;
      border: 1px solid var(--mat-sys-outline-variant);
    }

    .product-title {
      font-weight: 600 !important;
      color: var(--mat-sys-on-surface);
    }

    .product-meta-line {
      font-size: 0.85rem !important;
      color: var(--mat-sys-on-surface-variant) !important;
      margin-top: 0.25rem;

      .sub-total-text {
        font-weight: 600;
        color: var(--mat-sys-on-surface);
        margin-left: 0.25rem;
      }
    }

    .discount-pill {
      background: var(--mat-sys-error-container, #ffebee);
      color: var(--mat-sys-on-error-container, #c62828);
      font-size: 0.75rem;
      font-weight: 600;
      padding: 0.25rem 0.5rem;
      border-radius: 6px;
    }

    /* تنسيقات كارت ملخص الحسابات */
    .summary-content {
      padding: 1.5rem !important;
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    .summary-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 0.9rem;
      color: var(--mat-sys-on-surface-variant);

      .value {
        color: var(--mat-sys-on-surface);
        font-weight: 500;
      }

      .original-price {
        text-decoration: line-through;
        color: var(--mat-sys-outline);
      }
    }

    .font-mono {
      font-family: monospace;
      font-weight: 600 !important;
    }

    .divider-line {
      height: 1px;
      background-color: var(--mat-sys-outline-variant);
      margin: 0.5rem 0;
    }

    .total-row {
      margin-top: 0.5rem;

      .label-highlight {
        font-weight: 700;
        color: var(--mat-sys-primary);
        font-size: 0.95rem;
      }

      .value-highlight {
        font-size: 1.5rem;
        font-weight: 800;
        color: var(--mat-sys-primary);
        letter-spacing: -0.5px;
      }
    }

    .actions-container {
      padding: 0 1.5rem 1.5rem 1.5rem !important;
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
      justify-content: stretch !important;
    }

    .checkout-btn,
    .delete-btn {
      width: 100%;
      padding: 1.3rem !important;
      font-weight: 600 !important;
      letter-spacing: 0.5px;
      border-radius: 8px !important;

      mat-icon {
        margin-right: 0.25rem;
        vertical-align: middle;
      }
    }

    /* واجهات التحميل والأخطاء */
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
      font-size: 40px;
      width: 40px;
      height: 40px;
      color: var(--mat-sys-error);
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CartDetailComponent {
  protected readonly cartService = inject(CartService);
  private readonly router = inject(Router);

  // لقط المعرف ديناميكياً من الـ URL وتحويله لنوع رقبي سليم
  cartId = input.required({ transform: numberAttribute });

  //  cartId = input.required({ transform: numberAttribute });

  ngOnInit(): void {
    // 💡 نقوم باستدعاء الـ Signal كدالة () لإخراج الرقم الصريح منه وتمريره للـ Service
    this.cartService.activeCartId.set(this.cartId());
  }

  async onDelete(id: number): Promise<void> {
    if (confirm('Are you sure you want to permanently delete this cart record?')) {
      try {
        await this.cartService.deleteCart(id);

        // 🚀 توجيه ذكي للمستخدم فور الحذف لتجنب البقاء في صفحة غير موجودة
        await this.router.navigate(['/carts']);
      } catch (e) {
        console.error('Error executing cart deletion:', e);
      }
    }
  }
}
