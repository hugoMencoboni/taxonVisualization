import { AbstractControl, FormControl } from '@angular/forms';
import { ErrorInfo } from '../models/errorInfo';

export class ValidationHelper {
    /**
     * Défini si un contrôle est requit
     *
     * @private
     * @param {FormControl} control
     * @returns {boolean}
     * @memberof ValidationHelper
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
     *
     * @static
     * @param {AbstractControl} control
     * @param {Array<ErrorInfo>} errorList
     * @returns {string}
     * @memberof ValidationHelper
     */
    static getErrorMessage(control: AbstractControl, errorList: Array<ErrorInfo>): string {
        const errors = errorList.filter((err: { code: string, message: string }) => control.hasError(err.code));
        return errors ? errors.map(err => err.message).join('<br>') : '';
    }
}
