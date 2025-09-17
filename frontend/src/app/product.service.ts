import { Injectable } from '@angular/core';
import { Product } from './model/product';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  constructor() { }

  private baseUrl = 'http://127.0.0.1:8002/api'; 

  async getProducts(): Promise<Product[]> {
    const url = `${this.baseUrl}/products`; 
    const data: Response = await fetch(url);

    const products: Product[] = await data.json() ?? [];
    products.forEach(product => {
      product.image = `http://127.0.0.1:8002${product.image}`;
    });
    return products;  
  }

  async getMyProducts(userId: number): Promise<Product[]> {
    const url: string = `${this.baseUrl}/user/products/${userId}`;
    const response: Response = await fetch(url);
  
    const products: Product[] = await response.json();
    products.forEach(product => {
      product.image = `http://127.0.0.1:8002${product.image}`;
    });
    return products;
  }

  async getFollowingProducts(userId: number): Promise<Product[]> {
    const url: string = `${this.baseUrl}/user/following-products/${userId}`;
    const response: Response = await fetch(url);
  
    const products: Product[] = await response.json();
    products.forEach(product => {
      product.image = `http://127.0.0.1:8002${product.image}`;
    });
    return products;
  }

  async getProductDetails(productId: string): Promise<Product> {
    const url: string = `${this.baseUrl}/products/${productId}`;
    const response: Response = await fetch(url);

    const product: Product = await response.json();
    product.image = `http://127.0.0.1:8002${product.image}`;    
    return product;
  }

  async deleteProduct(productId: number): Promise<void> {
    const url = `${this.baseUrl}/products/${productId}/`;
    const response = await fetch(url, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',        
      },
    });
    if (!response.ok) {
      throw new Error(`Failed to delete product: ${response.statusText}`);
    }
  }

  async updateProduct(productId: string, formData: FormData): Promise<void> {
    const url = `${this.baseUrl}/products/${productId}/update`;
    const response = await fetch(url, {
      method: 'PUT',
      body: formData,
    });

    if (!response.ok) {
      throw new Error('Failed to update the product');
    }
  }
  
  async addProduct(formData: FormData): Promise<any> {
    const url = `${this.baseUrl}/products/add`;
    const response = await fetch(url, {
      method: 'POST',
      body: formData,
    });
  
    return await response.json();
  }  

  async updatePic(productId: string, imageBase64: string): Promise<boolean> {
    const url = `${this.baseUrl}/products/${productId}/updateImage`;
    
    const response = await fetch(url, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ image: imageBase64 }),
    });
  
    if (!response.ok) {
      console.error('Failed to update the product image');
      return false;
    }
  
    const responseData = await response.json();
    return responseData.success ?? false; 
  }

  async getRecommendedProducts(
    category: string,
    userId: number,
    currentProductId: number
  ): Promise<Product[]> {
    const url: string = `${this.baseUrl}/products/recommended/`; // Base URL for recommended endpoint
    
    const body = {
      category: category,
      user_id: userId,
      exclude_product_id: currentProductId
    };
  
    try {
      const response: Response = await fetch(url, {
        method: 'POST', // Use POST instead of GET
        headers: {
          'Content-Type': 'application/json', // Specify JSON format
        },
        body: JSON.stringify(body), // Send the body as JSON string
      });
  
      if (!response.ok) {
        throw new Error(`Error fetching recommended products: ${response.statusText}`);
      }
  
      const products: Product[] = await response.json();
  
      // Update image URLs
      products.forEach((product) => {
        product.image = `http://127.0.0.1:8002${product.image}`;
      });
  
      return products;
    } catch (error) {
      console.error('Error loading recommended products:', error);
      return [];
    }
  }
  
  
  
  
}