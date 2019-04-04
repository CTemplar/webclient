import { Pipe, PipeTransform } from '@angular/core';
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
        let xssValue = xss(value, {
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
                whiteAttrList.push('style');
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
            if (attrName === 'style' || attrName === 'bgcolor') {
              const safeAttrValue = xss.safeAttrValue(tag, attrName, attrValue, cssFilter);
              return attrName + '="' + safeAttrValue + '"';
            }
          }
        });
        xssValue = this.replaceLinksInText(xssValue);
        return this.sanitizer.bypassSecurityTrustHtml(xssValue);
      case 'url':
        return this.sanitizer.bypassSecurityTrustUrl(value);
      default:
        throw new Error(`Invalid safe type specified: ${type}`);
    }
  }

  replaceLinksInText(inputText) {
    let replacedText, replacePattern1, replacePattern2, replacePattern3;

    // URLs starting with http://, https://, or ftp://
    replacePattern1 = /(\b(https?|ftp):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/gim;
    replacedText = inputText.replace(replacePattern1, '<a href="$1" target="_blank" rel="noopener">$1</a>');

    // URLs starting with "www." (without // before it, or it'd re-link the ones done above).
    replacePattern2 = /(^|[^\/])(www\.[\S]+(\b|$))/gim;
    replacedText = replacedText.replace(replacePattern2, '$1<a href="http://$2" target="_blank" rel="noopener">$2</a>');

    // Change email addresses to mailto:: links.
    replacePattern3 = /(([a-zA-Z0-9\-\_\.])+@[a-zA-Z\_]+?(\.[a-zA-Z]{2,6})+)/gim;
    replacedText = replacedText.replace(replacePattern3, '<a href="mailto:$1" rel="noopener">$1</a>');

    return replacedText;
  }

}



