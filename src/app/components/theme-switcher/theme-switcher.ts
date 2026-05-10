import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { ThemeService, ThemeOption } from '../../services/theme.service';

@Component({
  selector: 'app-theme-switcher',
  standalone: true,
  imports: [CommonModule, MatMenuModule, MatButtonModule, MatIconModule, MatListModule],
  template: `
    <button mat-icon-button [matMenuTriggerFor]="themeMenu" aria-label="Open theme menu">
      <mat-icon>palette</mat-icon>
    </button>

    <mat-menu #themeMenu="matMenu" class="theme-menu">
      <div (click)="$event.stopPropagation()">
        <mat-selection-list [multiple]="false" (selectionChange)="onThemeChange($event.options[0].value)">
          @for (theme of themeService.themes; track theme.name) {
            <mat-list-option [value]="theme" [selected]="themeService.activeTheme().name === theme.name">
              <div class="theme-option-content">
                <div class="theme-info">
                  <div class="theme-label">{{ theme.name }}</div>
                </div>
                
                <!-- Visual Preview Box (Light/Dark representations) -->
                <div class="theme-preview-container">
                  <div class="preview-box light" [style.background-color]="theme.primary" title="Primary (Light)">
                    <div class="accent-dot" [style.background-color]="theme.accent"></div>
                  </div>
                  <div class="preview-box dark" [style.background-color]="theme.primary" style="filter: brightness(0.7)" title="Primary (Dark)">
                    <div class="accent-dot" [style.background-color]="theme.accent" style="filter: brightness(1.2)"></div>
                  </div>
                </div>
              </div>
            </mat-list-option>
          }
        </mat-selection-list>
      </div>
    </mat-menu>
  `,
  styles: `
    .theme-menu {
      min-width: 280px;
    }
    .theme-option-content {
      display: flex;
      align-items: center;
      justify-content: space-between;
      width: 100%;
      padding: 8px 0;
    }
    .theme-info {
      display: flex;
      align-items: center;
      gap: 12px;
    }
    .theme-label {
      font-weight: 500;
      font-size: 14px;
    }
    .theme-preview-container {
      display: flex;
      gap: 8px;
    }
    .preview-box {
      width: 32px;
      height: 32px;
      border-radius: 4px;
      border: 1px solid rgba(0,0,0,0.1);
      position: relative;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .accent-dot {
      width: 12px;
      height: 12px;
      border-radius: 50%;
      border: 1px solid rgba(255,255,255,0.5);
    }
    .preview-box.dark {
      background-color: #333 !important;
    }
    
    /* Ensure the radio-like indicator is prominent */
    :host ::ng-deep .mat-mdc-selection-list .mat-mdc-list-item-icon {
      display: block !important;
    }
  `
})
export class ThemeSwitcher {
  themeService = inject(ThemeService);

  onThemeChange(theme: ThemeOption) {
    this.themeService.setTheme(theme);
  }
}
