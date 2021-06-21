import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filename',
})
export class FilenamePipe implements PipeTransform {
  static tranformToFilename(value: any) {
    if (!value) {
      return value;
    }

    const filePathTokens = value.split('/');
    return filePathTokens[filePathTokens.length - 1];
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  transform(value: any, arguments_?: any): any {
    return FilenamePipe.tranformToFilename(value);
  }
}
