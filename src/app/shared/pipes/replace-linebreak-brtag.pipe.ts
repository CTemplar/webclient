import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'linebreaktobrtag'
})

export class LineBreakToBrTag implements PipeTransform {

  transform(mailContent: string): string {
    mailContent = mailContent.replace(new RegExp('\r?\n','g'), '<br />');
    return mailContent;
  }
}
