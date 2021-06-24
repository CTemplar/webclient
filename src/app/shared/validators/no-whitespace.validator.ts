import { AbstractControl, ValidationErrors } from '@angular/forms';

export const NoWhiteSpaceValidator = {
  noWhiteSpaceValidator(control: AbstractControl): ValidationErrors | null {
    if (((control.value as string) || '').trim().length === 0) {
      return { invalid: true };
    }
    return null;
  },
};
