import { Injectable, resource, signal, computed, inject, Injector } from '@angular/core';
import { Product, ProductsResponse, ProductCategory, AddProductPayload } from './product.model';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private readonly baseUrl = 'https://dummyjson.com/products';
  private readonly injector = inject(Injector);

  // 1. Mock products for fallback / unit testing
  private readonly mockProducts: Product[] = [
    {
      id: 1,
      title: 'Wireless Headphones',
      price: 99.99,
      description: 'High-quality wireless headphones with noise cancellation.',
      thumbnail: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500',
      category: 'Electronics',
      discountPercentage: 10,
      rating: 4.5,
      stock: 15,
      tags: ['electronics', 'audio'],
      brand: 'AudioPhile',
      sku: 'HP-WL-001',
      weight: 0.35,
      dimensions: { width: 18, height: 20, depth: 8 },
      warrantyInformation: '1 year warranty',
      shippingInformation: 'Ships overnight',
      availabilityStatus: 'In Stock',
      reviews: [],
      returnPolicy: '30-day return policy',
      minimumOrderQuantity: 1,
      meta: {
        createdAt: '2024-01-01T00:00:00.000Z',
        updatedAt: '2024-01-01T00:00:00.000Z',
        barcode: '123456789012',
        qrCode: 'https://example.com/qr',
      },
      images: ['https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500'],
    },
    {
      id: 2,
      title: 'Smart Watch',
      price: 199.99,
      description: 'Modern smart watch with fitness tracking features.',
      thumbnail: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500',
      category: 'Electronics',
      discountPercentage: 15,
      rating: 4.7,
      stock: 8,
      tags: ['electronics', 'wearable'],
      brand: 'WristTech',
      sku: 'SW-MT-002',
      weight: 0.15,
      dimensions: { width: 4, height: 4, depth: 1 },
      warrantyInformation: '2 year warranty',
      shippingInformation: 'Ships in 2-3 business days',
      availabilityStatus: 'Low Stock',
      reviews: [],
      returnPolicy: '14-day return policy',
      minimumOrderQuantity: 1,
      meta: {
        createdAt: '2024-01-01T00:00:00.000Z',
        updatedAt: '2024-01-01T00:00:00.000Z',
        barcode: '234567890123',
        qrCode: 'https://example.com/qr',
      },
      images: ['https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500'],
    },
    {
      id: 3,
      title: 'Coffee Mug',
      price: 15.0,
      description: 'Durable ceramic coffee mug with a sleek design.',
      thumbnail: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=500',
      category: 'Home',
      discountPercentage: 0,
      rating: 4.2,
      stock: 50,
      tags: ['home', 'kitchen'],
      brand: 'Ceramica',
      sku: 'CM-CR-003',
      weight: 0.4,
      dimensions: { width: 8, height: 10, depth: 8 },
      warrantyInformation: 'No warranty',
      shippingInformation: 'Ships in 3-5 business days',
      availabilityStatus: 'In Stock',
      reviews: [],
      returnPolicy: '30-day return policy',
      minimumOrderQuantity: 2,
      meta: {
        createdAt: '2024-01-01T00:00:00.000Z',
        updatedAt: '2024-01-01T00:00:00.000Z',
        barcode: '345678901234',
        qrCode: 'https://example.com/qr',
      },
      images: ['https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=500'],
    },
    {
      id: 4,
      title: 'Leather Wallet',
      price: 45.0,
      description: 'Genuine leather wallet with multiple card slots.',
      thumbnail: 'https://images.unsplash.com/photo-1627123424574-724758594e93?w=500',
      category: 'Accessories',
      discountPercentage: 5,
      rating: 4.8,
      stock: 20,
      tags: ['accessories', 'leather'],
      brand: 'HideAndSeek',
      sku: 'LW-GL-004',
      weight: 0.1,
      dimensions: { width: 11, height: 9, depth: 2 },
      warrantyInformation: 'Lifetime warranty against manufacturing defects',
      shippingInformation: 'Ships in 1-2 business days',
      availabilityStatus: 'In Stock',
      reviews: [],
      returnPolicy: '30-day return policy',
      minimumOrderQuantity: 1,
      meta: {
        createdAt: '2024-01-01T00:00:00.000Z',
        updatedAt: '2024-01-01T00:00:00.000Z',
        barcode: '456789012345',
        qrCode: 'https://example.com/qr',
      },
      images: ['https://images.unsplash.com/photo-1627123424574-724758594e93?w=500'],
    },
  ];

  // 2. State Signals
  readonly query = signal<string>('');
  readonly selectedCategory = signal<string>('');
  readonly limit = signal<number>(10);
  readonly skip = signal<number>(0);

  // 3. Computed request parameters
  private readonly requestParams = computed(() => ({
    query: this.query(),
    category: this.selectedCategory(),
    limit: this.limit(),
    skip: this.skip(),
  }));

  // 4. Products Resource (automatically tracks signal changes)
  readonly productsResource = resource<
    ProductsResponse,
    { query: string; category: string; limit: number; skip: number }
  >({
    params: () => this.requestParams(),
    loader: async ({ params, abortSignal }) => {
      let url = this.baseUrl;

      if (params.query) {
        url = `${this.baseUrl}/search?q=${encodeURIComponent(params.query)}&limit=${params.limit}&skip=${params.skip}`;
      } else if (params.category) {
        url = `${this.baseUrl}/category/${encodeURIComponent(params.category)}?limit=${params.limit}&skip=${params.skip}`;
      } else {
        url = `${this.baseUrl}?limit=${params.limit}&skip=${params.skip}`;
      }

      try {
        const response = await fetch(url, { signal: abortSignal });
        if (!response.ok) {
          throw new Error('Failed to fetch products');
        }
        return (await response.json()) as ProductsResponse;
      } catch (err) {
        console.warn('Network request failed, falling back to mock products:', err);
        return {
          products: this.mockProducts,
          total: this.mockProducts.length,
          skip: params.skip,
          limit: params.limit,
        };
      }
    },
  });

  readonly currentPage = computed(() => Math.floor(this.skip() / this.limit()));

  // 5. Categories Resource
  readonly categoriesResource = resource<ProductCategory[], undefined>({
    loader: async ({ abortSignal }) => {
      try {
        const response = await fetch(`${this.baseUrl}/categories`, { signal: abortSignal });
        if (!response.ok) {
          throw new Error('Failed to fetch categories');
        }
        return (await response.json()) as ProductCategory[];
      } catch (err) {
        console.warn('Failed to fetch categories:', err);
        return [];
      }
    },
  });

  // 6. Get a single product synchronously from mock data (for testing / fallback)
  getProduct(id: number): Product | undefined {
    return this.mockProducts.find((p) => p.id === id);
  }

  // 7. Get a single product as an asynchronous resource
  getProductResource(id: number | (() => number)) {
    const idSignal = typeof id === 'function' ? computed(id) : signal(id);
    return resource<Product, number>({
      params: () => idSignal(),
      loader: async ({ params: productId, abortSignal }) => {
        try {
          const response = await fetch(`${this.baseUrl}/${productId}`, { signal: abortSignal });
          if (!response.ok) {
            throw new Error('Product not found');
          }
          return (await response.json()) as Product;
        } catch (err) {
          const mock = this.getProduct(productId);
          if (mock) {
            return mock;
          }
          throw err;
        }
      },
      injector: this.injector,
    });
  }

  // 8. CRUD mutations using Fetch (returns Promise)
  async addProduct(payload: AddProductPayload): Promise<Product> {
    const response = await fetch(`${this.baseUrl}/add`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!response.ok) {
      throw new Error('Failed to add product');
    }
    return (await response.json()) as Product;
  }

  async updateProduct(id: number, payload: Partial<Product>): Promise<Product> {
    const response = await fetch(`${this.baseUrl}/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!response.ok) {
      throw new Error('Failed to update product');
    }
    return (await response.json()) as Product;
  }

  async deleteProduct(id: number): Promise<Product & { isDeleted: boolean; deletedOn: string }> {
    const response = await fetch(`${this.baseUrl}/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      throw new Error('Failed to delete product');
    }
    return (await response.json()) as Product & { isDeleted: boolean; deletedOn: string };
  }
}
