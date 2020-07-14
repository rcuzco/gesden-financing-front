import { TestBed, inject } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { LoggerService } from '../logger.service';
import { LoggerItem } from './../../../models/logger/loggerItem.model';

describe('shared -> LoggerService', () => {
  let loggerService: LoggerService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        LoggerService
      ],
      imports: [
        HttpClientTestingModule
      ]
    });

    loggerService = TestBed.get(LoggerService);
  });

  it('Should be defined', () => {
    expect(loggerService).toBeDefined();
  });

  it('Should be return empty log', () => {

    const log = loggerService.getLogs();
    expect(log.logs.length).toBe(0);

  });

  it('Should be return 1 instance of log', () => {
    const item = <LoggerItem>{
      message: 'log',
      level: 'Error',
      timestamp: null,
      stack: null
    };
    loggerService.setLog(item);

    const log = loggerService.getLogs();
    expect(log.logs.length).toBe(1);
    expect(log.logs[0].message).toEqual(item.message);

  });

  it('Should be return empty log after clear', () => {
    const item = <LoggerItem>{
      message: 'log',
      level: 'Error',
      timestamp: null,
      stack: null
    };
    loggerService.setLog(item);

    const log = loggerService.getLogs();
    expect(log.logs.length).toBe(1);

    loggerService.clearLogs();

    const logsClear = loggerService.getLogs();
    expect(logsClear.logs.length).toBe(0);

  });

  it('Should be call sendLog', () => {
    const item = <LoggerItem>{
      message: 'log',
      level: 'Error',
      timestamp: null,
      stack: null
    };
    spyOn(loggerService, 'sendLog').and.callThrough();

    loggerService.sendLog(item);

    expect(loggerService.sendLog).toHaveBeenCalled();

  });

  it('Should be call sendAllLogs', () => {
    spyOn(loggerService, 'sendAllLogs').and.callThrough();

    loggerService.sendAllLogs();
    expect(loggerService.sendAllLogs).toHaveBeenCalled();

  });

});
