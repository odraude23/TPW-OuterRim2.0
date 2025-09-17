import { Injectable } from '@angular/core';
import { Cart } from './model/cart';
import { Product } from './model/product';
import { Order } from './model/order';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private base_url: string = 'http://localhost:8002/';

  constructor() { }

  async getCart(id: number): Promise<Product[]> {
    const url: string = this.base_url + 'api/cart/' + id;
    const token: string = localStorage.getItem("token") ?? "";

    const data: Response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Token ' + token
      },
    });

    const cart: Product[] = await data.json() ?? [];
    cart.forEach(product => {
      product.image = `${this.base_url}${product.image}`;
    });
    return cart;
  }

  async addToCart(product: number, user: number): Promise<any> {
    const url: string = this.base_url + 'api/addToCart';
    const token: string = localStorage.getItem("token") ?? "";

    const data: Response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Token ' + token
      },
      body: JSON.stringify(
        {
          product: product,
          user: user
        }
      )
    });

    return await data.json();
  }

  async removeFromCart(product: number, user: number): Promise<any> {
    const url: string = this.base_url + 'api/removeFromCart';
    const token: string = localStorage.getItem("token") ?? "";

    console.log(product, user);

    const data: Response = await fetch(url, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Token ' + token
      },
      body: JSON.stringify(
        {
          product: product,
          user: user
        }
      )
    });

    return await data.text();
  }

  async checkout(user: number, products: Product[]): Promise<any> {
    const url: string = this.base_url + 'api/checkout';
    const token: string = localStorage.getItem("token") ?? "";

    const data: Response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Token ' + token
      },
      body: JSON.stringify(
        {
          user: user,
          products: products
        }
      )
    });

    return await data.json();
  }

  async get_all_orders(): Promise<Order[]> {
    const url: string = this.base_url + 'api/orders';
    const token: string = localStorage.getItem("token") ?? "";

    const data: Response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Token ' + token
      },
    });

    return await data.json();
  }

  async get_order(id: number): Promise<Order[]> {
    const url: string = this.base_url + 'api/user/orders/' + id;
    const token: string = localStorage.getItem("token") ?? "";

    const data: Response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Token ' + token
      },
    });

    let orders: Order[] = await data.json();
    orders.forEach(order => {
      order.products.forEach(product => {
        product.image = `${this.base_url}${product.image}`;
      });
    });
    return orders
  }
}
