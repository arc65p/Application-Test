import { Directive } from '@angular/core';
import { NG_VALIDATORS, AbstractControl, Validator } from '@angular/forms';

@Directive({
  selector: '[alphanumeric]',
  providers: [
    {
      provide: NG_VALIDATORS,
      useExisting: AlphanumericDirective,
      multi: true
    }
  ]
})
export class AlphanumericDirective implements Validator {
  validate(control: AbstractControl): { [key: string]: any } | null {
    const alphanumericRegex = /^(?=.*[a-zA-Z])(?=.*\d)[a-zA-Z0-9]+$/; // Regular expression for alphanumeric values

    const isValid = alphanumericRegex.test(control.value); // Test if the value matches the regex
    return isValid ? null : { 'alphanumeric': { value: control.value } }; // Return validation error if not alphanumeric
  }
}
