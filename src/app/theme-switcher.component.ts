import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ThemeService } from './theme.service';

@Component({
  selector: 'app-theme-switcher',
  imports: [CommonModule, MatButtonModule, MatIconModule, MatTooltipModule],
  template: `
    <button mat-icon-button (click)="themeService.toggleMode()" 
            [matTooltip]="themeService.mode() === 'light' ? 'Switch to Dark Mode' : 'Switch to Light Mode'">
      <mat-icon>
        {{ themeService.mode() === 'light' ? 'dark_mode' : 'light_mode' }}
      </mat-icon>
    </button>
  `,
  styles: [`
    :host {
      display: inline-block;
    }
  `]
})
export class ThemeSwitcherComponent {
  public themeService = inject(ThemeService);
}
