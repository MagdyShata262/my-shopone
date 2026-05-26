import { ChangeDetectionStrategy, Component, inject, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ProductService } from '../../product.service';
import { Product } from '../../product.model';

@Component({
  selector: 'app-product-list',
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './product-list.html',
  styleUrl: './product-list.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductList {
  protected readonly productService = inject(ProductService);
  productSelected = output<number>();

  selectProduct(id: number): void {
    this.productSelected.emit(id);
  }
}
