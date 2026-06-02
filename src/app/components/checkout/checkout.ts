import { Component, ChangeDetectionStrategy, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatStepperModule } from '@angular/material/stepper';
import { Router, RouterLink } from '@angular/router';
import { form, FormField, submit, required, pattern, minLength } from '@angular/forms/signals';

import { CartService } from '../../cart.service';
import { UserService } from '../../features/users/services/user.service';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule,
    MatIconModule,
    MatDividerModule,
    MatStepperModule,
    RouterLink,
    FormField,
  ],
  template: `
    <div class="checkout-container">
      <h1 class="checkout-title">Checkout</h1>

      @if (cartService.cartQuantity() === 0) {
        <mat-card class="empty-cart-card">
          <mat-card-content>
            <mat-icon class="empty-icon">shopping_cart_off</mat-icon>
            <p>Your cart is empty. Add some products before checking out!</p>
            <button mat-flat-button color="primary" routerLink="/products">GO TO PRODUCTS</button>
          </mat-card-content>
        </mat-card>
      } @else {
        <div class="checkout-layout">
          <div class="checkout-steps">
            <mat-stepper orientation="vertical" #stepper>
              <!-- Step 1: Shipping Address -->
              <mat-step [completed]="shippingForm().valid()">
                <ng-template matStepLabel>Shipping Address</ng-template>
                <form class="step-form">
                  <div class="form-row">
                    <mat-form-field appearance="outline">
                      <mat-label>Full Name</mat-label>
                      <input matInput [formField]="shippingForm.fullName" placeholder="John Doe" />
                      @if (
                        shippingForm.fullName().touched() && shippingForm.fullName().errors().length
                      ) {
                        <mat-error>{{ shippingForm.fullName().errors()[0].message }}</mat-error>
                      }
                    </mat-form-field>
                  </div>

                  <div class="form-row">
                    <mat-form-field appearance="outline">
                      <mat-label>Address</mat-label>
                      <input
                        matInput
                        [formField]="shippingForm.address"
                        placeholder="123 Main St"
                      />
                      @if (
                        shippingForm.address().touched() && shippingForm.address().errors().length
                      ) {
                        <mat-error>{{ shippingForm.address().errors()[0].message }}</mat-error>
                      }
                    </mat-form-field>
                  </div>

                  <div class="form-row grid-3">
                    <mat-form-field appearance="outline">
                      <mat-label>City</mat-label>
                      <input matInput [formField]="shippingForm.city" placeholder="New York" />
                      @if (shippingForm.city().touched() && shippingForm.city().errors().length) {
                        <mat-error>{{ shippingForm.city().errors()[0].message }}</mat-error>
                      }
                    </mat-form-field>

                    <mat-form-field appearance="outline">
                      <mat-label>State</mat-label>
                      <input matInput [formField]="shippingForm.state" placeholder="NY" />
                      @if (shippingForm.state().touched() && shippingForm.state().errors().length) {
                        <mat-error>{{ shippingForm.state().errors()[0].message }}</mat-error>
                      }
                    </mat-form-field>

                    <mat-form-field appearance="outline">
                      <mat-label>Zip Code</mat-label>
                      <input matInput [formField]="shippingForm.zip" placeholder="10001" />
                      @if (shippingForm.zip().touched() && shippingForm.zip().errors().length) {
                        <mat-error>{{ shippingForm.zip().errors()[0].message }}</mat-error>
                      }
                    </mat-form-field>
                  </div>

                  <div class="step-actions">
                    <button
                      mat-flat-button
                      color="primary"
                      matStepperNext
                      [disabled]="shippingForm().invalid()"
                    >
                      NEXT
                    </button>
                  </div>
                </form>
              </mat-step>

              <!-- Step 2: Payment Details -->
              <mat-step [completed]="paymentForm().valid()">
                <ng-template matStepLabel>Payment Details</ng-template>
                <form class="step-form">
                  <div class="form-row">
                    <mat-form-field appearance="outline">
                      <mat-label>Card Number</mat-label>
                      <input
                        matInput
                        [formField]="paymentForm.cardNumber"
                        placeholder="0000 0000 0000 0000"
                      />
                      @if (
                        paymentForm.cardNumber().touched() &&
                        paymentForm.cardNumber().errors().length
                      ) {
                        <mat-error>{{ paymentForm.cardNumber().errors()[0].message }}</mat-error>
                      }
                    </mat-form-field>
                  </div>

                  <div class="form-row grid-2">
                    <mat-form-field appearance="outline">
                      <mat-label>Expiry Date</mat-label>
                      <input matInput [formField]="paymentForm.expiry" placeholder="MM/YY" />
                      @if (paymentForm.expiry().touched() && paymentForm.expiry().errors().length) {
                        <mat-error>{{ paymentForm.expiry().errors()[0].message }}</mat-error>
                      }
                    </mat-form-field>

                    <mat-form-field appearance="outline">
                      <mat-label>CVV</mat-label>
                      <input matInput [formField]="paymentForm.cvv" placeholder="123" />
                      @if (paymentForm.cvv().touched() && paymentForm.cvv().errors().length) {
                        <mat-error>{{ paymentForm.cvv().errors()[0].message }}</mat-error>
                      }
                    </mat-form-field>
                  </div>

                  <div class="step-actions">
                    <button mat-button matStepperPrevious>BACK</button>
                    <button
                      mat-flat-button
                      color="primary"
                      matStepperNext
                      [disabled]="paymentForm().invalid()"
                    >
                      NEXT
                    </button>
                  </div>
                </form>
              </mat-step>

              <!-- Step 3: Review Order -->
              <mat-step>
                <ng-template matStepLabel>Review Order</ng-template>
                <div class="review-order">
                  <div class="review-section">
                    <h3>Shipping to:</h3>
                    <p>{{ shippingModel().fullName }}</p>
                    <p>{{ shippingModel().address }}</p>
                    <p>
                      {{ shippingModel().city }}, {{ shippingModel().state }}
                      {{ shippingModel().zip }}
                    </p>
                  </div>

                  <mat-divider></mat-divider>

                  <div class="review-section">
                    <h3>Payment:</h3>
                    <p>Card ending in {{ paymentModel().cardNumber.slice(-4) }}</p>
                  </div>

                  <div class="step-actions">
                    <button mat-button matStepperPrevious>BACK</button>
                    <button
                      mat-flat-button
                      color="warn"
                      (click)="onPlaceOrder()"
                      [disabled]="isPlacingOrder()"
                    >
                      @if (isPlacingOrder()) {
                        PLACING ORDER...
                      } @else {
                        CONFIRM & PLACE ORDER
                      }
                    </button>
                  </div>
                </div>
              </mat-step>
            </mat-stepper>
          </div>

          <!-- Order Summary Sidebar -->
          <div class="order-summary">
            <mat-card appearance="outlined">
              <mat-card-header>
                <mat-card-title>Order Summary</mat-card-title>
              </mat-card-header>
              <mat-card-content>
                <div class="summary-items">
                  @for (item of cartService.cartItems(); track item.id) {
                    <div class="summary-item">
                      <span class="item-info">{{ item.quantity }}x {{ item.title }}</span>
                      <span class="item-price">{{ item.total.toFixed(2) }}</span>
                    </div>
                  }
                </div>
                <mat-divider></mat-divider>
                <div class="summary-totals">
                  <div class="total-row">
                    <span>Subtotal</span>
                    <span>{{ cartService.cartTotal().toFixed(2) }}</span>
                  </div>
                  <div class="total-row">
                    <span>Shipping</span>
                    <span>FREE</span>
                  </div>
                  <mat-divider></mat-divider>
                  <div class="total-row grand-total">
                    <span>Total</span>
                    <span>{{ cartService.cartTotal().toFixed(2) }}</span>
                  </div>
                </div>
              </mat-card-content>
            </mat-card>
          </div>
        </div>
      }
    </div>
  `,
  styles: `
    .checkout-container {
      max-width: 1200px;
      margin: 2rem auto;
      padding: 0 1rem;
    }
    .checkout-title {
      margin-bottom: 2rem;
      font-weight: 600;
    }
    .checkout-layout {
      display: grid;
      grid-template-columns: 1fr 350px;
      gap: 2rem;
    }
    @media (max-width: 900px) {
      .checkout-layout {
        grid-template-columns: 1fr;
      }
    }
    .step-form {
      padding: 1rem 0;
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }
    .form-row {
      width: 100%;
      mat-form-field {
        width: 100%;
      }
    }
    .grid-3 {
      display: grid;
      grid-template-columns: 1fr 1fr 1fr;
      gap: 1rem;
    }
    .grid-2 {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 1rem;
    }
    .step-actions {
      margin-top: 1.5rem;
      display: flex;
      gap: 1rem;
    }
    .order-summary {
      position: sticky;
      top: 100px;
      height: fit-content;
    }
    .summary-items {
      margin: 1rem 0;
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
    }
    .summary-item {
      display: flex;
      justify-content: space-between;
      font-size: 0.9rem;
      .item-info {
        color: var(--mat-sys-on-surface-variant);
      }
    }
    .summary-totals {
      margin-top: 1rem;
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }
    .total-row {
      display: flex;
      justify-content: space-between;
      &.grand-total {
        font-weight: 600;
        font-size: 1.1rem;
        margin-top: 0.5rem;
        color: var(--mat-sys-primary);
      }
    }
    .review-section {
      padding: 1rem 0;
      h3 {
        margin-bottom: 0.5rem;
        font-size: 1rem;
      }
      p {
        margin: 0.25rem 0;
        color: var(--mat-sys-on-surface-variant);
      }
    }
    .empty-cart-card {
      text-align: center;
      padding: 3rem 1rem;
      .empty-icon {
        font-size: 4rem;
        width: 4rem;
        height: 4rem;
        margin-bottom: 1rem;
        color: var(--mat-sys-outline);
      }
      p {
        margin-bottom: 2rem;
        font-size: 1.1rem;
      }
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CheckoutComponent {
  protected readonly cartService = inject(CartService);
  protected readonly userService = inject(UserService);
  private readonly router = inject(Router);

  readonly isPlacingOrder = signal(false);

  // --- Shipping Form ---
  readonly shippingModel = signal({
    fullName: '',
    address: '',
    city: '',
    state: '',
    zip: '',
  });

  readonly shippingForm = form(this.shippingModel, (s) => {
    required(s.fullName, { message: 'Full name is required' });
    required(s.address, { message: 'Address is required' });
    required(s.city, { message: 'City is required' });
    required(s.state, { message: 'State is required' });
    required(s.zip, { message: 'Zip code is required' });
    pattern(s.zip, /^\d{5}$/, { message: 'Zip must be 5 digits' });
  });

  // --- Payment Form ---
  readonly paymentModel = signal({
    cardNumber: '',
    expiry: '',
    cvv: '',
  });

  readonly paymentForm = form(this.paymentModel, (s) => {
    required(s.cardNumber, { message: 'Card number is required' });
    pattern(s.cardNumber, /^\d{16}$/, { message: 'Card number must be 16 digits' });
    required(s.expiry, { message: 'Expiry is required' });
    pattern(s.expiry, /^(0[1-9]|1[0-2])\/\d{2}$/, { message: 'Format MM/YY' });
    required(s.cvv, { message: 'CVV is required' });
    pattern(s.cvv, /^\d{3}$/, { message: 'CVV must be 3 digits' });
  });

  constructor() {
    // Pre-fill user info if available
    const user = this.userService.currentUser();
    if (user) {
      this.shippingModel.update((m) => ({
        ...m,
        fullName: `${user.firstName} ${user.lastName}`,
        address: user.address?.address || '',
        city: user.address?.city || '',
        state: user.address?.state || '',
        zip: user.address?.postalCode || '',
      }));
    }
  }

  onPlaceOrder() {
    submit(this.shippingForm, async () => {
      // Check payment form too
      await submit(this.paymentForm, async () => {
        this.isPlacingOrder.set(true);
        try {
          // Simulate API call
          await new Promise((resolve) => setTimeout(resolve, 2000));

          // Clear cart
          const cartId = this.cartService.activeCartId();
          if (cartId) {
            await this.cartService.deleteCart(cartId);
          }

          alert('Order placed successfully! Thank you for your purchase.');
          this.router.navigate(['/products']);
        } catch (err) {
          console.error('Checkout failed:', err);
          alert('Failed to place order. Please try again.');
        } finally {
          this.isPlacingOrder.set(false);
        }
      });
    });
  }
}
