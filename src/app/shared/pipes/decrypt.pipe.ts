import { Pipe, PipeTransform } from '@angular/core';

import { OpenPgpService } from '../../core/services';

@Pipe({
  name: 'decrypt'
})
export class DecryptPipe implements PipeTransform {

  result: string;

  constructor(private openPgpService: OpenPgpService) {
  }

  transform(value: any, args?: any): any {
    if (!value) {
      return null;
    }

    return this.openPgpService.makeDecrypt(value).then((str) => {
      return this.result = str;
    });
  }

}
