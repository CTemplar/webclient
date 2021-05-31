import { ErrorHandler, Injectable } from '@angular/core';
import * as Sentry from '@sentry/browser';

import { AppConfig } from '../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class SentryErrorHandler implements ErrorHandler {
  handleError(error: any) {
    Sentry.captureException(error.originalError || error);
  }
}

export function errorHandlerFactory() {
  if (AppConfig.production) {
    return new SentryErrorHandler();
  }
  return new ErrorHandler();
}
