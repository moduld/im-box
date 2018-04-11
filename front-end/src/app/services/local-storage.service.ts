import { Injectable } from '@angular/core';

@Injectable()
export class LocalStorageService {

  constructor() { }

  setUser(user: any): void {
    localStorage.setItem('im-box-user', JSON.stringify(user));
  }

  getUser(): any {
    return JSON.parse(localStorage.getItem('im-box-user'));
  }

  deleteUser(): any {
    localStorage.removeItem('im-box-user');
  }
}
