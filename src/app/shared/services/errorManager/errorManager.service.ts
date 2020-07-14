import { Injectable } from '@angular/core';
import { ERROR_CODES } from '../../constants/error-codes';

@Injectable({
  providedIn: 'root'
})
export class ErrorManagerService {

  constructor() {/* EMPTY BLOCK */}

  getMessageAndNavigate(error): any {
    let errorObj = {
      message: 'ERROR.DEFAULT_MESSAGE',
      route: null
    };
    if (!error) {
      return errorObj;
    }
    if (error.code && ERROR_CODES[error.code]) {
      errorObj = ERROR_CODES[error.code];
      return errorObj;
    }
    return errorObj;
  }
}
