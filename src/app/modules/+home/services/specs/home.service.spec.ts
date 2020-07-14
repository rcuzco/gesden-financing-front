import { TestModuleMetadata, async } from '@angular/core/testing';
import { TestBed } from '@angular/core/testing';

import { inject } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { SBCLoadingModule } from '@sbc/components';

import { ApiService, API_CALL_URL, EnvironmentService, UtilsService } from '../../../../shared/services';
import { MOCKS } from './../../../../shared/constants/tests/mocks.constants';

import { HomeService } from '../home.service';

describe('Module Main -> Service DemoService', () => {
  let homeService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        SBCLoadingModule
      ],
      providers: [
        HomeService,
        ApiService,
        { provide: EnvironmentService, useValue: MOCKS.environmentServiceMock },
        UtilsService
      ]
    });
    homeService = TestBed.get(HomeService);
  });



  it('Should be defined', () => {
    expect(homeService).toBeDefined();
  });

});
