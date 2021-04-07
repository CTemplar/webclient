import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer, SafeHtml, SafeUrl } from '@angular/platform-browser';
import * as xss from 'xss';
import * as cssfilter from 'cssfilter';
import * as juice from 'juice';

import { apiUrl, PRIMARY_DOMAIN } from '../config';

@Pipe({
  name: 'safe',
})
export class SafePipe implements PipeTransform {
  static hasExternalImages: boolean;

  constructor(private sanitizer: DomSanitizer) {}

  public transform(value: any, type = '', disableExternalImages?: boolean, fromEmail?: string): SafeHtml | SafeUrl {
    switch (type.toLowerCase()) {
      case 'html':
        value = this.removeTitle(value);
        const cssFilter = new cssfilter.FilterCSS({
          onIgnoreAttr: (styleName: any, styleValue: string) => {
            const blackList: any = {
              position: ['fixed'],
            };
            if (blackList.hasOwnProperty(styleName)) {
              const blackValueList = blackList[styleName];
              const value_ = styleValue.replace(/!important/g, '').trim();
              if (blackValueList.includes(value_)) {
                return '';
              }
            }
            const safeAttributeValue = cssfilter.safeAttrValue(styleName, styleValue);
            if (safeAttributeValue) {
              return `${styleName}:${safeAttributeValue}`;
            }
            return '';
          },
        });
        // @ts-ignore
        let xssValue = xss(value, {
          stripIgnoreTag: true,
          stripIgnoreTagBody: ['script', 'style'],
          onTag: (tag: string, html: string, options: any) => {
            if (tag === 'a' && !(options && options.isClosing === true)) {
              let htmlAttributes = '';

              // "<a href='' target=''>" => "href='' target=''"
              const reg = /\s/;
              const match = reg.exec(html);
              const i = match ? match.index : -1;
              if (i !== -1) {
                htmlAttributes = html.slice(i + 1, -1).trim();
              }

              let containsTargetAttribute = false;
              let attributesHtml = xss.parseAttr(htmlAttributes, (attributeName, attributeValue) => {
                if (attributeName === 'target') {
                  containsTargetAttribute = true;
                  return `${attributeName}="_blank"`;
                }

                // call `onTagAttr()`
                const whiteList = xss.getDefaultWhiteList();
                const whiteAttributeList = whiteList[tag] || [];
                whiteAttributeList.push('style');
                const isWhiteAttribute = whiteAttributeList.includes(attributeName);
                const returnValue1 = xss.onTagAttr(tag, attributeName, attributeValue, isWhiteAttribute) || '';
                if (returnValue1 !== '') {
                  return returnValue1;
                }

                if (isWhiteAttribute) {
                  // call `safeAttrValue()`
                  attributeValue = xss.safeAttrValue(tag, attributeName, attributeValue, cssFilter);
                  if (attributeValue) {
                    return `${attributeName}="${attributeValue}"`;
                  }
                  return attributeName;
                }
                // call `onIgnoreTagAttr()`
                const returnValue2 = xss.onIgnoreTagAttr(tag, attributeName, attributeValue, isWhiteAttribute) || '';
                return returnValue2;
              });

              if (!containsTargetAttribute) {
                attributesHtml += ' target="_blank" rel="noopener noreferrer"';
              }

              let outputHtml = `<${tag}`;
              if (attributesHtml) {
                outputHtml += ` ${attributesHtml}`;
              }
              outputHtml += '>';
              return outputHtml;
            }
          },
          onIgnoreTagAttr: (tag: string, attributeName: string, attributeValue: string) => {
            if (attributeName === 'style' || attributeName === 'bgcolor') {
              const safeAttributeValue = xss.safeAttrValue(tag, attributeName, attributeValue, cssFilter);
              return `${attributeName}="${safeAttributeValue}"`;
            }
            if (
              attributeName === 'class' &&
              (attributeValue === 'gmail_quote ctemplar_quote' || attributeValue === 'gmail_quote')
            ) {
              return `${attributeName}="${attributeValue}"`;
            }
          },
          onTagAttr: (tag: string, attributeName: string, attributeValue: string) => {
            if (tag === 'img' && attributeName === 'src' && attributeValue.indexOf('data:image/png;base64,') === 0) {
              return `${attributeName}="${xss.friendlyAttrValue(attributeValue)}"`;
            }
            if (disableExternalImages && tag === 'img' && attributeName === 'src') {
              if (
                !(attributeValue.indexOf(`https://${PRIMARY_DOMAIN}`) === 0 || attributeValue.indexOf(apiUrl) === 0)
              ) {
                SafePipe.hasExternalImages = true;
                return `${attributeName}=""`;
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
        value = SafePipe.processSanitization(value, disableExternalImages);
        return this.sanitizer.bypassSecurityTrustHtml(value);
      default:
        throw new Error(`Invalid safe type specified: ${type}`);
    }
  }

  static processSanitization(value: string, disableExternalImages: boolean) {
    const allowedTags: any = {
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
    const allowedAttributes: any = {
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
      i: ['style'],
    };
    // @ts-ignore
    value = xss(value, {
      whiteList: allowedTags,
      stripIgnoreTag: true,
      stripIgnoreTagBody: ['script', 'style'],
      onIgnoreTagAttr: (tag: string, name: string, attribute: string) => {
        if (name !== 'class') {
          // get attr whitelist for specific tag
          const attributeWhitelist = allowedAttributes[tag];
          // if the current attr is whitelisted, should be added to tag
          if (attributeWhitelist.includes(name)) {
            if (disableExternalImages && tag === 'img' && name === 'src') {
              if (!(attribute.indexOf(`https://${PRIMARY_DOMAIN}`) === 0 || attribute.indexOf(apiUrl) === 0)) {
                SafePipe.hasExternalImages = true;
                return `${attribute}=""`;
              }
            }
            return `${name}="${xss.escapeAttrValue(attribute)}"`;
          }
        }
      },
    });
    return value;
  }

  replaceLinksInText(inputText: string) {
    if (!/<[a-z][\S\s]*>/i.test(inputText)) {
      if (typeof inputText === 'string') {
        // URLs starting with http://, https://, or ftp://
        const urlPattern = /(\b(https?|ftp):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/gim;

        // URLs starting with "www." (without // before it, or it'd re-link the ones done above).
        const pseudoUrlPattern = /(^|[^\/])(www\.[\S]+(\b|$))/gim;

        // Change email addresses to mailto:: links.
        const emailAddressPattern = /(\w+@[a-zA-Z_]+?(\.[a-zA-Z]{2,6})+)/gim;

        inputText = inputText
          .replace(urlPattern, '<a target="_blank" rel="noopener noreferrer" href="$1">$1</a>')
          .replace(pseudoUrlPattern, '$1<a target="_blank" rel="noopener noreferrer" href="http://$2">$2</a>')
          .replace(emailAddressPattern, '<a href="mailto:$1">$1</a>');
      }
      inputText = inputText.replace(/\n/g, '<br>');
    }
    return inputText;
  }

  private removeTitle(value: string) {
    const element = document.createElement('div');
    element.innerHTML = value;
    if (element.querySelectorAll('title').length > 0) {
      element.querySelectorAll('title')[0].innerText = '';
      return element.innerHTML;
    }
    return value;
  }
}
