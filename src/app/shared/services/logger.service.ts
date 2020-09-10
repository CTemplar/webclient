import { AppConfig } from '../../../environments/environment';

export class LoggerService {
  constructor() {}

  public static log(message?: any, ...optionalParameters: any[]) {
    if (AppConfig.production === false) {
      console.log(message, optionalParameters);
    }
  }

  public static error(message?: any, ...optionalParameters: any[]) {
    if (AppConfig.production === false) {
      console.error(message, optionalParameters);
    }
  }
}
