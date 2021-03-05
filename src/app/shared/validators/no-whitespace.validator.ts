import { AbstractControl, ValidationErrors } from '@angular/forms';

export class NoWhiteSpaceValidator {
  static noWhiteSpaceValidator(control: AbstractControl): ValidationErrors | null {
    if (((control.value as string) || '').trim().length === 0) {
      return { invalid: true };
    }
    return null;
  }
}
