import { Injectable } from '@angular/core';
import { UtilsService } from './../utils/utils.service';
import { ApiCallUrl } from './apiCall.interface';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(private utils: UtilsService) { }

  getApiUrl(apiContextUrl: string, apiCallUrl: ApiCallUrl): string {
    for (const param in apiCallUrl.params) {
      if (apiCallUrl.params.hasOwnProperty(param)) {
        const keyFormatted = this._getKeyFormatted(apiCallUrl.params[param].key);
        apiCallUrl.path = apiCallUrl.path.replace(keyFormatted, apiCallUrl.params[param].value);
      }
    }
    const url = apiContextUrl + apiCallUrl.path;
    return url;
  }

  getApiInstance(value: ApiCallUrl): ApiCallUrl {
    return this.utils.copyDeepObject(value);
  }

  private _getKeyFormatted(key: string): string {
    return '{' + key + '}';
  }

}
