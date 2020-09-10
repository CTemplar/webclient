import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer, SafeHtml, SafeUrl } from '@angular/platform-browser';
import * as xss from 'xss';
import * as cssfilter from 'cssfilter';
import { apiUrl, PRIMARY_DOMAIN } from '../config';
import * as juice from 'juice';

@Pipe({
  name: 'safe',
})
export class SafePipe implements PipeTransform {
  static hasExternalImages: boolean;

  constructor(private sanitizer: DomSanitizer) {}

  public transform(
    value: any,
    type: string = '',
    disableExternalImages?: boolean,
    fromEmail?: string,
  ): SafeHtml | SafeUrl {
    switch (type.toLowerCase()) {
      case 'html':
        value = this.removeTitle(value);
        const cssFilter = new cssfilter.FilterCSS({
          onIgnoreAttr: (styleName, styleValue, opts) => {
            const blackList = {
              position: ['fixed'],
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
          },
        });
        // @ts-ignore
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
            } else if (disableExternalImages && tag === 'img' && attrName === 'src') {
              if (!(attrValue.indexOf('https://' + PRIMARY_DOMAIN) === 0 || attrValue.indexOf(apiUrl) === 0)) {
                SafePipe.hasExternalImages = true;
                return `${attrName}=""`;
              }
            }
            // Return nothing, means keep the default handling measure
          },
        });
        xssValue = this.replaceLinksInText(xssValue);
        return this.sanitizer.bypassSecurityTrustHtml(xssValue);
      case 'url':
        return this.sanitizer.bypassSecurityTrustUrl(value);
      case 'sanitize':
        // Move style from style tag to inline style
        value = juice(value);
        // Sanitize Mail
        value = this.processSanitization(value, disableExternalImages);
        return this.sanitizer.bypassSecurityTrustHtml(value);
      default:
        throw new Error(`Invalid safe type specified: ${type}`);
    }
  }

  processSanitization(value: string, disableExternalImages: boolean) {
    const allowedTags = {
      a: [],
      b: [],
      br: [],
      div: [],
      font: [],
      h1: [],
      h2: [],
      h3: [],
      h4: [],
      h5: [],
      h6: [],
      hr: [],
      img: [],
      label: [],
      li: [],
      ol: [],
      p: [],
      span: [],
      strong: [],
      table: [],
      td: [],
      th: [],
      tr: [],
      u: [],
      ul: [],
      i: [],
    };
    const headingAttributes = ['align', 'dir', 'id', 'style'];
    const allowedAttributes = {
      a: ['href', 'style', 'target'],
      b: ['style'],
      br: ['style'],
      div: ['align', 'dir', 'style'],
      font: ['color', 'face', 'size', 'style'],
      h1: headingAttributes,
      h2: headingAttributes,
      h3: headingAttributes,
      h4: headingAttributes,
      h5: headingAttributes,
      h6: headingAttributes,
      hr: ['align', 'size', 'width'],
      img: ['align', 'border', 'height', 'hspace', 'src', 'style', 'usemap', 'vspace', 'width'],
      label: ['id', 'style'],
      li: ['dir', 'style', 'type'],
      ol: ['dir', 'style', 'type'],
      p: ['align', 'dir', 'style'],
      span: ['style'],
      strong: ['style'],
      table: ['align', 'bgcolor', 'border', 'cellpadding', 'cellspacing', 'dir', 'frame', 'rules', 'style', 'width'],
      td: [
        'abbr',
        'align',
        'bgcolor',
        'colspan',
        'dir',
        'height',
        'lang',
        'rowspan',
        'scope',
        'style',
        'valign',
        'width',
      ],
      th: [
        'abbr',
        'align',
        'background',
        'bgcolor',
        'colspan',
        'dir',
        'height',
        'lang',
        'scope',
        'style',
        'valign',
        'width',
      ],
      tr: ['align', 'bgcolor', 'dir', 'style', 'valign'],
      u: ['style'],
      ul: ['dir', 'style'],
    };
    // @ts-ignore
    value = xss(value, {
      whiteList: allowedTags,
      stripIgnoreTag: true,
      stripIgnoreTagBody: ['script', 'style'],
      onIgnoreTagAttr: (tag, name, attr, isWhiteAttr) => {
        if (name !== 'class') {
          // get attr whitelist for specific tag
          const attrWhitelist = allowedAttributes[tag];
          // if the current attr is whitelisted, should be added to tag
          if (attrWhitelist.indexOf(name) !== -1) {
            if (disableExternalImages && tag === 'img' && name === 'src') {
              if (!(attr.indexOf('https://' + PRIMARY_DOMAIN) === 0 || attr.indexOf(apiUrl) === 0)) {
                SafePipe.hasExternalImages = true;
                return `${attr}=""`;
              }
            }
            return name + '="' + xss.escapeAttrValue(attr) + '"';
          }
        }
      },
    });
    return value;
  }

  replaceLinksInText(inputText: string) {
    if (!/<[a-z][\s\S]*>/i.test(inputText)) {
      if (typeof inputText === 'string') {
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
