import { Component, inject } from '@angular/core';
import { Product } from '../model/product';
import { ProductService } from '../product.service';
import { CommonModule } from '@angular/common';
import { ProductBoxComponent } from '../product-box/product-box.component';
import { CurrentUserService } from '../current-user.service';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-following-products',
  standalone: true,
  imports: [CommonModule, ProductBoxComponent, RouterLink],
  templateUrl: './following-products.component.html',
  styleUrls: ['./following-products.component.css']
})

export class FollowingProductsComponent {
  followedProducts: { user: string, products: Product[] }[] = [];  // Declare the followedProducts property
  userId: number = 0;

  productService: ProductService = inject(ProductService);
  currentUserService: CurrentUserService = inject(CurrentUserService);

  constructor() {
    this.loadUserData();
  }

  private async loadUserData(): Promise<void> {
    try {
      const user = await this.currentUserService.getCurrentUser();
      if (user.id) {
        this.userId = user.id;
        this.loadFollowedProducts();
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  }

  private async loadFollowedProducts(): Promise<void> {
    try {
      const products = await this.productService.getFollowingProducts(this.userId);

      // Group products by the user who posted them
      this.followedProducts = this.groupProductsByUser(products);
    } catch (error) {
      console.error('Error fetching following products:', error);
    }
  }

  private groupProductsByUser(products: Product[]): { user: string, products: Product[] }[] {
    const grouped = new Map<string, Product[]>();
  
    products.forEach(product => {
      const userName = product.user.username;  // Accessing the username directly
      if (!grouped.has(userName)) {
        grouped.set(userName, []);
      }
      grouped.get(userName)?.push(product);
    });
  
    return Array.from(grouped, ([user, products]) => ({ user, products }));
  }
}