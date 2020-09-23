import { Pipe, PipeTransform } from '@angular/core';
/**
 * @name EmailFormatPipe
 * @description Return formatted email fully with pure email and display name, 
 * @description if flagged `isHtmlFormat`, it would return formatted email with html entities.
 * @example If flagged isHtmlFormat, `Display Name&nbsp;&lt;example@example.com&gt;, if not `Display Name <example&example.com>`
 * @params email: Email address to format
 * @params displayName: Display Name to format
 * @params isHtmlFormat: Flag for indicating whether html format or not
 * @returns fomatted email
 */ 
@Pipe({
  name: 'emailFormat',
})
export class EmailFormatPipe implements PipeTransform {
  static transformToFormattedEmail(email: string, displayName: string = '', isHtmlFormat: boolean = false) {
    if (!email) return '';
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
