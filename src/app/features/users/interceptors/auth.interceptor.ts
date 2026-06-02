import { HttpInterceptorFn } from '@angular/common/http';
import { inject, Injector } from '@angular/core';
import { UserService } from '../services/user.service';

/**
 * Interceptor that adds the authentication token to the 'Authorization' header
 * for requests to the DummyJSON API.
 * * 💡 تم حل مشكلة الـ Circular Dependency (NG0200) عبر استخدام الـ Injector
 * لتأجيل استخراج الـ UserService إلى وقت تنفيذ الطلب وليس وقت بناء الـ Interceptor.
 */
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  // 1️⃣ حقن الـ Injector الرئيسي للـ App بدلاً من الخدمة مباشرة
  const injector = inject(Injector);

  // 2️⃣ استخراج الـ UserService يدوياً ولحظياً داخل دالة المعالجة فقط عند تدفق الطلب
  const userService = injector.get(UserService);
  const token = userService.token();

  // تزويد الطلبات المتجهة إلى DummyJSON بترويسة الأمان في حال توفر الـ Token
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
