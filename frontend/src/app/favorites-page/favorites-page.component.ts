import { Component, inject } from '@angular/core';
import { Product } from '../model/product';
import { ProductService } from '../product.service';
import { CommonModule } from '@angular/common';
import { ProductBoxComponent } from '../product-box/product-box.component';
import { CurrentUserService } from '../current-user.service';
import { FavoritesService } from '../favorites.service';

@Component({
  selector: 'app-favorites-page',
  standalone: true,
  imports: [CommonModule, ProductBoxComponent],
  templateUrl: './favorites-page.component.html',
  styleUrls: ['./favorites-page.component.css']
})
export class FavoritesPageComponent {
  products: Product[] = [];
  userId: number = 0;
  
  productService: ProductService = inject(ProductService);
  currentUserService: CurrentUserService = inject(CurrentUserService);
  favoriteService: FavoritesService = inject(FavoritesService);

  constructor() {
    this.loadUserData();
  }

  private async loadUserData(): Promise<void> {
    try {
      const user = await this.currentUserService.getCurrentUser();
      if (user.id) {
        this.userId = user.id;
        this.loadFavoriteProducts();
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  }

  private async loadFavoriteProducts(): Promise<void> {
    try {
      this.products = await this.favoriteService.getFavorites(this.userId);
    } catch (error) {
      console.error('Error fetching favorite products:', error);
    }
  }
}
