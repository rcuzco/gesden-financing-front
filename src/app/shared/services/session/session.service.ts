import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SessionService {


  getItem(value) {
    return sessionStorage.getItem(value);
  }

  setItem(itemName, value: string) {
    sessionStorage.setItem(itemName, value);
  }

  removeItem(value: string) {
    sessionStorage.removeItem(value);
  }

}
