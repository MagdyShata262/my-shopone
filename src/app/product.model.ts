// features/products/models/product.model.ts

// واجهة أبعاد المنتج
export interface Dimensions {
  width: number;
  height: number;
  depth: number;
}

// واجهة مراجعة المنتج
export interface Review {
  rating: number;
  comment: string;
  date: string; // ISO date string
  reviewerName: string;
  reviewerEmail: string;
}

// واجهة البيانات الوصفية (meta)
export interface Meta {
  createdAt: string;
  updatedAt: string;
  barcode: string;
  qrCode: string;
}

// الواجهة الرئيسية للمنتج
export interface Product {
  id: number;
  title: string;
  description: string;
  category: string;
  price: number;
  discountPercentage: number;
  rating: number;
  stock: number;
  tags: string[];
  brand: string;
  sku: string;
  weight: number;
  dimensions: Dimensions;
  warrantyInformation: string;
  shippingInformation: string;
  availabilityStatus: string; // "Low Stock", "In Stock", "Out of Stock"
  reviews: Review[];
  returnPolicy: string;
  minimumOrderQuantity: number;
  meta: Meta;
  thumbnail: string;
  images: string[];
}

// استجابة قائمة المنتجات (تحتوي على مصفوفة + معلومات التصفح)
export interface ProductsResponse {
  products: Product[];
  total: number;
  skip: number;
  limit: number;
}

// (اختياري) لفئات المنتجات - حسب الـ API
export interface ProductCategory {
  slug: string;
  name: string;
  url: string;
}

// (اختياري) للبيانات المرسلة عند إضافة منتج جديد (كل الحقول اختيارية ما عدا title)
export interface AddProductPayload {
  title: string;
  description?: string;
  category?: string;
  price?: number;
  discountPercentage?: number;
  rating?: number;
  stock?: number;
  tags?: string[];
  brand?: string;
  sku?: string;
  weight?: number;
  dimensions?: Partial<Dimensions>;
  warrantyInformation?: string;
  shippingInformation?: string;
  availabilityStatus?: string;
  returnPolicy?: string;
  minimumOrderQuantity?: number;
  thumbnail?: string;
  images?: string[];
}
