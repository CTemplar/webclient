import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'matKeyboardKebabCase',
  pure: false
})
export class MatKeyboardKebabCasePipe implements PipeTransform {

  transform(value: string): string {
    return value.replace(/([a-z])([A-Z])/g, '$1-$2')
      .replace(/\s+/g, '-')
      .toLowerCase();
  }

}
