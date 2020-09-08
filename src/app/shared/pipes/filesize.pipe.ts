import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filesize'
})
export class FilesizePipe implements PipeTransform {
  private units = ['B', 'KB', 'MB', 'GB', 'TB'];

  transform(bytes: any, preferredUnit?: any, precision: number = 2): any {
    if (isNaN(parseFloat(String(bytes))) || !isFinite(bytes)) {
      return '?';
    }

    let unit = 0;

    // Check if preferred unit exist preset the unit
    if (preferredUnit && this.units.indexOf(preferredUnit) > -1) {
      while (this.units[unit] !== preferredUnit) {
        unit++;
      }
    }

    while (bytes >= 1024) {
      bytes /= 1024;

      if (!preferredUnit) {
        unit++;
      }
    }

    return bytes.toFixed(+precision) + ' ' + this.units[unit];
  }
}
