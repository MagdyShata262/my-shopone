import {
  Injectable,
  signal,
  effect,
  inject,
  PLATFORM_ID,
  RendererFactory2,
  Renderer2,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

export type ThemeMode = 'light' | 'dark';

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  private readonly platformId = inject(PLATFORM_ID);
  private readonly rendererFactory = inject(RendererFactory2);
  private renderer: Renderer2;
  private readonly isBrowser = isPlatformBrowser(this.platformId);

  // 1. Signal للحالة الحالية
  readonly mode = signal<ThemeMode>('light');

  constructor() {
    this.renderer = this.rendererFactory.createRenderer(null, null);

    if (this.isBrowser) {
      this.initializeTheme();
      this.watchSystemChanges();

      // 2. Effect لمزامنة التغييرات
      effect(() => {
        const currentMode = this.mode();
        this.updateRenderedTheme(currentMode);
        localStorage.setItem('theme-mode', currentMode);
      });
    }
  }

  private initializeTheme() {
    const savedMode = localStorage.getItem('theme-mode') as ThemeMode;
    if (savedMode) {
      this.mode.set(savedMode);
    } else {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      this.mode.set(prefersDark ? 'dark' : 'light');
    }
  }

  // 3. مراقبة تغيير إعدادات الجهاز في الوقت الفعلي
  private watchSystemChanges() {
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
      // نغير الثيم فقط إذا لم يكن المستخدم قد اختار وضعاً معيناً يدوياً
      if (!localStorage.getItem('theme-mode')) {
        this.mode.set(e.matches ? 'dark' : 'light');
      }
    });
  }

  private updateRenderedTheme(currentMode: ThemeMode) {
    const root = document.documentElement;

    // تحديث الكلاسات
    if (currentMode === 'dark') {
      this.renderer.addClass(root, 'dark-mode');
      this.renderer.removeClass(root, 'light-mode');
    } else {
      this.renderer.addClass(root, 'light-mode');
      this.renderer.removeClass(root, 'dark-mode');
    }

    // 4. تحديث color-scheme لتحسين أداء المتصفح والمكونات
    this.renderer.setStyle(root, 'color-scheme', currentMode);
  }

  // toggleMode() {
  //   this.mode.update((m) => (m === 'light' ? 'dark' : 'light'));
  // }

  // داخل ThemeService.ts
  async toggleMode() {
    if (!document.startViewTransition) {
      this.mode.update((m) => (m === 'light' ? 'dark' : 'light'));
      return;
    }

    // سيعمل المتصفح أنيميشن "تبخّر" أو "تلاشي" ناعم جداً عند التبديل
    await document.startViewTransition(() => {
      this.mode.update((m) => (m === 'light' ? 'dark' : 'light'));
    }).finished;
  }
}
