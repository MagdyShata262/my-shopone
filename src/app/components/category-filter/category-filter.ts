import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatChipsModule } from '@angular/material/chips';
import { ProductService } from '../../product.service';

@Component({
  selector: 'app-category-filter',
  imports: [CommonModule, MatChipsModule],
  templateUrl: './category-filter.html',
  styleUrl: './category-filter.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CategoryFilter {
  protected readonly productService = inject(ProductService);

  onCategorySelect(categorySlug: string): void {
    if (this.productService.selectedCategory() === categorySlug) {
      this.productService.selectedCategory.set('');
    } else {
      this.productService.selectedCategory.set(categorySlug);
    }
  }
}
