import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';
import { CartService } from '../../../cart.service';

@Component({
  selector: 'app-cart-list',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    MatPaginatorModule,
    MatIconModule,
    RouterModule,
  ],
  template: `
    <div class="cart-list-container">
      <div class="header-section">
        <div>
          <h2>Management Console</h2>
          <p class="subtitle">Overview of active and historical user shopping carts</p>
        </div>
      </div>

      @if (cartService.cartsResource.isLoading()) {
        <div class="loading-state">
          <mat-spinner diameter="45"></mat-spinner>
          <p>Retrieving user carts data...</p>
        </div>
      } @else if (cartService.cartsResource.error()) {
        <div class="error-state">
          <mat-icon class="error-icon">wifi_off</mat-icon>
          <p>Failed to populate carts list. Please try again.</p>
          <button
            mat-stroked-button
            color="primary"
            class="reload-btn"
            (click)="cartService.cartsResource.reload()"
          >
            <mat-icon>refresh</mat-icon> Reload Records
          </button>
        </div>
      } @else {
        @let data = cartService.cartsResource.value();

        @if (data && data.carts.length > 0) {
          <div class="table-responsive mat-elevation-z1">
            <table mat-table [dataSource]="data.carts" class="w-100 custom-table">
              <ng-container matColumnDef="id">
                <th mat-header-cell *matHeaderCellDef>Cart ID</th>
                <td mat-cell *matCellDef="let cart" class="font-mono">#{{ cart.id }}</td>
              </ng-container>

              <ng-container matColumnDef="userId">
                <th mat-header-cell *matHeaderCellDef>Customer ID</th>
                <td mat-cell *matCellDef="let cart">
                  <span class="user-badge">User {{ cart.userId }}</span>
                </td>
              </ng-container>

              <ng-container matColumnDef="totalProducts">
                <th mat-header-cell *matHeaderCellDef>Unique Items</th>
                <td mat-cell *matCellDef="let cart">{{ cart.totalProducts }} types</td>
              </ng-container>

              <ng-container matColumnDef="totalQuantity">
                <th mat-header-cell *matHeaderCellDef>Total Qty</th>
                <td mat-cell *matCellDef="let cart">{{ cart.totalQuantity }} items</td>
              </ng-container>

              <ng-container matColumnDef="total">
                <th mat-header-cell *matHeaderCellDef>Grand Total</th>
                <td mat-cell *matCellDef="let cart" class="price-cell">
                  <span class="price-text">{{ cart.discountedTotal | currency }}</span>
                  @if (cart.total > cart.discountedTotal) {
                    <span class="has-discount-dot" title="Discount applied"></span>
                  }
                </td>
              </ng-container>

              <ng-container matColumnDef="actions">
                <th mat-header-cell *matHeaderCellDef class="text-end-header">Management</th>
                <td mat-cell *matCellDef="let cart" class="text-end-cell">
                  <button
                    mat-flat-button
                    color="primary"
                    class="action-btn"
                    [routerLink]="['/carts', cart.id]"
                  >
                    <mat-icon>visibility</mat-icon> INSPECT
                  </button>
                </td>
              </ng-container>

              <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
              <tr mat-row *matRowDef="let row; columns: displayedColumns" class="cart-row"></tr>
            </table>

            <mat-paginator
              class="paginator-container"
              [length]="data.total"
              [pageSize]="cartService.cartsPageSize()"
              [pageIndex]="cartService.cartsPageIndex()"
              [pageSizeOptions]="[5, 10, 25, 50]"
              (page)="handlePageEvent($event)"
              aria-label="Select cart page"
            >
            </mat-paginator>
          </div>
        } @else {
          <div class="empty-state">
            <mat-icon class="empty-icon">remove_shopping_cart</mat-icon>
            <p>No consumer carts records available currently.</p>
          </div>
        }
      }
    </div>
  `,
  styles: `
    .cart-list-container {
      max-width: 1100px;
      margin: 2rem auto;
      padding: 0 1rem;
    }

    .header-section {
      margin-bottom: 1.5rem;

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

    .table-responsive {
      border-radius: 12px;
      overflow: hidden;
      border: 1px solid var(--mat-sys-outline-variant, #e0e0e0);
      background: var(--mat-sys-surface-container-lowest, #ffffff);
    }

    .custom-table {
      background: transparent;
      width: 100%;
    }

    /* إصلاح ترويسة الجدول وضمان عدم تداخل الألوان */
    th.mat-mdc-header-cell {
      background: var(--mat-sys-surface-container, #f5f5f5) !important;
      color: var(--mat-sys-on-surface-variant) !important;
      font-weight: 600 !important;
      font-size: 0.88rem !important;
      letter-spacing: 0.3px;
      padding: 1rem !important;
    }

    td.mat-mdc-cell {
      padding: 1rem !important;
      font-size: 0.9rem;
      color: var(--mat-sys-on-surface);
      border-bottom: 1px solid var(--mat-sys-outline-variant);
    }

    /* تأثير تمرير الفأرة على الصفوف */
    .cart-row {
      transition: background-color 0.2s ease;
    }

    .cart-row:hover {
      background-color: var(--mat-sys-surface-container-low, #fcfcfc) !important;
    }

    .font-mono {
      font-family: monospace;
      font-weight: 600;
      color: var(--mat-sys-primary);
    }

    .user-badge {
      background: var(--mat-sys-surface-container-high, #e0e0e0);
      padding: 0.35rem 0.65rem;
      border-radius: 6px;
      font-size: 0.8rem;
      font-weight: 500;
      color: var(--mat-sys-on-surface-variant);
    }

    /* إصلاح محاذاة عمود السعر ومؤشر الخصم الدائري */
    .price-cell {
      font-weight: 700;
      vertical-align: middle;
    }

    .price-text {
      display: inline-block;
      vertical-align: middle;
    }

    .has-discount-dot {
      display: inline-block;
      vertical-align: middle;
      width: 7px;
      height: 7px;
      background-color: var(--mat-sys-error, #ff1744);
      border-radius: 50%;
      margin-left: 0.5rem;
    }

    /* تنسيق محاذاة أزرار التحكم جهة اليسار/النهاية بصورة منضبطة */
    .text-end-header {
      text-align: end !important;
      padding-right: 1.5rem !important;
    }

    .text-end-cell {
      text-align: end !important;
      padding-right: 1.5rem !important;
    }

    .action-btn {
      font-size: 0.8rem !important;
      font-weight: 600 !important;
      letter-spacing: 0.4px;
      border-radius: 8px !important;
      padding: 0 1rem !important;

      mat-icon {
        font-size: 1.1rem !important;
        width: 1.1rem !important;
        height: 1.1rem !important;
        margin-right: 0.25rem;
        vertical-align: middle;
      }
    }

    .paginator-container {
      background: var(--mat-sys-surface-container-lowest) !important;
      border-top: 1px solid var(--mat-sys-outline-variant);
    }

    .reload-btn {
      border-radius: 8px !important;
      margin-top: 0.5rem;
    }

    /* حالات الواجهات الخاصة بالخطأ أو البيانات الفارغة */
    .loading-state,
    .error-state,
    .empty-state {
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
        font-size: 0.95rem;
      }

      .error-icon {
        font-size: 40px;
        width: 40px;
        height: 40px;
        color: var(--mat-sys-error);
      }

      .empty-icon {
        font-size: 44px;
        width: 44px;
        height: 44px;
        color: var(--mat-sys-outline);
      }
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CartListComponent {
  protected readonly cartService = inject(CartService);

  displayedColumns: string[] = [
    'id',
    'userId',
    'totalProducts',
    'totalQuantity',
    'total',
    'actions',
  ];

  handlePageEvent(e: PageEvent): void {
    this.cartService.cartsPageSize.set(e.pageSize);
    this.cartService.cartsPageIndex.set(e.pageIndex);
  }
}
