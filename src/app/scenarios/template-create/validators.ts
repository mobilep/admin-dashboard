import {
  AbstractControl,
  ValidatorFn,
  Validators
} from '@angular/forms';


export namespace CustomValidators {
  export const MAX_LENGTH = 128;

  export const Name = [
    Validators.required,
    minLengthTrimmed(1)
  ];

  function minLengthTrimmed(min: number): ValidatorFn | any {
    return (control: AbstractControl) => {
      return control.value.trim().length < min ? { required: true } : null;
    }
  }

  export class ArrayValidators {

    // max length
    public static maxLength(max: number): ValidatorFn | any {
      return (control: AbstractControl) => {
        return control.value.length > max ? { maxLength: true } : null;
      }
    }

    // min length
    public static minLength(min: number): ValidatorFn | any {
      return (control: AbstractControl) => {
        return control.value.length < min ? { minLength: true } : null;
      }
    }
  }

}
