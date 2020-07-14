import { LoggerItem } from './loggerItem.model';

export interface Logger {
  timestamp: Date;
  logs: Array<LoggerItem>;
}
