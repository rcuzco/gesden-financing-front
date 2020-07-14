
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ApiService, API_CALL_URL } from '../../../shared/services/api';
import { EnvironmentService } from '../../../shared/services/environment/environment.service';

import { HomeServiceModule } from './home.service.module';

@Injectable({
  providedIn: HomeServiceModule
})
@Injectable()
export class HomeService {

  constructor(private api: ApiService,
    private envConf: EnvironmentService,
    private http: HttpClient) {
    /* Block Empy */
  }

}
