import { HttpClientModule } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { EnvironmentService } from '../environment.service';

describe('Shared -> Service EnvironmentService', () => {
  let environmentService;
  let httpMock;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [

        HttpClientModule,
        HttpClientTestingModule
      ],
      providers: [
        EnvironmentService
      ]
    });

    environmentService = TestBed.get(EnvironmentService);
    httpMock = TestBed.get(HttpTestingController);

  });

  it('Should be defined', () => {
    expect(environmentService).toBeDefined();
  });

  it('Should return promise', () => {

    const data = environmentService.loadConfig();
    expect(data instanceof Promise).toEqual(true);
  });

  it('Should store config data', () => {

    const config = { 'api1': 'http://fake.com' };

    environmentService.loadConfig().then(() => {
      expect(environmentService.data).toEqual(config);
    });
    httpMock.expectOne('config.json').flush(config);
  });

});
