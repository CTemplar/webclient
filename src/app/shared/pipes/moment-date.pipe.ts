import { Pipe, PipeTransform } from '@angular/core';
import { DateTimeUtilService } from '../../store/services/datetime-util.service';

@Pipe({
  name: 'momentDate'
})
export class MomentDatePipe implements PipeTransform {

  constructor(private dateTimeUtilService: DateTimeUtilService) {
  }

  transform(value: string, format: string = 'mediumDate', timezone?: string): string {
    if (value) {
      return this.dateTimeUtilService.formatDateTimeStr(value, format, timezone);
    } else {
      return '';
    }
  }

}
