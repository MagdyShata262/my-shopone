import { ChangeDetectionStrategy, Component, inject, input, numberAttribute, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatListModule } from '@angular/material/list';
import { RouterModule } from '@angular/router';
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
    <div class="container mt-4">
      <div class="d-flex align-items-center gap-3 mb-4">
        <button mat-icon-button routerLink="/carts">
          <mat-icon>arrow_back</mat-icon>
        </button>
        <h2 class="m-0">Cart #{{cartId()}} Details</h2>
      </div>

      @if (cartService.cartResource.isLoading()) {
        <div class="d-flex justify-content-center p-5">
          <mat-spinner diameter="50"></mat-spinner>
        </div>
      } @else if (cartService.cartResource.error()) {
        <div class="alert alert-danger">Failed to load cart details.</div>
      } @else {
        @let cart = cartService.cartResource.value();
        @if (cart) {
          <div class="row">
            <div class="col-md-8">
              <mat-card class="mb-4">
                <mat-card-header>
                  <mat-card-title>Products</mat-card-title>
                </mat-card-header>
                <mat-card-content>
                  <mat-list>
                    @for (item of cart.products; track item.id) {
                      <mat-list-item>
                        <img matListItemAvatar [src]="item.thumbnail" [alt]="item.title">
                        <span matListItemTitle>{{item.title}}</span>
                        <span matListItemLine>
                          {{item.quantity}} x {{item.price | currency}} = {{item.total | currency}}
                        </span>
                        <div matListItemMeta>
                          @if (item.discountPercentage > 0) {
                            <small class="text-success">-{{item.discountPercentage}}%</small>
                          }
                        </div>
                      </mat-list-item>
                    }
                  </mat-list>
                </mat-card-content>
              </mat-card>
            </div>
            
            <div class="col-md-4">
              <mat-card>
                <mat-card-header>
                  <mat-card-title>Summary</mat-card-title>
                </mat-card-header>
                <mat-card-content>
                  <div class="d-flex justify-content-between mb-2 mt-3">
                    <span>Total Products:</span>
                    <strong>{{cart.totalProducts}}</strong>
                  </div>
                  <div class="d-flex justify-content-between mb-2">
                    <span>Total Quantity:</span>
                    <strong>{{cart.totalQuantity}}</strong>
                  </div>
                  <hr>
                  <div class="d-flex justify-content-between mb-2">
                    <span>Subtotal:</span>
                    <strong>{{cart.total | currency}}</strong>
                  </div>
                  <div class="d-flex justify-content-between text-success">
                    <span>Discounted Total:</span>
                    <h3 class="m-0">{{cart.discountedTotal | currency}}</h3>
                  </div>
                </mat-card-content>
                <mat-card-actions align="end">
                  <button mat-flat-button color="warn" (click)="onDelete(cart.id)">DELETE CART</button>
                </mat-card-actions>
              </mat-card>
            </div>
          </div>
        }
      }
    </div>
  `,
  styles: [`
    .container { max-width: 1200px; }
    mat-list-item img { object-fit: cover; }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CartDetailComponent {
  protected readonly cartService = inject(CartService);
  
  cartId = input.required({ transform: numberAttribute });

  constructor() {
    effect(() => {
      this.cartService.activeCartId.set(this.cartId());
    });
  }

  async onDelete(id: number) {
    if (confirm('Are you sure you want to delete this cart?')) {
      try {
        await this.cartService.deleteCart(id);
        alert('Cart deleted successfully (simulated)');
      } catch (e) {
        alert('Error deleting cart');
      }
    }
  }
}
