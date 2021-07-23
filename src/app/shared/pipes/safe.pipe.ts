import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer, SafeHtml, SafeUrl } from '@angular/platform-browser';
import * as xss from 'xss';
// eslint-disable-next-line import/no-extraneous-dependencies
import * as cssfilter from 'cssfilter';
import * as juice from 'juice';

import { apiUrl, PRIMARY_DOMAIN } from '../config';

@Pipe({
  name: 'safe',
})
export class SafePipe implements PipeTransform {
  static hasExternalImages: boolean;

  static allowedTags: any = {
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
    blockquote: [],
  };

  static headingAttributes = ['align', 'dir', 'id', 'style'];

  static allowedAttributes: any = {
    a: ['href', 'style', 'target'],
    b: ['style'],
    br: ['style'],
    div: ['align', 'dir', 'style'],
    font: ['color', 'face', 'size', 'style'],
    h1: SafePipe.headingAttributes,
    h2: SafePipe.headingAttributes,
    h3: SafePipe.headingAttributes,
    h4: SafePipe.headingAttributes,
    h5: SafePipe.headingAttributes,
    h6: SafePipe.headingAttributes,
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
    blockquote: ['style', 'class'],
  };

  constructor(private sanitizer: DomSanitizer) {}

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public transform(value: any, type = '', disableExternalImages?: boolean, fromEmail?: string): SafeHtml | SafeUrl {
    switch (type.toLowerCase()) {
      case 'html':
        break;
      case 'url':
        return this.sanitizer.bypassSecurityTrustUrl(value);
      case 'sanitize':
        // Move style from style tag to inline style
        value = juice(value);
        // Sanitize Mail
        value = SafePipe.processSanitizationForEmail(value, disableExternalImages);
        return this.sanitizer.bypassSecurityTrustHtml(value);
      default:
        throw new Error(`Invalid safe type specified: ${type}`);
    }
    return '';
  }

  static processSanitizationForEmail(value: string, disableExternalImages: boolean) {
    const cssFilter = SafePipe.createCssFilter();
    let isAddedCollapseButton = false;
    // @ts-ignore
    return xss(value, {
      whiteList: SafePipe.allowedTags,
      stripIgnoreTag: true,
      stripIgnoreTagBody: ['script', 'style'],
      onTag: (tag: string, html: string, options: any) => {
        if (!options.isWhite) return;
        if (!(options && options.isClosing === true)) {
          const htmlAttributes = SafePipe.getAttributesFromHtml(html);
          let containsTargetAttribute = false;
          let isNeededAddCollapseButton = false;
          let attributesHtml = xss.parseAttr(htmlAttributes, (attributeName, attributeValue) => {
            // <anchor> tag AND attribute is target, _blank should be added
            if (tag === 'a' && attributeName === 'target') {
              containsTargetAttribute = true;
              return `${attributeName}="_blank"`;
            }
            // <blockquote> and quote attribute value, then should add collapse button later
            if (tag === 'blockquote') {
              // Checking several email's blockquote: CTemplar, Gmail, ProtonMail
              if (
                attributeName === 'class' &&
                (attributeValue.includes('gmail_quote') ||
                  attributeValue.includes('ctemplar_quote') ||
                  attributeValue.includes('protonmail_quote'))
              ) {
                isNeededAddCollapseButton = true;
                return `${attributeName}="${attributeValue}"`;
              }
              // Removing styles for gmail_quote, because it has different quote styles with CTemplar blockquote
              if (htmlAttributes.includes('class="gmail_quote"') && attributeName === 'style') {
                return `${attributeName}=""`;
              }
            }
            // Embeded Image process
            if (tag === 'img' && attributeName === 'src' && attributeValue.indexOf('data:image/png;base64,') === 0) {
              return `${attributeName}="${xss.friendlyAttrValue(attributeValue)}"`;
            }
            // Disabling External Image
            if (
              disableExternalImages &&
              tag === 'img' &&
              attributeName === 'src' &&
              !(attributeValue.indexOf(`https://${PRIMARY_DOMAIN}`) === 0 || attributeValue.indexOf(apiUrl) === 0)
            ) {
              SafePipe.hasExternalImages = true;
              return `${attributeName}=""`;
            }
            // Other Default Process
            // call `onTagAttr()`
            const attributeWhitelist = SafePipe.allowedAttributes[tag];
            // if the current attr is whitelisted, should be added to tag
            const isWhiteAttribute = attributeWhitelist.includes(attributeName);
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

          // If <anchor> tag AND no target attribute, force adding it.
          if (tag === 'a' && !containsTargetAttribute) {
            attributesHtml += ' target="_blank" rel="noopener noreferrer"';
          }
          let collapseButton = '';
          // Adding Collapse button
          if (isNeededAddCollapseButton && !isAddedCollapseButton) {
            isAddedCollapseButton = true;
            collapseButton = `<button title="Show Trimmed Messages" class="fa fa-ellipsis-h cursor-pointer btn-ctemplar-blockquote-toggle ctemplar-blockquote-toggle mt-2 mb-2" onclick="event.target.classList.toggle('ctemplar-blockquote-toggle');"></button>`;
          }

          // Final Building HTML TAG
          let outputHtml = collapseButton ? `${collapseButton}<${tag}` : `<${tag}`;
          if (attributesHtml) {
            outputHtml += ` ${attributesHtml}`;
          }
          outputHtml += '>';
          // eslint-disable-next-line consistent-return
          return outputHtml;
        }
      },
    });
  }

  static processSanitization(value: string, disableExternalImages: boolean) {
    // @ts-ignore
    value = xss(value, {
      whiteList: SafePipe.allowedTags,
      stripIgnoreTag: true,
      stripIgnoreTagBody: ['script', 'style'],
      // eslint-disable-next-line consistent-return
      onIgnoreTagAttr: (tag: string, name: string, attribute: string) => {
        if (name !== 'class') {
          // get attr whitelist for specific tag
          const attributeWhitelist = SafePipe.allowedAttributes[tag];
          // if the current attr is whitelisted, should be added to tag
          if (attributeWhitelist.includes(name)) {
            if (
              disableExternalImages &&
              tag === 'img' &&
              name === 'src' &&
              !(attribute.indexOf(`https://${PRIMARY_DOMAIN}`) === 0 || attribute.indexOf(apiUrl) === 0)
            ) {
              SafePipe.hasExternalImages = true;
              return `${attribute}=""`;
            }
            return `${name}="${xss.escapeAttrValue(attribute)}"`;
          }
        }
      },
    });
    return value;
  }

  static getExternalImageStatus(value: string) {
    let isExistExternalImage = false;
    // @ts-ignore
    value = xss(value, {
      whiteList: SafePipe.allowedTags,
      stripIgnoreTag: true,
      stripIgnoreTagBody: ['script', 'style'],
      // eslint-disable-next-line consistent-return
      onIgnoreTagAttr: (tag: string, name: string, attribute: string) => {
        if (name !== 'class') {
          // get attr whitelist for specific tag
          const attributeWhitelist = SafePipe.allowedAttributes[tag];
          // if the current attr is whitelisted, should be added to tag
          if (
            attributeWhitelist.includes(name) &&
            tag === 'img' &&
            name === 'src' &&
            !(attribute.indexOf(`https://${PRIMARY_DOMAIN}`) === 0 || attribute.indexOf(apiUrl) === 0)
          ) {
            isExistExternalImage = true;
          }
        }
      },
    });
    return isExistExternalImage;
  }

  static createCssFilter(): any {
    const cssFilter = new cssfilter.FilterCSS({
      onIgnoreAttr: (styleName: any, styleValue: string) => {
        const blackList: any = {
          position: ['fixed'],
        };
        if (Object.prototype.hasOwnProperty.call(blackList, styleName)) {
          const blackValueList = blackList[styleName];
          const value = styleValue.replace(/!important/g, '').trim();
          if (blackValueList.includes(value)) {
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
    return cssFilter;
  }

  static getAttributesFromHtml(html: string): string {
    let htmlAttributes = '';
    const spaceIndex = html.indexOf(' ');
    if (spaceIndex > 0) {
      htmlAttributes = html.slice(spaceIndex + 1, -1).trim();
    }
    return htmlAttributes;
  }

  replaceLinksInText(inputText: string) {
    if (!/<[a-z][\S\s]*>/i.test(inputText)) {
      if (typeof inputText === 'string') {
        // URLs starting with http://, https://, or ftp://
        const urlPattern = /(\b(https?|ftp):\/\/[\w!#%&+,./:;=?@|~-]*[\w#%&+/=@|~-])/gim;

        // URLs starting with "www." (without // before it, or it'd re-link the ones done above).
        const pseudoUrlPattern = /(^|[^/])(www\.\S+(\b|$))/gim;

        // Change email addresses to mailto:: links.
        const emailAddressPattern = /(\w+@[_a-z]+?(\.[a-z]{2,6})+)/gim;

        inputText = inputText
          .replace(urlPattern, '<a target="_blank" rel="noopener noreferrer" href="$1">$1</a>')
          .replace(pseudoUrlPattern, '$1<a target="_blank" rel="noopener noreferrer" href="http://$2">$2</a>')
          .replace(emailAddressPattern, '<a href="mailto:$1">$1</a>');
      }
      inputText = inputText.replace(/\n/g, '<br>');
    }
    return inputText;
  }

  static removeTitle(value: string) {
    const element = document.createElement('div');
    element.innerHTML = value;
    if (element.querySelectorAll('title').length > 0) {
      element.querySelectorAll('title')[0].textContent = '';
      return element.innerHTML;
    }
    return value;
  }

  /**
   * @name sanitizeEmail
   * @description Will be used for santizing without pipe, after passed this function, should call DomSanitizer.bypassSecurityTrustHtml()
   * @returns sanitized content
   */
  static sanitizeEmail(value: string, disableExternalImages: boolean) {
    value = juice(value);
    value = SafePipe.removeTitle(value);
    // Sanitize Mail
    value = SafePipe.processSanitizationForEmail(value, disableExternalImages);
    return value;
  }
}
