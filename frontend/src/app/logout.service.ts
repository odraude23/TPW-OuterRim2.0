import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LogoutService {

  constructor() { }

  async logout(): Promise<boolean> {
    localStorage.removeItem('token');
    localStorage.removeItem('user');

    return true;
  }
}
