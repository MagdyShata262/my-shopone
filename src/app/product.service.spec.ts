import { TestBed } from '@angular/core/testing';
import { ProductService } from './product.service';
import { Product } from './product.model';

describe('ProductService', () => {
  let service: ProductService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProductService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should have products available in the resource', async () => {
    // Wait for the resource to finish loading (mock delay is 800ms)
    // We poll the isLoading signal until it's false
    await new Promise<void>((resolve) => {
      const interval = setInterval(() => {
        if (!service.productsResource.isLoading()) {
          clearInterval(interval);
          resolve();
        }
      }, 100);
    });

    const products = service.productsResource.value();
    expect(products).toBeDefined();
    expect(products?.length).toBeGreaterThan(0);
  }, 10000); // Increase timeout for this test

  it('should return a product by id', () => {
    const product = service.getProduct(1);
    expect(product).toBeDefined();
    expect(product?.title).toBe('Wireless Headphones');
  });

  it('should return undefined for non-existent product id', () => {
    const product = service.getProduct(999);
    expect(product).toBeUndefined();
  });
});
