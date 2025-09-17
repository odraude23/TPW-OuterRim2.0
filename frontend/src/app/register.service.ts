import { Injectable } from '@angular/core';
import { User } from './model/user';

@Injectable({
  providedIn: 'root'
})
export class RegisterService {
  private base_url: string = 'http://localhost:8002/';

  constructor() { }

  async register(name: string, username: string, email: string, password: string): Promise<boolean> {
    const url: string = this.base_url + 'api/register';

    const data: Response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ name: name, username: username, email: email, password: password })
    });

    const response: any = await data.json() ?? null;
    let user: User = response.user;

    if (user.id === 0) {
      return false;
    }

    localStorage.setItem('token', response.token);
    localStorage.setItem('user', user.id.toString());

    return true;
  }

  async checkUsername(username: string): Promise<boolean> {
    const url: string = this.base_url + 'api/users';
    const data: Response = await fetch(url);

    const users: User[] = await data.json() ?? [];

    for (let user of users) {
      if (user.username === username) {
        return true;
      }
    }
    return false;
  }
}
