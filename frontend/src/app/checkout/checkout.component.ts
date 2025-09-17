import { Component, inject } from '@angular/core';
import { Product } from '../model/product';
import { CartService } from '../cart.service';
import { CommonModule, Location } from '@angular/common';
import { CurrentUserService } from '../current-user.service';
import { Router } from '@angular/router';
import { User } from '../model/user';

@Component({
  selector: 'app-checkout',
  imports: [CommonModule],
  templateUrl: './checkout.component.html',
  styleUrl: './checkout.component.css'
})
export class CheckoutComponent {
  products: Product[] = [];
  user!: User;
  total: number = 0;

  cartService: CartService = inject(CartService);
  currentUserService: CurrentUserService = inject(CurrentUserService);

  constructor(private location: Location, private router: Router) {
    this.currentUserService.getCurrentUser().then(user => {
      this.user = user;
      this.cartService.getCart(user.id).then(products => {
        this.products = products;
        for (let product of this.products) {
          this.total += product.price;
        }
      });
    });
  }

  goBack(): void {
    this.location.back();
  }

  order(): void {
    this.cartService.checkout(this.user.id, this.products).then(() => {
      this.products = [];
      this.total = 0;
      console.log("Order placed successfully!");
      this.router.navigate(['/']).then(() => {
        window.location.reload();
      });
    });
  }
}
