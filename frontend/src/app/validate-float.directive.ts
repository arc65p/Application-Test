import { Directive } from '@angular/core';
import { NG_VALIDATORS, Validator, AbstractControl } from '@angular/forms';


@Directive({
  selector: '[appValidateFloat]',
  providers: [
    {
      provide: NG_VALIDATORS,
      useExisting: ValidateFloatDirective,
      multi: true
    }
  ]
})
export class ValidateFloatDirective implements Validator{

  validate(control: AbstractControl): { [key: string]: any } | null {
    const floatValue = parseFloat(control.value);
    if (!isNaN(floatValue) && isFinite(floatValue) && Number.isInteger(floatValue) === false) {
      return null;
    } else {
      return { float: true };
    }
  }

}
