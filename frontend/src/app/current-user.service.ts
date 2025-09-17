import { Injectable } from '@angular/core';
import { User } from './model/user';

@Injectable({
  providedIn: 'root'
})
export class CurrentUserService {
  private base_url: string = 'http://localhost:8002/';

  constructor() { }

  async getCurrentUser(): Promise<User> {
    const url: string = this.base_url + 'api/user';
    const token: string = localStorage.getItem("token") ?? "";

    const data: Response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Token ' + token
      } 
    });

    const user: User = await data.json() ?? [];
    user.get_image = `${this.base_url}${user.get_image}`;

    return user;
  }

  async updateUser(user: User, password: string): Promise<boolean> {
    const url: string = this.base_url + 'api/updateAccount/' + user.id;
    const token: string = localStorage.getItem("token") ?? "";

    const data: Response = await fetch(url, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Token ' + token
      },
      body: JSON.stringify(
        {
          username: user.username,
          name: user.name,
          email: user.email,
          password: password,
          description: user.description,
        }
      )
    });

    return await data.json() ?? false;
  }

  async updateProfile(user: User): Promise<boolean> {
    const url: string = this.base_url + 'api/updateProfile/' + user.id;
    const token: string = localStorage.getItem("token") ?? "";

    const data: Response = await fetch(url, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Token ' + token
      },
      body: JSON.stringify(
        {
          username: user.username,
          name: user.name,
          email: user.email,
          description: user.description,
        }
      )
    });

    return await data.json() ?? false;
  }

  async deleteUser(user: User): Promise<any> {
    const url: string = this.base_url + 'api/deleteAccount/' + user.id;
    const token: string = localStorage.getItem("token") ?? "";
    
    const data: Response = await fetch(url, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Token ' + token
      },
    });

    return await data.text();
  }

  async updatePic(user: User, image: string): Promise<boolean> {
    const url: string = this.base_url + 'api/updateProfileImage/' + user.id;
    const token: string = localStorage.getItem("token") ?? "";

    const data: Response = await fetch(url, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Token ' + token
      },
      body: JSON.stringify(
        {
          image: image
        }
      )
    });
    
    return await data.json() ?? false; 
  }
}
