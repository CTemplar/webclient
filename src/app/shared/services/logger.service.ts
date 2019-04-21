import { environment } from '../../../environments/environment';

export class LoggerService {

  constructor() { }

  public static log(message?: any, ...optionalParams: any[]) {
    if (environment.production === false) {
      console.log(message, optionalParams);
    }
  }

  public static error(message?: any, ...optionalParams: any[]) {
    if (environment.production === false) {
      console.error(message, optionalParams);
    }
  }
}
