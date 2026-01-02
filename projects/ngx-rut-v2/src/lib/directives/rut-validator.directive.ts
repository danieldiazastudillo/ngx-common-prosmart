import { Directive, forwardRef } from '@angular/core';
import { AbstractControl, NG_VALIDATORS, ValidationErrors, Validator, ValidatorFn } from '@angular/forms';
import { rutValidate } from '../helpers/rut-helpers';

// Single reusable ValidatorFn
export const rutValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
  const value = control.value;
  if (!value) {
    return null;
  }
  return rutValidate(value) ? null : { invalidRut: true };
};

@Directive({
  selector: '[validateRut][ngModel],[validateRut][formControl]',
  providers: [
    { provide: NG_VALIDATORS, useExisting: forwardRef(() => RutValidator), multi: true },
  ],
  standalone: true
})
export class RutValidator implements Validator {
  validate(control: AbstractControl): ValidationErrors | null {
    return rutValidator(control);
  }
}
