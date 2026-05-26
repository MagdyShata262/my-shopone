import { Injectable, resource } from '@angular/core';
import { Product } from './product.model';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private readonly products: Product[] = [
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
        qrCode: 'https://example.com/qr'
      },
      images: ['https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500']
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
        qrCode: 'https://example.com/qr'
      },
      images: ['https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500']
    },
    {
      id: 3,
      title: 'Coffee Mug',
      price: 15.00,
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
        qrCode: 'https://example.com/qr'
      },
      images: ['https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=500']
    },
    {
      id: 4,
      title: 'Leather Wallet',
      price: 45.00,
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
        qrCode: 'https://example.com/qr'
      },
      images: ['https://images.unsplash.com/photo-1627123424574-724758594e93?w=500']
    }
  ];

  /**
   * Resource to fetch all products.
   * In a real app, this would use HttpClient or fetch to get data from an API.
   */
  productsResource = resource({
    loader: async () => {
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 800));
      return this.products;
    }
  });

  /**
   * Get a single product by ID.
   */
  getProduct(id: number): Product | undefined {
    return this.products.find(p => p.id === id);
  }
}
