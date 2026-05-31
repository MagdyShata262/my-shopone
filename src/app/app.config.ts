import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter, withComponentInputBinding, withViewTransitions, Router, isActive } from '@angular/router';
import { routes } from './app.routes';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';
import { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';
import { inject } from '@angular/core';
import { authInterceptor } from './features/users/interceptors/auth.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),

    provideRouter(
      routes, 
      withComponentInputBinding(), 
      // تمرير كائن الإعدادات المخصصة هنا
      withViewTransitions({
        onViewTransitionCreated: ({ transition, from, to }) => {
          const router = inject(Router);
          const targetUrl = router.currentNavigation()?.finalUrl;

          if (!targetUrl) return;

          // مثال: منع الأنميشن إذا كانت الصفحة الحالية هي نفسها والملحقات فقط تغيرت (مثل الـ Query Params أو الـ Fragment)
          const config = {
            paths: 'exact',
            matrixParams: 'exact',
            fragment: 'ignored',
            queryParams: 'ignored',
          } as const;

          if (router.isActive(targetUrl, config)) {
            transition.skipTransition(); // إلغاء الأنميشن فوراً لتجنب الرمش غير الضروري
          }
        }
      })
    ),

    provideClientHydration(withEventReplay()),
    provideHttpClient(
      withFetch(),
      withInterceptors([authInterceptor])
    ),
  ],
};