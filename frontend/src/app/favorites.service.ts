import { Injectable } from '@angular/core';
import { Product } from './model/product';

@Injectable({
  providedIn: 'root'
})
export class FavoritesService {

  constructor() { }

  private baseUrl = 'http://127.0.0.1:8002/api/favorites';

  async toggleFavorite(productId: number, userId: number): Promise<boolean> {
    const url = `${this.baseUrl}/toggle/`;
    const response: Response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json', // Specify JSON content type
      },
      body: JSON.stringify({ product_id: productId, user_id: userId })
    });

    if (!response.ok) {
      throw new Error(`Failed to toggle favorite. Status: ${response.status}`);
    }
    const data = await response.json();
    return data.is_favorite;
  }

  async isFavorite(productId: number, userId: number): Promise<boolean> {
    const url = `${this.baseUrl}/is-favorite/${productId}/${userId}/`;
    const response: Response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to check favorite status. Status: ${response.status}`);
    }
    const data = await response.json();
    return data.is_favorite;
  }

  async getFavorites(userId: number): Promise<Product[]> {
    const url = `${this.baseUrl}/${userId}`; 
    const response: Response = await fetch(url);

    if (!response.ok) {
      throw new Error('Failed to fetch favorite products');
    }

    const products: Product[] = await response.json();
    products.forEach(product => {
      product.image = `http://127.0.0.1:8002${product.image}`;
    });
    return products;  
  }
}
