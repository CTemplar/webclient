import { Pipe, PipeTransform } from '@angular/core';
import * as moment from 'moment-timezone';

import { DateTimeUtilService } from '../../store/services/datetime-util.service';

@Pipe({
  name: 'momentDate',
})
export class MomentDatePipe implements PipeTransform {
  constructor(private dateTimeUtilService: DateTimeUtilService) {}

  transform(value: string, format = 'mediumDate', timezone?: string): string {
    if (value) {
      if (format === 'mail-list') {
        format = moment().isSame(moment(value), 'day') ? 'HH:mm' : 'MMM D, YYYY';
      }
      return this.dateTimeUtilService.formatDateTimeStr(value, format, timezone);
    }
    return '';
  }
}
