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
        value = this.removeTitle(value);
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
            if (attrName === 'class' && (attrValue === 'gmail_quote ctemplar_quote' || attrValue === 'gmail_quote')) {
              return `${attrName}="${attrValue}"`;
            }
          },
          onTagAttr: (tag, attrName, attrValue, isWhiteAttr) => {
            if (tag === 'img' && attrName === 'src' && attrValue.indexOf('data:image/png;base64,') === 0) {
              return `${attrName}="${xss.friendlyAttrValue(attrValue)}"`;
            }
            // Return nothing, means keep the default handling measure
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

  replaceLinksInText(inputText: string) {
    if (!(/<[a-z][\s\S]*>/i.test(inputText))) {
      if (typeof (inputText) === 'string') {
        // http://, https://, ftp://
        const urlPattern = /\b(?:https?|ftp):\/\/[a-z0-9-+&@#\/%?=~_|!:,.;]*[a-z0-9-+&@#\/%=~_|]/gim;

        // www. sans http:// or https://
        const pseudoUrlPattern = /(^|[^\/])(www\.[\S]+(\b|$))/gim;

        // Email addresses
        const emailAddressPattern = /[\w.]+@[a-zA-Z_-]+?(?:\.[a-zA-Z]{2,6})+/gim;

        inputText = inputText
          .replace(urlPattern, '<a target="_blank" rel="noopener" href="$&">$&</a>')
          .replace(pseudoUrlPattern, '$1<a target="_blank" rel="noopener" href="http://$2">$2</a>')
          .replace(emailAddressPattern, '<a target="_blank" rel="noopener" href="mailto:$&">$&</a>');
      }
      inputText = inputText.replace(/\n/g, '<br>');
    }
    return inputText;
  }

  private removeTitle(value: string) {
    const el = document.createElement('div');
    el.innerHTML = value;
    if (el.getElementsByTagName('title').length > 0) {
      el.getElementsByTagName('title')[0].innerText = '';
      return el.innerHTML;
    }
    return value;
  }
}



