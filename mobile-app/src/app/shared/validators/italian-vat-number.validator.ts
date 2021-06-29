import { ValidatorFn, ValidationErrors, AbstractControl } from '@angular/forms';
import { checkVAT, italy } from 'jsvat';

export const italianVatNumberValidator: ValidatorFn = (
  control: AbstractControl
): ValidationErrors | null => {
  const value = control.value;
  console.log('value', value);

  const res = checkVAT(value, [italy]);
  console.log('res', res);

  return !res.isValid ? { vat: true } : null;
};
