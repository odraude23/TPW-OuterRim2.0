import { Injectable } from '@angular/core';
import { User } from './model/user';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private base_url: string = 'http://localhost:8002/';

  constructor() { }

  async getUserByUsername(username: string): Promise<User> {
    const url: string = this.base_url + 'api/user/' + username;
    const data: Response = await fetch(url);

    const user: User = await data.json() ?? [];
    user.get_image = `${this.base_url}${user.get_image}`;
    return user;
  }

  async getUsers(): Promise<User[]> {
    const url: string = this.base_url + 'api/users';
    const data: Response = await fetch(url);

    const users: User[] = await data.json() ?? [];
    return users;
  }
}
