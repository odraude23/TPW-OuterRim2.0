import { Component, inject } from '@angular/core';
import { Product } from '../model/product';
import { ProductService } from '../product.service';
import { CommonModule } from '@angular/common';
import { ProductBoxComponent } from '../product-box/product-box.component';
import { CurrentUserService } from '../current-user.service';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-my-products',
  standalone: true,
  imports: [CommonModule, ProductBoxComponent, RouterLink],
  templateUrl: './my-products.component.html',
  styleUrls: ['./my-products.component.css']
})

export class MyProductsComponent {
  products: Product[] = [];
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
        this.loadProducts();
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  }

  private async loadProducts(): Promise<void> {
    try {
      this.products = await this.productService.getMyProducts(this.userId);
    } catch (error) {
      console.error('Error fetching user products:', error);
    }
  }
}
