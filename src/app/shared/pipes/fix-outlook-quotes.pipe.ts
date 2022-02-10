import { Pipe, PipeTransform } from '@angular/core';

const START_OF_OUTLOOK_QUOTE_INDICATOR = `<div id="divRplyFwdMsg"`;
const END_OF_OUTLOOK_QUOTE_INDICATOR = `</body>`;
const START_OF_CTEMPLAR_QUOTE = `<blockquote class="x_ctemplar_quote">`;
const END_OF_CTEMPLAR_QUOTE = `</blockquote>`;

@Pipe({
  name: 'fixoutlookquotes',
})
export class FixOutlookQuotesPipe implements PipeTransform {
  transform(value: any): any {
    return this.handleOutlookQuotedReplies(value);
  }

  // We need this to handle the quoted replies from outlook to be collapsible
  handleOutlookQuotedReplies(content: string): string {
    let newContent = content;
    // detect the start of quoted message from outlook
    if (content.includes(START_OF_OUTLOOK_QUOTE_INDICATOR)) {
      // start our quoted reply block before the outlook quoted reply
      newContent = newContent.replace(
        new RegExp(START_OF_OUTLOOK_QUOTE_INDICATOR),
        `${START_OF_CTEMPLAR_QUOTE}${START_OF_OUTLOOK_QUOTE_INDICATOR}`,
      );
      // end our quoted reply block before the end of body
      newContent = newContent.replace(
        new RegExp(END_OF_OUTLOOK_QUOTE_INDICATOR),
        `${END_OF_CTEMPLAR_QUOTE}${END_OF_OUTLOOK_QUOTE_INDICATOR}`,
      );
    }
    return newContent;
  }
}
