// features/products/services/product.service.ts

import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import {
  Product,
  ProductsResponse,
  ProductCategory,
  AddProductPayload,
} from '../app/product.model';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private http = inject(HttpClient);
  private baseUrl = 'https://dummyjson.com/products';

  /**
   * 1. جلب جميع المنتجات مع دعم Pagination (Limit & Skip) والـ Selection والـ Sorting
   */
  getProducts(options?: {
    limit?: number;
    skip?: number;
    select?: string;
    sortBy?: string;
    order?: 'asc' | 'desc';
  }): Observable<ProductsResponse> {
    let params = new HttpParams();

    if (options) {
      if (options.limit !== undefined) params = params.set('limit', options.limit.toString());
      if (options.skip !== undefined) params = params.set('skip', options.skip.toString());
      if (options.select) params = params.set('select', options.select);
      if (options.sortBy) params = params.set('sortBy', options.sortBy);
      if (options.order) params = params.set('order', options.order);
    }

    return this.http.get<ProductsResponse>(this.baseUrl, { params });
  }

  /**
   * 2. جلب منتج واحد بواسطة الـ ID
   */
  getProductById(id: number): Observable<Product> {
    return this.http.get<Product>(`${this.baseUrl}/${id}`);
  }

  /**
   * 3. البحث عن المنتجات بالاسم أو كلمة مفتاحية
   */
  searchProducts(query: string): Observable<ProductsResponse> {
    let params = new HttpParams().set('q', query);
    return this.http.get<ProductsResponse>(`${this.baseUrl}/search`, { params });
  }

  /**
   * 4. جلب جميع تصنيفات المنتجات (كـ كائنات تحتوي على slug, name, url)
   */
  getCategories(): Observable<ProductCategory[]> {
    return this.http.get<ProductCategory[]>(`${this.baseUrl}/categories`);
  }

  /**
   * 5. جلب قائمة أسماء التصنيفات فقط (كـ مصفوفة نصوص)
   */
  getCategoryList(): Observable<string[]> {
    return this.http.get<string[]>(`${this.baseUrl}/category-list`);
  }

  /**
   * 6. جلب المنتجات التابعة لتصنيف معين
   */
  getProductsByCategory(categorySlug: string): Observable<ProductsResponse> {
    return this.http.get<ProductsResponse>(`${this.baseUrl}/category/${categorySlug}`);
  }

  /**
   * 7. إضافة منتج جديد (محاكاة POST)
   */
  addProduct(product: AddProductPayload): Observable<Product> {
    return this.http.post<Product>(`${this.baseUrl}/add`, product);
  }

  /**
   * 8. تحديث منتج (محاكاة PUT أو PATCH)
   */
  updateProduct(id: number, product: Partial<AddProductPayload>): Observable<Product> {
    return this.http.patch<Product>(`${`${this.baseUrl}/${id}`}`, product);
  }

  /**
   * 9. حذف منتج (محاكاة DELETE)
   */
  deleteProduct(id: number): Observable<Product & { isDeleted: boolean; deletedOn: string }> {
    return this.http.delete<any>(`${this.baseUrl}/${id}`);
  }
}
