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
        const cssFilter = new cssfilter.FilterCSS({
          onIgnoreAttr: (styleName, styleValue, opts) => {
            const blackList = {
              position: ['fixed']
            };
            if (blackList.hasOwnProperty(styleName)) {
              const blackValList = blackList[styleName];
              const val = styleValue.replace(/!important/g, '').trim();
              if (blackValList.includes(val)) {
                return '';
              }
            }
            const safeAttrValue = cssfilter.safeAttrValue(styleName, styleValue);
            if (safeAttrValue) {
              return styleName + ':' + safeAttrValue;
            }
            return '';
          }
        });
        const xssValue = xss(value, {
          stripIgnoreTag: true,
          stripIgnoreTagBody: ['script', 'style'],
          onTag: (tag, html, options) => {
            if (tag === 'a' && !(options && options['isClosing'] === true)) {
              let htmlAttrs = '';

              // "<a href='' target=''>" => "href='' target=''"
              const reg = /\s|\n|\t/;
              const match = reg.exec(html);
              const i = match ? match.index : -1;
              if (i !== -1) {
                htmlAttrs = html.slice(i + 1, -1).trim();
              }

              let containsTargetAttr = false;
              let attrsHtml = xss.parseAttr(htmlAttrs, (attrName, attrValue) => {
                if (attrName === 'target') {
                  containsTargetAttr = true;
                  return attrName + '="_blank"';
                }

                // call `onTagAttr()`
                const whiteList = xss.getDefaultWhiteList();
                const whiteAttrList = whiteList[tag] || [];
                const isWhiteAttr = whiteAttrList.indexOf(attrName) !== -1;
                const ret1 = xss.onTagAttr(tag, attrName, attrValue, isWhiteAttr) || '';
                if (ret1 !== '') {
                  return ret1;
                }

                if (isWhiteAttr) {
                  // call `safeAttrValue()`
                  attrValue = xss.safeAttrValue(tag, attrName, attrValue, cssFilter);
                  if (attrValue) {
                    return attrName + '="' + attrValue + '"';
                  } else {
                    return attrName;
                  }
                } else {
                  // call `onIgnoreTagAttr()`
                  const ret2 = xss.onIgnoreTagAttr(tag, attrName, attrValue, isWhiteAttr) || '';
                  return ret2;
                }
              });

              if (!containsTargetAttr) {
                attrsHtml = attrsHtml + ' target="_blank"';
              }

              let outputHtml = '<' + tag;
              if (attrsHtml) {
                outputHtml += ' ' + attrsHtml;
              }
              outputHtml += '>';
              return outputHtml;
            }
          },
          onIgnoreTagAttr: (tag, attrName, attrValue, isWhiteAttr) => {
            let safeAttrValue = xss.safeAttrValue(tag, attrName, attrValue, cssFilter);
            if (attrName !== 'style') {
              // Encode chars '(' and ')' to prevent function calls in scripts.
              // Encode char '.' to prevent access to members or properties in scripts.
              // Encode char '=' to prevent changing members or properties in scripts.
              // Encode char '&' to prevent further decoding of the above encoded characters.
              safeAttrValue = safeAttrValue
                .replace(/\(/g, '&lpar;')
                .replace(/\)/g, '&rpar;')
                .replace(/\./g, '&period;')
                .replace(/=/g, '&equals;')
                .replace(/&/g, '&amp;');
            }
            return attrName + '="' + safeAttrValue + '"';
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



