import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-footer',
  imports: [RouterLink],
  template: `
    <footer class="footer mt-auto py-5 bg-dark text-white">
      <div class="container">
        <div class="row g-4">
          <!-- Brand & Description -->
          <div class="col-lg-4 col-md-6">
            <h5 class="text-uppercase fw-bold mb-4">My Shop</h5>
            <p class="text-white-50">
              Your one-stop destination for premium products. We bring quality and style 
              straight to your doorstep with unmatched customer service.
            </p>
            <div class="d-flex gap-3 fs-4 mt-3">
              <a href="#" class="text-white-50 hover-light"><i class="bi bi-facebook"></i></a>
              <a href="#" class="text-white-50 hover-light"><i class="bi bi-twitter-x"></i></a>
              <a href="#" class="text-white-50 hover-light"><i class="bi bi-instagram"></i></a>
              <a href="#" class="text-white-50 hover-light"><i class="bi bi-linkedin"></i></a>
            </div>
          </div>

          <!-- Quick Links -->
          <div class="col-lg-2 col-md-6">
            <h6 class="text-uppercase fw-bold mb-4">Quick Links</h6>
            <ul class="list-unstyled mb-0">
              <li class="mb-2">
                <a routerLink="/" class="text-white-50 text-decoration-none hover-light">Home</a>
              </li>
              <li class="mb-2">
                <a routerLink="/products" class="text-white-50 text-decoration-none hover-light">Products</a>
              </li>
              <li class="mb-2">
                <a routerLink="/cart" class="text-white-50 text-decoration-none hover-light">My Cart</a>
              </li>
              <li class="mb-2">
                <a href="#" class="text-white-50 text-decoration-none hover-light">Order History</a>
              </li>
            </ul>
          </div>

          <!-- Support -->
          <div class="col-lg-3 col-md-6">
            <h6 class="text-uppercase fw-bold mb-4">Support</h6>
            <ul class="list-unstyled mb-0">
              <li class="mb-2">
                <a href="#" class="text-white-50 text-decoration-none hover-light">Privacy Policy</a>
              </li>
              <li class="mb-2">
                <a href="#" class="text-white-50 text-decoration-none hover-light">Terms of Service</a>
              </li>
              <li class="mb-2">
                <a href="#" class="text-white-50 text-decoration-none hover-light">Return Policy</a>
              </li>
              <li class="mb-2">
                <a href="#" class="text-white-50 text-decoration-none hover-light">FAQs</a>
              </li>
            </ul>
          </div>

          <!-- Contact -->
          <div class="col-lg-3 col-md-6">
            <h6 class="text-uppercase fw-bold mb-4">Contact Us</h6>
            <p class="text-white-50 mb-2">
              <i class="bi bi-geo-alt-fill me-2"></i> 123 Commerce Ave, Suite 100<br>
              Shopping City, SC 12345
            </p>
            <p class="text-white-50 mb-2">
              <i class="bi bi-envelope-fill me-2"></i> support&#64;myshop.com
            </p>
            <p class="text-white-50 mb-0">
              <i class="bi bi-telephone-fill me-2"></i> +1 (555) 000-0000
            </p>
          </div>
        </div>

        <hr class="my-5 border-white-10">

        <div class="row align-items-center">
          <div class="col-md-6 text-center text-md-start">
            <p class="mb-0 text-white-50 small">
              &copy; {{ currentYear }} My Shop Inc. All rights reserved.
            </p>
          </div>
          <div class="col-md-6 text-center text-md-end mt-3 mt-md-0">
            <img src="https://img.icons8.com/color/48/000000/visa.png" alt="Visa" width="32" class="me-2">
            <img src="https://img.icons8.com/color/48/000000/mastercard.png" alt="Mastercard" width="32" class="me-2">
            <img src="https://img.icons8.com/color/48/000000/paypal.png" alt="Paypal" width="32" class="me-2">
            <img src="https://img.icons8.com/color/48/000000/apple-pay.png" alt="Apple Pay" width="32">
          </div>
        </div>
      </div>
    </footer>
  `,
  styles: `
    .hover-light:hover {
      color: #fff !important;
      transition: color 0.2s ease-in-out;
    }
    .border-white-10 {
      border-color: rgba(255, 255, 255, 0.1) !important;
    }
    .bi {
      vertical-align: middle;
    }
  `,
})
export class Footer {
  protected readonly currentYear = new Date().getFullYear();
}
