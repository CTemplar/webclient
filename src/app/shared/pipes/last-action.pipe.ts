import { Pipe, PipeTransform } from '@angular/core';
import { MailAction } from '../../store/datatypes';

@Pipe({
  name: 'lastAction'
})
export class LastActionPipe implements PipeTransform {
  transform(value: MailAction, ...args: any[]): any {
    switch (value) {
      case MailAction.FORWARD:
        return 'share';
      case MailAction.REPLY_ALL:
        return 'reply-all';
      default:
        return value.toLowerCase();
    }
  }
}
