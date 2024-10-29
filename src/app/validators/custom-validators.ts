import { FormControl, ValidationErrors } from "@angular/forms";

export class CustomValidators {



    // whitespace validator
    static notOnlyWhiteSpaces(control: FormControl): ValidationErrors | null {

        // check if string has only white spaces
        if ((control?.value != null) && (control.value.trim().length === 0)) {
            
            return {"notOnlyWhiteSpaces": true};
        } else {
            return null;
        }
    }
}
