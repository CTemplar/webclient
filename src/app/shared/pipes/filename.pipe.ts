import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filename'
})
export class FilenamePipe implements PipeTransform {

  static tranformToFilename(value: any) {
    if (!value) {
      return value;
    }

    const filePathTokens = value.split('/');
    return filePathTokens[filePathTokens.length - 1];
  }

  transform(value: any, args?: any): any {
    return FilenamePipe.tranformToFilename(value);
  }

}
