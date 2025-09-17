import { Component, inject } from '@angular/core';
import { Product } from '../model/product';
import { ProductService } from '../product.service';
import { CommonModule } from '@angular/common';
import { ProductBoxComponent } from '../product-box/product-box.component';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-index',
  standalone: true,
  imports: [CommonModule, ProductBoxComponent, FormsModule],
  templateUrl: './index.component.html',
  styleUrl: './index.component.css'
})
export class IndexComponent {
  products: Product[] = [];  // All products fetched from the backend
  filteredProducts: Product[] = [];  // Products after applying filters
  productService: ProductService = inject(ProductService);

  // Filter form inputs
  search: string = '';
  category: Product['category'] | '' = '';  // Allow '' for no category selected
  minPrice: number | null = null;
  maxPrice: number | null = null;

  categories: Product['category'][] = ['WEAPON', 'LEGO', 'FIGURES', 'POSTER', 'COLLECTIBLE', 'OTHER'];    

  constructor() {
    this.loadProducts();
  }

  private async loadProducts(): Promise<void> {
    try {
      this.products = await this.productService.getProducts();
      this.filteredProducts = [...this.products];  // Initialize with all products
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  }

  applyFilters(): void {
    this.filteredProducts = this.products.filter((product) => {
      const matchesSearch = product.name.toLowerCase().includes(this.search.toLowerCase());
      const matchesCategory = this.category ? product.category.toLowerCase() === this.category.toLowerCase() : true;
      const matchesMinPrice = this.minPrice !== null ? product.price >= this.minPrice : true;
      const matchesMaxPrice = this.maxPrice !== null ? product.price <= this.maxPrice : true;

      return matchesSearch && matchesCategory && matchesMinPrice && matchesMaxPrice;
    });
  }

  resetFilters(): void {
    this.search = '';
    this.category = '';
    this.minPrice = null;
    this.maxPrice = null;
    this.filteredProducts = [...this.products];  // Reset to all products
  }
}
