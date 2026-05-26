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
  }, 10000);

  it('should return a product by id from mock data', () => {
    const product = service.getProduct(1);
    expect(product).toBeDefined();
    expect(product?.title).toBe('Wireless Headphones');
  });

  it('should return undefined for non-existent product id', () => {
    const product = service.getProduct(999);
    expect(product).toBeUndefined();
  });

  it('should update query, category, limit, and skip signals', () => {
    service.query.set('laptop');
    service.selectedCategory.set('smartphones');
    service.limit.set(5);
    service.skip.set(10);

    expect(service.query()).toBe('laptop');
    expect(service.selectedCategory()).toBe('smartphones');
    expect(service.limit()).toBe(5);
    expect(service.skip()).toBe(10);
  });

  it('should have categoriesResource defined', () => {
    expect(service.categoriesResource).toBeDefined();
  });

  it('should fetch a single product using getProductResource', async () => {
    const resourceInstance = service.getProductResource(2);
    expect(resourceInstance).toBeDefined();

    // Wait for the resource to finish loading
    await new Promise<void>((resolve) => {
      const interval = setInterval(() => {
        if (!resourceInstance.isLoading()) {
          clearInterval(interval);
          resolve();
        }
      }, 100);
    });

    expect(resourceInstance.value()?.id).toBe(2);
    expect(resourceInstance.value()?.title).toBe('Smart Watch');
  });

  it('should mock addProduct using global fetch spy', async () => {
    const mockProduct: Partial<Product> = { id: 101, title: 'Mock Add Product' };
    const fetchSpy = vi.spyOn(window, 'fetch').mockResolvedValue({
      ok: true,
      json: async () => mockProduct,
    } as Response);

    const result = await service.addProduct({ title: 'Mock Add Product' });
    expect(fetchSpy).toHaveBeenCalledWith(
      'https://dummyjson.com/products/add',
      expect.objectContaining({
        method: 'POST',
        body: JSON.stringify({ title: 'Mock Add Product' })
      })
    );
    expect(result.id).toBe(101);
    expect(result.title).toBe('Mock Add Product');

    fetchSpy.mockRestore();
  });

  it('should mock updateProduct using global fetch spy', async () => {
    const mockProduct: Partial<Product> = { id: 1, title: 'Updated Title' };
    const fetchSpy = vi.spyOn(window, 'fetch').mockResolvedValue({
      ok: true,
      json: async () => mockProduct,
    } as Response);

    const result = await service.updateProduct(1, { title: 'Updated Title' });
    expect(fetchSpy).toHaveBeenCalledWith(
      'https://dummyjson.com/products/1',
      expect.objectContaining({
        method: 'PUT',
        body: JSON.stringify({ title: 'Updated Title' })
      })
    );
    expect(result.title).toBe('Updated Title');

    fetchSpy.mockRestore();
  });

  it('should mock deleteProduct using global fetch spy', async () => {
    const mockDeleteResponse = { id: 1, isDeleted: true, deletedOn: '2026-05-26T12:00:00Z' };
    const fetchSpy = vi.spyOn(window, 'fetch').mockResolvedValue({
      ok: true,
      json: async () => mockDeleteResponse,
    } as Response);

    const result = await service.deleteProduct(1);
    expect(fetchSpy).toHaveBeenCalledWith(
      'https://dummyjson.com/products/1',
      expect.objectContaining({
        method: 'DELETE'
      })
    );
    expect(result.isDeleted).toBe(true);

    fetchSpy.mockRestore();
  });
});
