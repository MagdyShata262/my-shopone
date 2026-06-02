import { Injectable, resource, signal, computed, inject, Injector, effect } from '@angular/core';
import { Cart, CartsResponse, UpdateCartPayload } from './cart.model';
import { UserService } from './features/users/services/user.service';
import { ProductService } from './product.service';

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
  private readonly userService = inject(UserService);
  private readonly productService = inject(ProductService);

  // التحكم في حالة السلة النشطة وفلاتر تصفح البيانات (Pagination)
  readonly activeCartId = signal<number | null>(null);
  readonly cartsPageSize = signal<number>(10);
  readonly cartsPageIndex = signal<number>(0);

  // سلة وهمية (Mock Cart) لحماية التطبيق من الانهيار عند انقطاع الاتصال (Fallback Strategy)
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

  constructor() {
    // مراقبة الجلسة الحالية: ربط السلة التلقائي بالمستخدم المسجل وتأمين البيانات عند الخروج
    effect(() => {
      const user = this.userService.currentUser();
      if (user) {
        this.activeCartId.set(user.id);
      } else {
        this.activeCartId.set(null);
        this.cartResource.set(null); // تفريغ السلة النشطة فوراً لحماية خصوصية البيانات عند الخروج
      }
    });
  }

  /**
   * دالة مساعدة خاصة لبناء الـ Headers وتمرير الـ Authorization Token بشكل موحد لجميع الطلبات
   */
  private getRequestHeaders(): HeadersInit {
    const token = this.userService.token();
    return {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };
  }

  // 1. Resource مخصص لإدارة وجلب قائمة السلال الكلية بشكل تفاعلي مع الـ Pagination
  readonly cartsResource = resource<CartsResponse, { limit: number; skip: number }>({
    params: () => ({
      limit: this.cartsPageSize(),
      skip: this.cartsPageIndex() * this.cartsPageSize(),
    }),
    loader: async ({ params, abortSignal }) => {
      try {
        const response = await fetch(`${this.baseUrl}?limit=${params.limit}&skip=${params.skip}`, {
          signal: abortSignal,
          headers: this.getRequestHeaders(),
        });
        if (!response.ok) throw new Error('Failed to fetch carts bundle');
        return (await response.json()) as CartsResponse;
      } catch (err) {
        if (err instanceof DOMException && err.name === 'AbortError') {
          return { carts: [], total: 0, skip: params.skip, limit: params.limit };
        }
        console.warn('Network tracing error for global carts:', err);
        return { carts: [], total: 0, skip: params.skip, limit: params.limit };
      }
    },
  });

  // 2. Resource إدارة السلة النشطة الحالية للمستخدم الحالي
  readonly cartResource = resource<Cart | null, number | null>({
    params: () => this.activeCartId(),
    loader: async ({ params: cartId, abortSignal }) => {
      if (!cartId) return null;

      try {
        const response = await fetch(`${`${this.baseUrl}`}/${cartId}`, {
          signal: abortSignal,
          headers: this.getRequestHeaders(),
        });
        if (!response.ok) throw new Error('Failed to fetch active cart data');
        return (await response.json()) as Cart;
      } catch (err) {
        if (err instanceof DOMException && err.name === 'AbortError') {
          return null;
        }
        console.warn('Network request failed, falling back to mock cart telemetry:', err);
        return this.mockCart;
      }
    },
  });

  // 3. الحسابات المشتقة الذكية والمحمية من القيم الفارغة (Computed Selectors)
  readonly cartItems = computed(() => this.cartResource.value()?.products ?? []);
  readonly cartTotal = computed(() => this.cartResource.value()?.total ?? 0);
  readonly cartQuantity = computed(() => this.cartResource.value()?.totalQuantity ?? 0);

  /**
   * ربط عناصر ومنتجات السلة بالتفاصيل العميقة للمنتج المتاحة في الـ ProductService
   */
  getProductResourceForCartItem(productId: number) {
    return this.productService.getProductResource(productId);
  }

  // ==========================================
  // 4. العمليات التعديلية على البيانات (Mutations)
  // ==========================================

  /**
   * إنشاء سلة تسوق جديدة ومزامنة القوائم والتحليلات الكلية للتطبيق
   */
  async addCart(payload: AddCartPayload): Promise<Cart> {
    const response = await fetch(`${this.baseUrl}/add`, {
      method: 'POST',
      headers: this.getRequestHeaders(),
      body: JSON.stringify(payload),
    });
    if (!response.ok) throw new Error('Failed to add cart pipeline');

    const newCart = (await response.json()) as Cart;

    // تحديث الحالة محلياً وإجبار السجلات الإجمالية على التحديث فوراً
    this.cartResource.set(newCart);
    this.cartsResource.reload();

    return newCart;
  }

  /**
   * تحديث محتويات السلة ومزامنة الـ Resource فوراً لمنع حدوث وميض بالواجهة (Flicker Effect)
   */
  async updateCart(id: number, payload: UpdateCartPayload): Promise<Cart> {
    const response = await fetch(`${this.baseUrl}/${id}`, {
      method: 'PUT',
      headers: this.getRequestHeaders(),
      body: JSON.stringify(payload),
    });
    if (!response.ok) throw new Error('Failed to write update changes back to server');

    const updatedCart = (await response.json()) as Cart;

    // 🚀 تحديث قيمة الـ Resource بالدالة المستقرة والمباشرة .set() لحل مشكلة الـ Compilation Error
    this.cartResource.set(updatedCart);

    return updatedCart;
  }

  /**
   * حذف السلة وتصفير مراجع العرض فوراً لمنع تعارض البيانات بالواجهات التحليلية
   */
  async deleteCart(id: number): Promise<Cart & { isDeleted: boolean; deletedOn: string }> {
    const response = await fetch(`${this.baseUrl}/${id}`, {
      method: 'DELETE',
      headers: this.getRequestHeaders(),
    });
    if (!response.ok) throw new Error('Failed to delete targeted cart sequence');

    const result = (await response.json()) as Cart & { isDeleted: boolean; deletedOn: string };

    // إذا كانت السلة المحذوفة هي نفس السلة النشطة المفتوحة، نقوم بتصفيرها فوراً
    if (this.activeCartId() === id) {
      this.activeCartId.set(null);
      this.cartResource.set(null);
    }

    // إجبار القائمة الإجمالية للسلال على التحديث لتنعكس في الـ Dashboard فوراً دون الحاجة لعمل ريفريش للمتصفح
    this.cartsResource.reload();

    return result;
  }
}
