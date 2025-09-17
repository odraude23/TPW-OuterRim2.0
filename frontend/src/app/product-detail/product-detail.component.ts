import { Component, inject } from '@angular/core';
import { ProductService } from '../product.service';
import { ActivatedRoute } from '@angular/router';
import { Product } from '../model/product';
import { CommonModule, Location } from '@angular/common';
import { CurrentUserService } from '../current-user.service';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { CartService } from '../cart.service';
import { FavoritesService } from '../favorites.service';
import { MessageService } from '../messages.service';
import { ProductBoxComponent } from '../product-box/product-box.component'; // Import ProductBoxComponent

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, ProductBoxComponent],
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.css'],
})
export class ProductDetailComponent {
  product!: Product;
  message: string = '';
  is_in_favorites: boolean = false;
  is_in_cart: boolean = false;
  recommendedProducts: Product[] = []; // Add recommended products

  route: ActivatedRoute = inject(ActivatedRoute);
  productService: ProductService = inject(ProductService);
  currentUserService: CurrentUserService = inject(CurrentUserService);
  cartService: CartService = inject(CartService);
  favoritesService: FavoritesService = inject(FavoritesService);
  messageService: MessageService = inject(MessageService);

  user: any = null;

  constructor(private location: Location) {
    this.initialize();
  }

  private async initialize(): Promise<void> {
    const productId = this.route.snapshot.paramMap.get('id');
    if (productId) {
      await this.loadProductDetails(productId);
      this.user = await this.currentUserService.getCurrentUser();

      // Check cart and favorites
      this.checkCartAndFavorites();

      // Fetch recommended products
      this.loadRecommendedProducts();
    }
  }

  private async loadProductDetails(id: string): Promise<void> {
    try {
      this.product = await this.productService.getProductDetails(id);
    } catch (error) {
      console.error('Error loading product details:', error);
    }
  }

  private async loadRecommendedProducts(): Promise<void> {
    try {
      if (this.product && this.user) {
        this.recommendedProducts = await this.productService.getRecommendedProducts(
          this.product.category,
          this.user.id,
          this.product.id
        );
        console.log('Recommended Products:', this.recommendedProducts);
      }
    } catch (error) {
      console.error('Error loading recommended products:', error);
    }
  }  

  private async checkCartAndFavorites(): Promise<void> {
    const cartProducts = await this.cartService.getCart(this.user.id);
    this.is_in_cart = cartProducts.some((p) => p.id === this.product.id);

    this.is_in_favorites = await this.favoritesService.isFavorite(
      this.product.id,
      this.user.id
    );
  }

  sendMessage(): void {
    if (!this.message.trim()) {
      alert('Message cannot be empty');
      return;
    }
    if (this.user && this.product?.user?.id) {
      const senderId = this.user.id;
      const receiverId = this.product.user.id;
      this.messageService
        .sendMessage(senderId, receiverId, this.message)
        .then(() => {
          alert('Message sent successfully!');
          this.message = '';
        })
        .catch((error) => {
          console.error('Error sending message:', error);
          alert('Failed to send the message. Please try again.');
        });
    }
  }

  toggleFavorite(): void {
    this.favoritesService
      .toggleFavorite(this.product.id, this.user.id)
      .then((isFavorite) => {
        this.is_in_favorites = isFavorite;
      })
      .catch((error) => {
        console.error('Error toggling favorite status:', error);
      });
  }

  addToCart(): void {
    this.cartService.addToCart(this.product.id, this.user.id).then(() => {
      this.is_in_cart = true;
    });
  }

  goBack(): void {
    this.location.back();
  }
}
