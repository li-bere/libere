import { FormGroup, ValidatorFn, ValidationErrors } from '@angular/forms';

export const matchPasswordValidator: ValidatorFn = (control: FormGroup): ValidationErrors | null => {
    const password = control.get('password');
    const confirmPassword = control.get('confirmPassword');

    return password && confirmPassword && password.value !== confirmPassword.value ?
    { matchPassword: true } : null;
};
