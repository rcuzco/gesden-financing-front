import { Injectable } from '@angular/core';
import { ApiService, EnvironmentService, API_CALL_URL } from '..';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Users } from './../../models/users/users.model';
import { GESDENPARAMS } from './../../constants/gesden-params/gesden-params';
import { GesdenService } from './../gesden/gesden.service';

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  private userInfo: Users;

  constructor(private api: ApiService, private envConf: EnvironmentService, private http: HttpClient, private gesdenService: GesdenService) {}

  getUsersID(){
    const urlPath = this.envConf.data.apiUrl + this.envConf.data.contexts.APIS;
    const apiInstance = this.api.getApiInstance(API_CALL_URL.USERS_ID);
    apiInstance.params.id.value = this.gesdenService.getUserId();
    const url = this.api.getApiUrl(urlPath, apiInstance);
    return this.http.get<Users>(url);
  }

  getUsers(){
    const url = this.envConf.data.apiUrl + this.envConf.data.contexts.APIS + API_CALL_URL.USERS.path;
    let queryParameters = new HttpParams();
    queryParameters = queryParameters.set(GESDENPARAMS.USERID.value, this.gesdenService.getUserId());
    queryParameters = queryParameters.set(GESDENPARAMS.CENTERID.value, this.gesdenService.getCenterId().toString());
    return this.http.get<Users>(url, {params: queryParameters});
  }

  setUserInfo(userInfo: Users){
    this.userInfo = userInfo;
  }

  getUserInfo(){
    return this.userInfo;
  }

}
