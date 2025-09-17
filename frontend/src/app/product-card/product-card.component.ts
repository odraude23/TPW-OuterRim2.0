import { Component, Input, inject } from '@angular/core';
import { Product } from '../model/product';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { FavoritesService } from '../favorites.service';
import { CurrentUserService } from '../current-user.service';
import { ProductService } from '../product.service';
import { CartService } from '../cart.service';

@Component({
  selector: 'app-product-card',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './product-card.component.html',
  styleUrl: './product-card.component.css'
})
export class ProductCardComponent {
  @Input() product: Product | null = null;
  nologin: boolean = false;
  user: any = null;
  is_in_favorites: boolean = false;
  route: ActivatedRoute = inject(ActivatedRoute);
  router: Router = inject(Router);
  isMyProductsPage: boolean = false;
  isCartPage: boolean = false;
  favoritesService: FavoritesService = inject(FavoritesService);
  currentUserService: CurrentUserService = inject(CurrentUserService);
  productService: ProductService = inject(ProductService);
  cartService: CartService = inject(CartService);

  constructor() {
    let token = localStorage.getItem('token');
    if (token == null) {
      this.nologin = true;
    }
    this.currentUserService.getCurrentUser().then(user => {
      this.user = user;

      if (this.product && this.user.id) {
        this.checkIfFavorite(this.product.id, this.user.id);
      }
    });
    this.isMyProductsPage = this.router.url.includes('/my-products');
    this.isCartPage = this.router.url.includes('/cart');
  }

  ngOnChanges(): void {
    if (this.product && this.user.id) {
      this.checkIfFavorite(this.product.id, this.user.id);
    }
  }

  private async checkIfFavorite(productId: number, userId: number): Promise<void> {
    try {
      this.is_in_favorites = await this.favoritesService.isFavorite(productId, userId);
    } catch (error) {
      console.error('Error checking favorite status:', error);
    }
  }

  toggleFavorite(): void {
    if (!this.product || !this.user) {
      console.error('No product or user to toggle favorite status for.');
      return;
    }

    this.favoritesService.toggleFavorite(this.product.id, this.user.id)
      .then((isFavorite) => {
        this.is_in_favorites = isFavorite;
        location.reload();
      })
      .catch((error) => {
        console.error('Error toggling favorite status:', error);
      });
  }

  shouldShowFavoriteButton(): boolean {
    return this.product && this.user && this.product.user.id !== this.user.id;
  }

  deleteProduct(): void {
    if (!this.product) {
      console.error('No product to delete.');
      return;
    }

    this.productService.deleteProduct(this.product.id)
      .then(() => {
        alert('Product deleted successfully!');
        this.router.navigate(['/my-products']);
        window.location.reload();
      })
      .catch((error) => {
        console.error('Error deleting product:', error);
        alert('Failed to delete the product. Please try again.');
      });
  }

  removeFromCart(product: number, user: number): void {
    this.cartService.removeFromCart(product, user).then(() => {
      location.reload();
    });
  }
}
