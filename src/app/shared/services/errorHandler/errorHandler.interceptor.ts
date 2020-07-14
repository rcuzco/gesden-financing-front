import { HttpErrorResponse } from '@angular/common/http';
import { ErrorHandler, Injectable } from '@angular/core';
import { LoggerItem } from './../../models/logger/loggerItem.model';
import { LoggerService } from './../logger/logger.service';

@Injectable({
  providedIn: 'root'
})
export class ErrorHandlerInterceptor implements ErrorHandler {

  constructor(private logger: LoggerService) { }

  handleError(error) {

    const loggerItem = <LoggerItem>{
      message: error.message
    };

    if (error instanceof HttpErrorResponse) {
      console.error('There was an HTTP error.', error.message, 'Status code:', (<HttpErrorResponse>error).status);
    } else if (error instanceof TypeError) {

      console.error('There was a Type error.', error.message);
      loggerItem.stack = error.stack;

    } else if (error instanceof Error) {

      console.error('There was a general error.', error.message);
      loggerItem.stack = error.stack;

    } else {
      console.error('Nobody threw an error but something happened!', error);
    }
    this.logger.setLog(loggerItem);
    this.logger.sendAllLogs();

    return loggerItem;
  }

}
