import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ModalService {


  constructor() {return; }

  public showModal(){
    return true;
  }

  public hideModal(){
    return false;
  }



}
