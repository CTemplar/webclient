import { Injectable } from '@angular/core';

function getWindow(): any {
  return window;
}

@Injectable()
export class ZendeskWebWidgetService {

  private window;

  constructor() {
    this.window = getWindow();
  }

  loadZendeskWebWidget() {
    return new Promise(( resolve, reject) => {

      const accountUrl = 'ctemplar.zendesk.com';

      if (!accountUrl) {
        throw new Error(
          'Missing accountUrl. Please set in app config via ZendeskWidgetProvider'
        );
      }

      const window = this.window;
      // Following is essentially a copy paste of JS portion of the Zendesk embed code
      // with our settings subbed in. For more info, see:
      // https://support.zendesk.com/hc/en-us/articles/203908456-Using-Web-Widget-to-embed-customer-service-in-your-website

      // tslint:disable-next-line:no-unused-expression
      window.zEmbed ||
        (function(e, t) {
          var n,
            o,
            d,
            i,
            s,
            a = [],
            r = document.createElement('iframe');
          (window.zEmbed = function() {
            a.push(arguments);
          }),
            (window.zE = window.zE || window.zEmbed),
            (r.src = 'javascript:false'),
            (r.title = ''),
            (r.style.cssText = 'display: none'),
            (d = document.getElementsByTagName('script')),
            (d = d[d.length - 1]),
            d.parentNode.insertBefore(r, d),
            (i = r.contentWindow),
            (s = i.document);
          try {
            o = s;
          } catch (e) {
            (n = document.domain),
              (r.src =
                'javascript:var d=document.open();d.domain="' + n + '";void(0);'),
              (o = s);
          }
          (o.open()._l = function() {
            var e = this.createElement('script');
            n && (this.domain = n),
              (e.id = 'js-iframe-async'),
              (e.src = 'https://assets.zendesk.com/embeddable_framework/main.js'),
              (this.t = +new Date()),
              (this.zendeskHost = accountUrl),
              (this.zEQueue = a),
              this.body.appendChild(e);
          }),
            o.write('<body onload="document._l();">'),
            o.close();
        })();

        window.zE(() => {
          this.identify({
            name: '',
            email: ''
          });

          resolve();
          this.setLocale('en');
        });
    });
  }

  identify(userObj) {
    this.window.zE(() => {
      this.window.zE.identify(userObj);
    });
  }

  hide() {
    if (this.window && this.window.zE) {
      this.window.zE.hide();
    }
  }

  show() {
    if (this.window && this.window.zE) {
      this.window.zE(() => {
        this.window.zE.show();
      });
    }
  }

  activate(options?) {
    if (this.window && this.window.zE) {
      this.window.zE(() => {
        this.window.zE.activate(options);
      });
    }
  }

  setHelpCenterSuggestions(options) {
    if (this.window && this.window.zE) {
      this.window.zE(() => {
        this.window.zE.setHelpCenterSuggestions(options);
      });
    }
  }

  setLocale(language?: string) {
    if (this.window && this.window.zE) {
      this.window.zE(() => {
        this.window.zE.setLocale(language);
      });
    }
  }

  setSettings(settings) {
    this.window.zESettings = settings;
  }
}
