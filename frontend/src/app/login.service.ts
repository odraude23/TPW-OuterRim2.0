import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  private base_url: string = 'http://localhost:8002/';

  constructor() { }

  async login(username: string, password: string): Promise<boolean> {
    const url: string = this.base_url + 'api/login';

    const data: Response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ username: username, password: password })
    });

    const response: any = await data.json();

    if (response.token) {
      localStorage.setItem('token', response.token);
      localStorage.setItem('user', response.user.id);
      return true;
    }
    else {
      return false;
    }
  }
}
