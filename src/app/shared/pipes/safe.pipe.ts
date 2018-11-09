import { Pipe, PipeTransform, SecurityContext } from '@angular/core';
import { DomSanitizer, SafeHtml, SafeUrl } from '@angular/platform-browser';
import * as xss from 'xss';
import * as cssfilter from 'cssfilter';

@Pipe({
  name: 'safe',
})
export class SafePipe implements PipeTransform {

  constructor(private sanitizer: DomSanitizer) {}

  public transform(value: any, type: string = '', fromEmail): SafeHtml | SafeUrl {
    switch (type.toLowerCase()) {
      case 'html':
        if (fromEmail === 'support@ctemplar.com') {
          return this.sanitizer.bypassSecurityTrustHtml(value);
        }
        const xssValue = xss(value, {
          stripIgnoreTag: true,
          onIgnoreTagAttr: (tag, name, value, isWhiteAttr) => {
            const safeAttrValue = xss.safeAttrValue(tag, name, value, new cssfilter.FilterCSS({
              onIgnoreAttr: (name, value, opts) => {
                const blackList = {
                  position: ['fixed']
                };
                if (blackList.hasOwnProperty(name)) {
                  const blackValList = blackList[name];
                  const val = value.replace(/!important/g, '').trim();
                  if (blackValList.includes(val)) {
                    return '';
                  }
                }
                return name + ':' + value;
              }
            }));
            return name + '="' + safeAttrValue + '"';
          }
        });
        return this.sanitizer.bypassSecurityTrustHtml(xssValue);
      case 'url':
        return this.sanitizer.bypassSecurityTrustUrl(value);
      default:
        throw new Error(`Invalid safe type specified: ${type}`);
    }
  }

}



