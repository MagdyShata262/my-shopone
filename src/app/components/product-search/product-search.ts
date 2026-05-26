import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { ProductService } from '../../product.service';

@Component({
  selector: 'app-product-search',
  imports: [
    CommonModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
  ],
  templateUrl: './product-search.html',
  styleUrl: './product-search.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductSearch {
  protected readonly productService = inject(ProductService);

  onSearch(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.productService.query.set(input.value);
  }

  clearSearch(): void {
    this.productService.query.set('');
  }
}
