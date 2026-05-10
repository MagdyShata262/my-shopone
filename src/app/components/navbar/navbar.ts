import { Component, input } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { ThemeSwitcher } from '../theme-switcher/theme-switcher';

@Component({
  selector: 'app-navbar',
  imports: [RouterLink, RouterLinkActive, ThemeSwitcher],
  template: `
    <nav
      class="navbar navbar-expand-lg bg-dark-custom"
      [class.fixed-top]="fixed()"
      [class.sticky-top]="sticky()"
    >
      <div class="container-fluid">
        <a class="navbar-brand" routerLink="/">My Shop</a>
        
        <div class="d-flex align-items-center gap-2">
          <app-theme-switcher></app-theme-switcher>
          
          <button
            class="navbar-toggler"
            type="button"
            data-bs-toggle="offcanvas"
            data-bs-target="#offcanvasNavbar"
            aria-controls="offcanvasNavbar"
            aria-label="Toggle navigation"
          >
            <span class="navbar-toggler-icon"></span>
          </button>
        </div>

        <div
          class="offcanvas offcanvas-end text-bg-dark"
          tabindex="-1"
          id="offcanvasNavbar"
          aria-labelledby="offcanvasNavbarLabel"
        >
          <div class="offcanvas-header">
            <h5 class="offcanvas-title" id="offcanvasNavbarLabel">Menu</h5>
            <button
              type="button"
              class="btn-close btn-close-white"
              data-bs-dismiss="offcanvas"
              aria-label="Close"
            ></button>
          </div>
          <div class="offcanvas-body">
            <ul class="navbar-nav justify-content-end flex-grow-1 pe-3">
              <li class="nav-item">
                <a
                  class="nav-link"
                  routerLink="/"
                  routerLinkActive="active"
                  [routerLinkActiveOptions]="{ exact: true }"
                  data-bs-dismiss="offcanvas"
                >
                  Home
                </a>
              </li>
              <li class="nav-item">
                <a
                  class="nav-link"
                  routerLink="/products"
                  routerLinkActive="active"
                  data-bs-dismiss="offcanvas"
                >
                  Products
                </a>
              </li>
              <li class="nav-item">
                <a
                  class="nav-link"
                  routerLink="/cart"
                  routerLinkActive="active"
                  data-bs-dismiss="offcanvas"
                >
                  Cart
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </nav>
  `,
  styles: [
    `
      .nav-link.active {
        font-weight: bold;
      }
      .navbar {
        transition: background-color 0.3s ease;
      }
    `,
  ],
})
export class Navbar {
  fixed = input<boolean>(false);
  sticky = input<boolean>(false);
}
