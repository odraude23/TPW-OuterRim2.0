import { Component, inject } from '@angular/core';
import { Cart } from '../model/cart';
import { Product } from '../model/product';
import { CartService } from '../cart.service';
import { CommonModule } from '@angular/common';
import { CurrentUserService } from '../current-user.service';
import { ProductBoxComponent } from '../product-box/product-box.component';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, ProductBoxComponent, RouterLink],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.css'
})
export class CartComponent {
  products: Product[] = [];
  total: number = 0;

  cartService: CartService = inject(CartService);
  currentUserService: CurrentUserService = inject(CurrentUserService);

  constructor() {
    this.currentUserService.getCurrentUser().then(user => {
      this.cartService.getCart(user.id).then(products => {
        this.products = products;
        for (let product of this.products) {
          this.total += product.price;
        }
      });
    });
  }
}
