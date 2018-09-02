import { Injectable } from '@angular/core';
import { NgbDateStruct, NgbTimeStruct } from '@ng-bootstrap/ng-bootstrap';
import * as moment from 'moment';

@Injectable()
export class DateTimeUtilService {

  readonly ISO8601_DATETIME_FORMAT = 'YYYY-MM-DDTHH:mm:ss.SSSZ';

  createDateTimeStrFromNgbDateTimeStruct(date: NgbDateStruct, time: NgbTimeStruct): string {
    return moment([date.year, date.month - 1, date.day, time.hour, time.minute, time.second])
      .utc()
      .format(this.ISO8601_DATETIME_FORMAT);
  }

  createDateTimeFromNgbDateTimeStruct(date: NgbDateStruct, time: NgbTimeStruct): moment.Moment {
    return moment([date.year, date.month - 1, date.day, time.hour, time.minute, time.second]).utc();
  }

  getNgbDateTimeStructsFromDateTimeStr(dateTimeStr: string): {date: NgbDateStruct, time: NgbTimeStruct} {
    const datetime = moment(dateTimeStr);
    if (datetime) {
      return {
        date: {
          year: datetime.year(),
          month: datetime.month(),
          day: datetime.date()
        },
        time: {
          hour: datetime.hour(),
          minute: datetime.minute(),
          second: datetime.second()
        }
      };
    }
    else {
      return {date: null, time: null};
    }
  }

  isDateTimeInPast(dateTimeStr: string): boolean {
    return moment().diff(moment(dateTimeStr)) >= 0;
  }

  getDiffFromCurrentDateTimeInSeconds(dateTimeStr: string): number {
    return moment(dateTimeStr).diff(moment(), 'seconds');
  }

}
