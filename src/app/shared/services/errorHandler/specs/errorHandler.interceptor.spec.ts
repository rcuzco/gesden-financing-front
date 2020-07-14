import { HttpErrorResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { LoggerService } from '../../logger/logger.service';
import { ErrorHandlerInterceptor } from './../errorHandler.interceptor';

describe('shared -> ErrorHandlerInterceptor', () => {
  let errorHandlerInterceptor: ErrorHandlerInterceptor;
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        LoggerService,
        ErrorHandlerInterceptor
      ],
      imports: [
        HttpClientTestingModule
      ]
    });
    errorHandlerInterceptor = TestBed.get(ErrorHandlerInterceptor);

    spyOn(LoggerService.prototype, 'sendAllLogs').and.returnValue(true);
  });

  it('Should be defined', () => {
    expect(errorHandlerInterceptor).toBeDefined();
  });

  it('Should be return error generic', () => {
    const error = {
      message: 'error'
    };
    const responseHandler = errorHandlerInterceptor.handleError(error);
    expect(error.message).toBe(responseHandler.message);

  });

  it('Should be return error http', () => {

    const errorMessage = 'error HTTP';
    const error = new HttpErrorResponse({
      error: {
        message: errorMessage
      },
      status: 401

    });

    const responseHandler = errorHandlerInterceptor.handleError(error);
    expect('Http failure response for (unknown url): 401 undefined').toBe(responseHandler.message);

  });

  it('Should be return error ', () => {

    const errorMessage = 'error';
    const error = new Error(errorMessage);

    const responseHandler = errorHandlerInterceptor.handleError(error);
    expect(errorMessage).toBe(responseHandler.message);

  });

  it('Should be return typeError ', () => {

    const errorMessage = 'error';
    const error = new TypeError(errorMessage);

    const responseHandler = errorHandlerInterceptor.handleError(error);
    expect(errorMessage).toBe(responseHandler.message);

  });
});
