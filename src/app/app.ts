import { Component, ChangeDetectionStrategy, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatCardModule } from '@angular/material/card';

import { ThemeSwitcherComponent } from './theme-switcher.component';
import { ProductSearch } from './components/product-search/product-search';
import { CategoryFilter } from './components/category-filter/category-filter';
import { ProductList } from './components/product-list/product-list';
import { ProductDetail } from './components/product-detail/product-detail';

@Component({
  selector: 'app-root',
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatToolbarModule,
    ThemeSwitcherComponent,
    ProductSearch,
    CategoryFilter,
    ProductList,
    ProductDetail,
  ],
  templateUrl: './app.html',
  styleUrl: './app.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class App {
  selectedProductId = signal<number | null>(null);

  async onProductSelected(id: number) {
    if (!document.startViewTransition) {
      this.selectedProductId.set(id);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    await document.startViewTransition(() => {
      this.selectedProductId.set(id);
    }).finished;

    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  async onDetailClose() {
    if (!document.startViewTransition) {
      this.selectedProductId.set(null);
      return;
    }

    await document.startViewTransition(() => {
      this.selectedProductId.set(null);
    }).finished;
  }
}
