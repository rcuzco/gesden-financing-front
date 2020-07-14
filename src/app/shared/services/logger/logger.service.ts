import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Logger, LoggerItem } from './../../models/logger';

@Injectable({
  providedIn: 'root'
})
export class LoggerService {

  private log: Logger = <Logger>{};

  constructor(private rest: HttpClient) {
    this.log.logs = [];
  }

  setLog(item: LoggerItem) {

    item.timestamp = new Date(Date.now());

    this.log.logs.push(item);
  }

  sendLog(item: LoggerItem) {
    /* Send log */
  }

  sendAllLogs(): any {
    /* Send  All logs */
  }

  getLogs() {
    return this.log;
  }

  clearLogs() {
    this.log.logs = [];
    return;
  }

}
