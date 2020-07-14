import { Injectable } from '@angular/core';
import { Subject, BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NavTabsService {

  public navListChange: BehaviorSubject<any> = new BehaviorSubject<any>(null);

  constructor() { /* EMPTY BLOCK*/ }

  public activeNav(idNav) {
    this.navListChange.next(idNav);
  }

}
