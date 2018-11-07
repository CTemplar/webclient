import { Pipe, PipeTransform, SecurityContext } from '@angular/core';
import { DomSanitizer, SafeHtml, SafeUrl } from '@angular/platform-browser';
import * as xss from 'xss';

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
            if (name === 'style') {
              const safeAttrValue = xss.safeAttrValue(tag, name, value, xss.cssFilter);
              return name + '="' + safeAttrValue + '"';
            }
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



