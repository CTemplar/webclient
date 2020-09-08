import { AppConfig } from '../../../environments/environment';

export class LoggerService {
  constructor() {}

  public static log(message?: any, ...optionalParams: any[]) {
    if (AppConfig.production === false) {
      console.log(message, optionalParams);
    }
  }

  public static error(message?: any, ...optionalParams: any[]) {
    if (AppConfig.production === false) {
      console.error(message, optionalParams);
    }
  }
}
