import { SessionService } from './../session/session.service';
import { Injectable } from '@angular/core';
import { GESDENPARAMS } from './../../constants/gesden-params/gesden-params';

@Injectable({
  providedIn: 'root'
})
export class GesdenService {

  public centerId: string;
  public patientId: string;
  public customerId: string;
  public userId: string;

  constructor(private sessionService: SessionService) { }

  public getCenterId(){
    if (!this.centerId) {
      const centerId = this.sessionService.getItem(GESDENPARAMS.CENTERID.value);
      this.setCenterId(centerId);
    }
    return this.centerId;
  }

  public setCenterId(centerId: string){
    this.centerId = centerId;
    if (this.centerId){
      this.sessionService.setItem(GESDENPARAMS.CENTERID.value, this.centerId);
    }
  }

  public getPatientId(){
    if (!this.patientId) {
      const patientId = this.sessionService.getItem(GESDENPARAMS.PATIENTID.value);
      this.setPatientId(patientId);
    }
    return this.patientId;
  }

  public setPatientId(patientId: string){
    this.patientId = patientId;
    if (this.patientId){
      this.sessionService.setItem(GESDENPARAMS.PATIENTID.value, this.patientId);
    }
  }

  public getCustomerId(){
    if (!this.customerId) {
      const customerId = this.sessionService.getItem(GESDENPARAMS.CUSTOMERID.value);
      this.setCustomerId(customerId);
    }
    return this.customerId;
  }

  public setCustomerId(customerId: string){
    this.customerId = customerId;
    if (this.customerId){
      this.sessionService.setItem(GESDENPARAMS.CUSTOMERID.value, this.customerId);
    }
  }

  public getUserId(){
    if (!this.userId) {
      const userId = this.sessionService.getItem(GESDENPARAMS.USERID.value);
      this.setUserId(userId);
    }
    return this.userId;
  }

  public setUserId(userId: string){
    this.userId = userId;
    if (this.userId){
      this.sessionService.setItem(GESDENPARAMS.USERID.value, this.userId);
    }
  }

  public removeParametersGesden(){
    this.userId = null;
    this.customerId = null;
    this.patientId = null;
    this.centerId = null;
  }

}
