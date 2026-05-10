import { Injectable, signal, effect, Inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';

export interface ThemeOption {
  name: string;
  class: string;
  primary: string;
  accent: string;
}

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  themes: ThemeOption[] = [
    { name: 'Rose & Red', class: 'rose-red-theme', primary: '#e91e63', accent: '#f44336' },
    { name: 'Azure & Blue', class: 'azure-blue-theme', primary: '#007fff', accent: '#2196f3' },
    { name: 'Magenta & Violet', class: 'magenta-violet-theme', primary: '#ff00ff', accent: '#9c27b0' },
    { name: 'Cyan & Orange', class: 'cyan-orange-theme', primary: '#00bcd4', accent: '#ff9800' },
  ];

  activeTheme = signal<ThemeOption>(this.themes[3]); // Default to Cyan & Orange

  constructor(@Inject(DOCUMENT) private document: Document) {
    effect(() => {
      const theme = this.activeTheme();
      this.applyTheme(theme.class);
    });
  }

  setTheme(theme: ThemeOption) {
    this.activeTheme.set(theme);
  }

  private applyTheme(themeClass: string) {
    const body = this.document.body;
    this.themes.forEach((t) => body.classList.remove(t.class));
    body.classList.add(themeClass);
  }
}
