import { Injectable } from '@angular/core';
import { AppConfig } from '../../../environments/environment';

interface Scripts {
  name: string;
  src: string;
}

export const ScriptStore: Scripts[] = [
  { name: 'stripe', src: 'https://js.stripe.com/v2/' },
];

declare var document: any;

@Injectable()
export class DynamicScriptLoaderService {

  private scripts: any = {};

  constructor() {
    if (AppConfig.production) {
      ScriptStore.push({ name: 'stripe-key', src: 'assets/js/stripe-key.js' });
    } else {
      ScriptStore.push({ name: 'stripe-key', src: 'assets/js/stripe-test-key.js' });
    }
    ScriptStore.forEach((script: any) => {
      this.scripts[script.name] = {
        loaded: false,
        src: script.src
      };
    });
  }

  load(...scripts: string[]) {
    const promises: any[] = [];
    scripts.forEach((script) => promises.push(this.loadScript(script)));
    return Promise.all(promises);
  }

  loadScript(name: string) {
    return new Promise((resolve, reject) => {
      if (!this.scripts[name].loaded) {
        const script = document.createElement('script');
        script.type = 'text/javascript';
        script.src = this.scripts[name].src;
        script.id = name;

        script.onload = () => {
          this.scripts[name].loaded = true;
          resolve({ script: name, loaded: true, status: 'Loaded' });
        };
        script.onerror = (error: any) => resolve({ script: name, loaded: false, status: 'Loaded' });
        document.getElementsByTagName('head')[0].appendChild(script);
      } else {
        resolve({ script: name, loaded: true, status: 'Already Loaded' });
      }
    });
  }

  removeStripeFromDOM() {
    if (document.getElementsByTagName('iframe')[0]) {
      document.getElementsByTagName('body')[0].removeChild(document.getElementsByTagName('iframe')[0]);
      this.removeStripeFromDOM();
    } else {

      if (this.scripts['stripe'].loaded && document.getElementById('stripe')) {
        document.getElementsByTagName('head')[0].removeChild(document.getElementById('stripe'));
        this.scripts['stripe'].loaded = false;
      }
      if (this.scripts['stripe-key'].loaded && document.getElementById('stripe-key')) {
        document.getElementsByTagName('head')[0].removeChild(document.getElementById('stripe-key'));
        this.scripts['stripe-key'].loaded = false;
      }
    }
  }

}
