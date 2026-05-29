import { Injectable, resource, signal, computed, inject, Injector } from '@angular/core';
import { Cart, CartsResponse, UpdateCartPayload } from './cart.model';

export interface AddCartPayload {
  userId: number;
  products: { id: number; quantity: number }[];
}

@Injectable({
  providedIn: 'root',
})
export class CartService {
  private readonly baseUrl = 'https://dummyjson.com/carts';
  private readonly injector = inject(Injector);

  // 1. Mock cart for fallback / unit testing
  private readonly mockCart: Cart = {
    id: 1,
    products: [
      {
        id: 1,
        title: 'Wireless Headphones',
        price: 99.99,
        quantity: 1,
        total: 99.99,
        discountPercentage: 10,
        discountedTotal: 89.99,
        thumbnail: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500',
      },
    ],
    total: 99.99,
    discountedTotal: 89.99,
    userId: 1,
    totalProducts: 1,
    totalQuantity: 1,
  };

  // 2. State Signals (e.g., current user's cart ID)
  readonly activeCartId = signal<number | null>(1);

  // 3. Carts List Resource
  readonly cartsResource = resource<CartsResponse, { limit: number; skip: number }>({
    params: () => ({ limit: 10, skip: 0 }),
    loader: async ({ params, abortSignal }) => {
      try {
        const response = await fetch(`${this.baseUrl}?limit=${params.limit}&skip=${params.skip}`, {
          signal: abortSignal,
        });
        if (!response.ok) throw new Error('Failed to fetch carts');
        return (await response.json()) as CartsResponse;
      } catch (err) {
        console.warn('Failed to fetch carts, returning empty list:', err);
        return { carts: [], total: 0, skip: 0, limit: 10 };
      }
    },
  });

  // 4. Current Cart Resource
  readonly cartResource = resource<Cart | null, number | null>({
    params: () => this.activeCartId(),
    loader: async ({ params: cartId, abortSignal }) => {
      if (!cartId) return null;

      try {
        const response = await fetch(`${this.baseUrl}/${cartId}`, { signal: abortSignal });
        if (!response.ok) {
          throw new Error('Failed to fetch cart');
        }
        return (await response.json()) as Cart;
      } catch (err) {
        console.warn('Network request failed, falling back to mock cart:', err);
        return this.mockCart;
      }
    },
  });

  // 5. Computed properties for the active cart
  readonly cartItems = computed(() => this.cartResource.value()?.products ?? []);
  readonly cartTotal = computed(() => this.cartResource.value()?.total ?? 0);
  readonly cartQuantity = computed(() => this.cartResource.value()?.totalQuantity ?? 0);

  // 6. Cart Mutations
  async addCart(payload: AddCartPayload): Promise<Cart> {
    const response = await fetch(`${this.baseUrl}/add`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!response.ok) {
      throw new Error('Failed to add cart');
    }
    return (await response.json()) as Cart;
  }

  async updateCart(id: number, payload: UpdateCartPayload): Promise<Cart> {
    const response = await fetch(`${this.baseUrl}/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!response.ok) {
      throw new Error('Failed to update cart');
    }
    return (await response.json()) as Cart;
  }

  async deleteCart(id: number): Promise<Cart & { isDeleted: boolean; deletedOn: string }> {
    const response = await fetch(`${this.baseUrl}/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      throw new Error('Failed to delete cart');
    }
    return (await response.json()) as Cart & { isDeleted: boolean; deletedOn: string };
  }
}
