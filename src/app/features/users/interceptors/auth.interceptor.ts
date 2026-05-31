import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { UserService } from '../services/user.service';

/**
 * Interceptor that adds the authentication token to the 'Authorization' header
 * for requests to the DummyJSON API.
 */
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const userService = inject(UserService);
  const token = userService.token();

  // Only add the token if it exists and the request is to DummyJSON
  if (token && req.url.includes('dummyjson.com')) {
    const authReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`,
      },
    });
    return next(authReq);
  }

  return next(req);
};
