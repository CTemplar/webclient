import { Pipe, PipeTransform } from '@angular/core';

import { MailAction } from '../../store/datatypes';

@Pipe({
  name: 'lastAction',
})
export class LastActionPipe implements PipeTransform {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  transform(value: MailAction, ...arguments_: any[]): any {
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
