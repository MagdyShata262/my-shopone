import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { RouterModule } from '@angular/router';
import { CartService } from '../../../cart.service';

@Component({
  selector: 'app-cart-list',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    RouterModule,
  ],
  template: `
    <div class="container mt-4">
      <h2>All Carts</h2>
      
      @if (cartService.cartsResource.isLoading()) {
        <div class="d-flex justify-content-center p-5">
          <mat-spinner diameter="50"></mat-spinner>
        </div>
      } @else if (cartService.cartsResource.error()) {
        <div class="alert alert-danger">Failed to load carts.</div>
      } @else {
        @let data = cartService.cartsResource.value();
        @if (data && data.carts.length > 0) {
          <table mat-table [dataSource]="data.carts" class="mat-elevation-z2 w-100">
            <ng-container matColumnDef="id">
              <th mat-header-cell *matHeaderCellDef> ID </th>
              <td mat-cell *matCellDef="let cart"> {{cart.id}} </td>
            </ng-container>

            <ng-container matColumnDef="userId">
              <th mat-header-cell *matHeaderCellDef> User ID </th>
              <td mat-cell *matCellDef="let cart"> {{cart.userId}} </td>
            </ng-container>

            <ng-container matColumnDef="totalProducts">
              <th mat-header-cell *matHeaderCellDef> Items </th>
              <td mat-cell *matCellDef="let cart"> {{cart.totalProducts}} </td>
            </ng-container>

            <ng-container matColumnDef="total">
              <th mat-header-cell *matHeaderCellDef> Total </th>
              <td mat-cell *matCellDef="let cart"> {{cart.total | currency}} </td>
            </ng-container>

            <ng-container matColumnDef="actions">
              <th mat-header-cell *matHeaderCellDef> Actions </th>
              <td mat-cell *matCellDef="let cart">
                <button mat-button color="primary" [routerLink]="['/carts', cart.id]">VIEW</button>
              </td>
            </ng-container>

            <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
            <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
          </table>
        } @else {
          <p>No carts found.</p>
        }
      }
    </div>
  `,
  styles: [`
    .container { max-width: 1000px; }
    table { border-radius: 8px; overflow: hidden; }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CartListComponent {
  protected readonly cartService = inject(CartService);
  displayedColumns: string[] = ['id', 'userId', 'totalProducts', 'total', 'actions'];
}
