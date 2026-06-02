import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: 'products', pathMatch: 'full' },

  // استخدام loadComponent للتحميل الكسول (Lazy Loading) لرفع الأداء
  {
    path: 'products',
    loadComponent: () =>
      import('./components/product-list/product-list').then((m) => m.ProductList),
  },
  {
    path: 'products/:productId',
    loadComponent: () =>
      import('./components/product-detail/product-detail').then((m) => m.ProductDetail),
  },
  {
    path: 'carts',
    loadComponent: () =>
      import('./components/cart/cart-list/cart-list').then((m) => m.CartListComponent),
  },
  {
    path: 'carts/:cartId',
    loadComponent: () =>
      import('./components/cart/cart-detail/cart-detail').then((m) => m.CartDetailComponent),
  },
  {
    path: 'cart-dashboard',
    loadComponent: () =>
      import('./components/cart/cart-dashboard/cart-dashboard').then((m) => m.CartDashboardComponent),
  },
  {
    path: 'users',
    loadComponent: () =>
      import('./features/users/components/user-dashboard.component').then((m) => m.UserDashboardComponent),
  },
  {
    path: 'login',
    loadComponent: () =>
      import('./features/users/components/user-login/user-login.component').then((m) => m.UserLoginComponent),
  },
  {
    path: 'register',
    loadComponent: () =>
      import('./features/users/components/user-register/user-register').then((m) => m.UserRegisterComponent),
  },
  {
    path: 'checkout',
    loadComponent: () =>
      import('./components/checkout/checkout').then((m) => m.CheckoutComponent),
  },
  {
    path: 'admin',
    canActivate: [() => import('./features/users/guards/admin.guard').then((m) => m.adminGuard)],
    loadComponent: () =>
      import('./features/admin/admin-dashboard/admin-dashboard').then((m) => m.AdminDashboardComponent),
  },
  { path: '**', redirectTo: 'products' },
];
