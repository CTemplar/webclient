import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filename'
})
export class FilenamePipe implements PipeTransform {

  transform(value: any, args?: any): any {
    if (!value) {
      return value;
    }

    const filePathTokens = value.split('/');
    console.log('testing');
    return  filePathTokens[filePathTokens.length - 1];
  }

}
