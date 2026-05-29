import { ChangeDetectionStrategy, Component, inject, input, numberAttribute } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatChipsModule } from '@angular/material/chips';
import { Router } from '@angular/router';
import { ProductService } from '../../product.service';

@Component({
  selector: 'app-product-detail',
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatChipsModule,
  ],
  templateUrl: './product-detail.html',
  styleUrl: './product-detail.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductDetail {
  private readonly productService = inject(ProductService);
  private readonly router = inject(Router);

  productId = input.required({ transform: numberAttribute });

  // Use the service's resource for fetching the product
  protected readonly productResource = this.productService.getProductResource(() => this.productId());

  goBack(): void {
    this.router.navigate(['/products']);
  }
}
