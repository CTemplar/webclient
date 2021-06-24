import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { AppConfig } from './environments/environment';

if (AppConfig.production) {
  enableProdMode();
  if (window) {
    window.console.log = () => {};
    window.console.error = () => {};
  }
}

platformBrowserDynamic()
  .bootstrapModule(AppModule, {
    preserveWhitespaces: false,
  })
  .catch(error => console.error(error));
