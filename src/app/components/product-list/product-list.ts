import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { RouterModule } from '@angular/router';
import { ProductService } from '../../product.service';
import { ProductSearch } from '../product-search/product-search';
import { CategoryFilter } from '../category-filter/category-filter';

@Component({
  selector: 'app-product-list',
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatPaginatorModule,
    RouterModule,
    ProductSearch,
    CategoryFilter,
  ],
  templateUrl: './product-list.html',
  styleUrl: './product-list.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductList {
  protected readonly productService = inject(ProductService);

  handlePageEvent(e: PageEvent) {
    this.productService.limit.set(e.pageSize);
    this.productService.skip.set(e.pageIndex * e.pageSize);
  }
}
