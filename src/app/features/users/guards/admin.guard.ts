import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { UserService } from '../services/user.service';

export const adminGuard: CanActivateFn = (route, state) => {
  const userService = inject(UserService);
  const router = inject(Router);

  if (userService.isAuthenticated() && userService.currentUser()?.role === 'admin') {
    return true;
  }

  // Redirect to login or home if not authorized
  return router.parseUrl('/login');
};
