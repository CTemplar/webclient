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
  static transformToFormattedEmail(email: string, displayName = '', isHtmlFormat = false, isTruncate = false) {
    if (!email) return '';

    const formattedEmail = email.toLowerCase().trim();
    if (!displayName || displayName === formattedEmail.split('@')[0]) {
      return isTruncate ? EmailFormatPipe.getTrucatedString(formattedEmail) : formattedEmail;
    } else if (isHtmlFormat) {
      return isTruncate
        ? EmailFormatPipe.getTrucatedString(`${displayName.trim()}&nbsp;&lt;${formattedEmail}&gt;`)
        : `${displayName.trim()}&nbsp;&lt;${formattedEmail}&gt;`;
    } else {
      return isTruncate
        ? EmailFormatPipe.getTrucatedString(`${displayName.trim()} <${formattedEmail}>`)
        : `${displayName.trim()} <${formattedEmail}>`;
    }
  }

  transform(email: string, displayName = '', isHtmlFormat = false, isTruncate = false): string {
    return EmailFormatPipe.transformToFormattedEmail(email, displayName, isHtmlFormat, isTruncate);
  }
  static getTrucatedString(content: string): string {
    const MAX_LENGTH_EMAIL = 40;
    if (content.length > MAX_LENGTH_EMAIL) {
      return content.slice(0, MAX_LENGTH_EMAIL) + '...';
    }
    return content;
  }
}
