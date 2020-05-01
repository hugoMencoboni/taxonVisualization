import { CommonModule } from '@angular/common';
import { Component, Input, NgModule, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { FormControl, ReactiveFormsModule, ValidationErrors, ValidatorFn } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { merge, Observable, of, Subscription } from 'rxjs';
import { catchError, debounceTime, filter, map, startWith, switchMap, tap } from 'rxjs/operators';
import { ValidationHelper } from 'src/app/core/validators/validation.helper';

@Component({
    selector: 'base-autocomplete',
    templateUrl: './autocomplete-base.component.html',
    styleUrls: ['../form-base.scss', './autocomplete-base.component.scss']
})
export class AutoCompleteBaseComponent implements OnInit, OnChanges, OnDestroy {

    @Input() label: string;
    @Input() control: FormControl;
    @Input() displayedProperty = 'label'; // Indique quelle propriété des options est affichée
    @Input() valueProperty = 'id'; // Indique quelle propriété est associée au control lors du choix d'un option
    @Input() filterFunction: (searchPattern) => Observable<Array<any>>;
    @Input() errorList = new Array<{ code: string, message: string }>();
    @Input() delayBeforeFiltering = 400; // delai après l'appui d'une touche et le lancement de la recherche
    @Input() nbrCharBeforeFiltering = 2; // nombre de charactère saisi nécessaire pour le lancement de la recherche
    @Input() maxLength: number | undefined = undefined;
    @Input() showStatus: 'onPending' | 'none' = 'onPending';
    @Input() placeholder = '';
    @Input() disable = false;

    required: boolean;
    pending: boolean;
    id: string;
    filteredOptions$: Observable<Array<any>>;

    subsriptions = new Subscription();
    // permet de séparer la saisie de la selection, cela evite que "this.control"
    // contienne le text saisie par moment, et l'object selectionné après selection
    internalControl = new FormControl();
    errorSubsriptions = new Subscription();

    constructor() { }

    ngOnInit(): void {
        this.id = `${Math.random().toString(36).substring(9)}-${Math.random().toString(36).substring(9)}`;

        if (this.showStatus !== 'none') {
            this.subsriptions.add(
                this.control.statusChanges.subscribe(status => this.pending = status === 'PENDING')
            );
        }

        this.required = ValidationHelper.isRequired(this.control);
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes.control) {
            this.bindControlsErrors();
            this.addEnforceSelectionValidator();
        }

        if (changes.disable) {
            this.bindDisable();
        }

        if (changes.filterFunction) {
            this.bindFilterFunction();
        }
    }

    ngOnDestroy(): void {
        this.subsriptions.unsubscribe();
        this.errorSubsriptions.unsubscribe();
    }

    displayFn(value: AutocompleteOption): string {
        return value && value.data ? value.data[this.displayedProperty] : '';
    }

    getErrorMessage(): string {
        return ValidationHelper.getErrorMessage(this.control, this.errorList);
    }

    onFocus(): void {
        if (this.internalControl.pristine) {
            this.internalControl.setErrors(this.control.errors);
        }
    }

    private bindControlsErrors(): void {
        this.errorSubsriptions.unsubscribe();
        const changes$ = merge(this.control.valueChanges, this.internalControl.statusChanges);
        this.errorSubsriptions = changes$.pipe(startWith(this.control.status)).subscribe(() => {
            this.internalControl.setErrors(this.control.errors, { emitEvent: false });
        });
    }

    private bindDisable(): void {
        if (this.disable) {
            this.internalControl.disable();
        } else {
            this.internalControl.enable();
        }
    }

    private bindFilterFunction(): void {
        this.filteredOptions$ = this.internalControl.valueChanges.pipe(
            filter(value => {
                if (value instanceof AutocompleteOption) {
                    // Il s'agit d'une option séléctionnée
                    // on notifie le control en entrée et on ne lance pas la recherche
                    this.changeControl(value.data[this.valueProperty]);
                    return false;
                }
                else {
                    // Il s'agit d'une recherche
                    // => on redéfini la valeur du control
                    this.changeControl(null);
                    return (value as string).length >= this.nbrCharBeforeFiltering;
                }
            }),
            tap(() => this.pending = true),
            debounceTime(this.delayBeforeFiltering),
            switchMap(searchPattern => this.filterFunction(searchPattern).pipe(
                catchError(err => {
                    console.error(err);
                    return of([]);
                })
            )),
            map(options => options ? options.map(opt => new AutocompleteOption(opt)) : null),
            tap(() => this.pending = false)
        );
    }

    private changeControl(newValue: any): void {
        if (this.control.value !== newValue) {
            this.control.setValue(newValue);
            this.control.markAsDirty();
        }
    }

    private addEnforceSelectionValidator(): void {
        const ctrlValidators = this.control.validator;
        this.control.setValidators([ctrlValidators, this.EnforceSelectionValidator(this.internalControl)]);
    }

    private EnforceSelectionValidator(internalControl: FormControl): ValidatorFn {
        return (externalControl: FormControl): ValidationErrors | null => {
            if (!internalControl.value || internalControl.value instanceof AutocompleteOption) {
                return null;
            }

            return { mustSelecteElement: true };
        };
    }
}

/**
 * Classe représentant les options sélectionnable
 * permet de différencier une saisie dans le champ d'un élément choisi
 */
class AutocompleteOption {
    constructor(data: any) {
        this.data = data;
    }
    data: any;
}

@NgModule({
    declarations: [AutoCompleteBaseComponent],
    exports: [AutoCompleteBaseComponent],
    imports: [
        ReactiveFormsModule,
        CommonModule,
        BrowserAnimationsModule,
        MatAutocompleteModule,
        MatInputModule,
        MatFormFieldModule
    ],
})
export class AutocompleteModule { }
