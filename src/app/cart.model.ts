// features/carts/models/cart.model.ts

export interface CartProduct {
  id: number;
  title: string;
  price: number;
  quantity: number;
  total: number;
  discountPercentage: number;
  discountedTotal?: number; // أو discountedPrice حسب نوع الـ Endpoint
  discountedPrice?: number;
  thumbnail: string;
}

export interface Cart {
  id: number;
  products: CartProduct[];
  total: number;
  discountedTotal: number;
  userId: number;
  totalProducts: number;
  totalQuantity: number;
  isDeleted?: boolean;
  deletedOn?: string;
}

export interface CartsResponse {
  carts: Cart[];
  total: number;
  skip: number;
  limit: number;
}

// لواجهة إرسال طلب إضافة منتجات لعربة
export interface UpdateCartPayload {
  merge?: boolean;
  products: {
    id: number;
    quantity: number;
  }[];
}
