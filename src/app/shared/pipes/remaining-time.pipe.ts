import { Pipe, PipeTransform } from '@angular/core';
import * as moment from 'moment-timezone';

@Pipe({
  name: 'remainingTime',
})
export class RemainingTimePipe implements PipeTransform {
  transform(value: any, hoursOnly: boolean = false): any {
    if (!value) {
      return '';
    }

    if (hoursOnly) {
      return this.getTimeRemainingFromHours(value);
    }

    return this.getTimeRemaining(value);
  }

  private getTimeRemainingFromHours(hours) {
    const seconds = hours * 60 * 60;
    return this.getFormattedTime(seconds);
  }

  private getTimeRemaining(date) {
    const now = moment();
    const end = moment(date);
    const duration = moment.duration(end.diff(now));
    const seconds = duration.asSeconds();

    return this.getFormattedTime(seconds);
  }

  private getFormattedTime(seconds) {
    if (seconds < 0) {
      return 'progress';
    }
    const days = Math.floor(seconds / (3600 * 24));
    seconds -= days * 3600 * 24;
    const hrs = Math.floor(seconds / 3600);
    seconds -= hrs * 3600;
    const mnts = Math.floor(seconds / 60);
    seconds -= hrs * 3600;
    return `${days}d ${this.padLeft(hrs)}:${this.padLeft(mnts)}`;
  }

  private padLeft(num, size = 2) {
    let s = num + '';
    while (s.length < size) {
      s = '0' + s;
    }
    return s;
  }
}
