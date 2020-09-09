import { Pipe, PipeTransform } from '@angular/core';
import { DateTimeUtilService } from '../../store/services/datetime-util.service';
import * as moment from 'moment-timezone';

@Pipe({
  name: 'momentDate',
})
export class MomentDatePipe implements PipeTransform {
  constructor(private dateTimeUtilService: DateTimeUtilService) {}

  transform(value: string, format: string = 'mediumDate', timezone?: string): string {
    if (value) {
      if (format === 'mail-list') {
        format = moment().isSame(moment(value), 'day') ? 'HH:mm' : 'MMM D';
      }
      return this.dateTimeUtilService.formatDateTimeStr(value, format, timezone);
    } else {
      return '';
    }
  }
}
