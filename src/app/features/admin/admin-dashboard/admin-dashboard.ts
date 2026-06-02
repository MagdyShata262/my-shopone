import { Component, ChangeDetectionStrategy, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { ProductService } from '../../../product.service';
import { Product } from '../../../product.model';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatDialogModule,
    MatSnackBarModule,
    MatPaginatorModule,
    MatProgressSpinnerModule,
  ],
  template: `
    <div class="admin-container">
      <header class="admin-header">
        <h1>Product Administration</h1>
        <button mat-flat-button color="primary" (click)="onAddProduct()">
          <mat-icon>add</mat-icon> ADD NEW PRODUCT
        </button>
      </header>

      @if (productService.productsResource.isLoading()) {
        <div class="loading-shade">
          <mat-spinner></mat-spinner>
        </div>
      }

      <mat-card appearance="outlined">
        <mat-card-content class="table-container">
          <table mat-table [dataSource]="products()">
            <!-- ID Column -->
            <ng-container matColumnDef="id">
              <th mat-header-cell *matHeaderCellDef> ID </th>
              <td mat-cell *matCellDef="let p"> {{p.id}} </td>
            </ng-container>

            <!-- Image Column -->
            <ng-container matColumnDef="image">
              <th mat-header-cell *matHeaderCellDef> Image </th>
              <td mat-cell *matCellDef="let p">
                <img [src]="p.thumbnail" [alt]="p.title" class="table-thumb">
              </td>
            </ng-container>

            <!-- Title Column -->
            <ng-container matColumnDef="title">
              <th mat-header-cell *matHeaderCellDef> Title </th>
              <td mat-cell *matCellDef="let p"> {{p.title}} </td>
            </ng-container>

            <!-- Category Column -->
            <ng-container matColumnDef="category">
              <th mat-header-cell *matHeaderCellDef> Category </th>
              <td mat-cell *matCellDef="let p"> {{p.category}} </td>
            </ng-container>

            <!-- Price Column -->
            <ng-container matColumnDef="price">
              <th mat-header-cell *matHeaderCellDef> Price </th>
              <td mat-cell *matCellDef="let p"> {{p.price | currency}} </td>
            </ng-container>

            <!-- Stock Column -->
            <ng-container matColumnDef="stock">
              <th mat-header-cell *matHeaderCellDef> Stock </th>
              <td mat-cell *matCellDef="let p"> {{p.stock}} </td>
            </ng-container>

            <!-- Actions Column -->
            <ng-container matColumnDef="actions">
              <th mat-header-cell *matHeaderCellDef> Actions </th>
              <td mat-cell *matCellDef="let p">
                <button mat-icon-button color="accent" (click)="onEditProduct(p)" title="Edit">
                  <mat-icon>edit</mat-icon>
                </button>
                <button mat-icon-button color="warn" (click)="onDeleteProduct(p)" title="Delete">
                  <mat-icon>delete</mat-icon>
                </button>
              </td>
            </ng-container>

            <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
            <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
          </table>

          <mat-paginator
            [length]="totalProducts()"
            [pageSize]="pageSize()"
            [pageSizeOptions]="[5, 10, 25, 50]"
            (page)="onPageChange($event)">
          </mat-paginator>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: `
    .admin-container {
      max-width: 1200px;
      margin: 2rem auto;
      padding: 0 1rem;
    }
    .admin-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 2rem;
      h1 { margin: 0; font-weight: 600; }
    }
    .table-container {
      padding: 0 !important;
      overflow-x: auto;
    }
    table {
      width: 100%;
    }
    .table-thumb {
      width: 40px;
      height: 40px;
      border-radius: 4px;
      object-fit: cover;
      margin: 4px 0;
    }
    .loading-shade {
      display: flex;
      justify-content: center;
      padding: 2rem;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminDashboardComponent {
  protected readonly productService = inject(ProductService);
  private readonly snackBar = inject(MatSnackBar);

  displayedColumns: string[] = ['id', 'image', 'title', 'category', 'price', 'stock', 'actions'];

  products = computed(() => this.productService.productsResource.value()?.products ?? []);
  totalProducts = computed(() => this.productService.productsResource.value()?.total ?? 0);
  pageSize = computed(() => this.productService.limit());

  onPageChange(event: PageEvent) {
    this.productService.limit.set(event.pageSize);
    this.productService.skip.set(event.pageIndex * event.pageSize);
  }

  onAddProduct() {
    alert('Add Product functionality would open a dialog here.');
    // Implementation for dialog would go here
  }

  onEditProduct(product: Product) {
    alert(`Editing ${product.title}`);
    // Implementation for dialog would go here
  }

  async onDeleteProduct(product: Product) {
    if (confirm(`Are you sure you want to delete "${product.title}"?`)) {
      try {
        await this.productService.deleteProduct(product.id);
        this.snackBar.open('Product deleted successfully (mock)', 'Close', { duration: 3000 });
        // Since DummyJSON doesn't actually delete, we just mock the feedback
        this.productService.productsResource.reload();
      } catch (err) {
        this.snackBar.open('Failed to delete product', 'Close', { duration: 3000 });
      }
    }
  }
}
