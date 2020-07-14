import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Environment } from './environment.model';

/**
 * Environment Service takes constants defined in /config/app.config.json and
 * creates a service with values and make them accesible throught a angular 2 service
 */
@Injectable({
  providedIn: 'root'
})
export class EnvironmentService {

  public data: Environment;

  constructor(private http: HttpClient) { }

  loadConfig(): Promise<any> {
    const promise = this.http.get('config.json').toPromise();
    promise.then(config =>
      this.data = config as Environment
    );
    return promise;
  }
}
