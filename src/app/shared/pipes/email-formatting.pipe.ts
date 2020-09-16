import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'emailFormat',
})
export class EmailFormatPipe implements PipeTransform {
  static transformToFormattedEmail(email: string, displayName: string = '', isHtmlFormat: boolean = false) {
    let formattedEmail = email.toLowerCase().trim();
    if (!displayName || displayName === formattedEmail.split('@')[0]) {
      return formattedEmail;
    } else if (isHtmlFormat) {
      return `${displayName.trim()}&nbsp;&lt;${formattedEmail}&gt;`;
    } else {
      return `${displayName.trim()} <${formattedEmail}>`;
    }
  }
  transform(email: string, displayName: string = '', isHtmlFormat: boolean = false): string {
    return EmailFormatPipe.transformToFormattedEmail(email, displayName, isHtmlFormat);
  }
}
