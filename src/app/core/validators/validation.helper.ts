import { AbstractControl, FormControl } from '@angular/forms';
import { ErrorInfo } from '../models/errorInfo';

export class ValidationHelper {
    /**
     * Défini si un contrôle est requit
     */
    static isRequired(control: FormControl): boolean {
        if (control && control.validator) {
            const validator = control.validator({} as AbstractControl);
            if (validator && validator.required) {
                return true;
            }
        }

        return false;
    }

    /**
     * Formate la liste des erreurs d'un contrôle suivant une liste d'information
     * d'erreur fournie.
     */
    static getErrorMessage(control: AbstractControl, errorList: Array<ErrorInfo>): string {
        const errors = errorList.filter((err: { code: string, message: string }) => control.hasError(err.code));
        return errors ? errors.map(err => err.message).join('<br>') : '';
    }
}
