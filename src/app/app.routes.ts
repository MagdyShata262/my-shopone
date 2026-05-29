import { Routes } from '@angular/router';
import { ProductList } from './components/product-list/product-list';
import { ProductDetail } from './components/product-detail/product-detail';
import { CartListComponent } from './components/cart/cart-list/cart-list';
import { CartDetailComponent } from './components/cart/cart-detail/cart-detail';
import { CartDashboardComponent } from './components/cart/cart-dashboard/cart-dashboard';

export const routes: Routes = [
  { path: '', redirectTo: 'products', pathMatch: 'full' },
  { path: 'products', component: ProductList },
  { path: 'products/:productId', component: ProductDetail },
  { path: 'carts', component: CartListComponent },
  { path: 'carts/:cartId', component: CartDetailComponent },
  { path: 'cart-dashboard', component: CartDashboardComponent },
];
