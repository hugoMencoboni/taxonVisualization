import { Component, OnDestroy, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { Observable, of, Subscription } from 'rxjs';
import { delay, map, pairwise, startWith } from 'rxjs/operators';
import { ErrorInfo } from '../core/models/errorInfo';

@Component({
  selector: 'base-form-test',
  templateUrl: './form-test.component.html',
  styleUrls: ['./form-test.component.scss']
})
export class FormTestComponent implements OnInit, OnDestroy {

  form: FormGroup;
  subscription = new Subscription();
  lastChange: { formName: string, value: string };
  get lastChangeFormated(): string {
    return this.lastChange ? `${this.lastChange.formName} : ${this.lastChange.value}` : '';
  }

  errorList: Array<ErrorInfo> = [
    { code: 'required', message: 'Ce champ est obligatoir.' },
    { code: 'asyncError5Char', message: 'Erreur asynchrone 5 char.' },
    { code: 'asyncError6Char', message: 'Erreur asynchrone 6 char.' },
    { code: 'asyncErrorDate', message: 'Erreur date async > au jour.' }
  ];

  selectOptionList = [{ id: 1, label: 'Option 1' }, { id: 2, label: 'Option 2' }];

  constructor(private fb: FormBuilder) { }

  ngOnInit(): void {
    this.form = this.fb.group({
      base: ['', Validators.required],
      async: ['', Validators.required, [this.pendingSimulator5Char, this.pendingSimulator6Char]],
      date: ['', undefined, this.pendingSimulatorDate],
      telephone: ['', Validators.required],
      textarea: ['Lorem ipsum dolor sit amet, consectetur adipiscing elit.', Validators.required],
      select: ['', Validators.required],
      selectMultiple: ['', Validators.required],
      autocomplete: ['', Validators.required],
    });

    this.subscription.add(
      this.form.valueChanges.pipe(startWith(this.form.value), pairwise()).subscribe(([oldvalues, newValues]) => {
        let keyChanged: string;
        let valueChanged: string;

        Object.keys(newValues).forEach(property => {
          if (newValues[property] !== oldvalues[property]) {
            keyChanged = property;
            valueChanged = newValues[property];
          }
        });

        if (keyChanged) {
          this.lastChange = {
            formName: keyChanged,
            value: valueChanged
          };
        }
      })
    );
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  pendingSimulator5Char(control: AbstractControl): Observable<ValidationErrors | null> {
    return of(null).pipe(delay(4000), map(() => {
      if (control.value && control.value.length > 4) {
        return { asyncError5Char: true };
      }

      return null;
    }));
  }

  pendingSimulator6Char(control: AbstractControl): Observable<ValidationErrors | null> {
    return of(null).pipe(delay(4000), map(() => {
      if (control.value && control.value.length > 5) {
        return { asyncError6Char: true };
      }

      return null;
    }));
  }

  pendingSimulatorDate(control: AbstractControl): Observable<ValidationErrors | null> {
    return of(null).pipe(delay(4000), map(() => {
      if (control.value && (control.value as Date) > new Date()) {
        return { asyncErrorDate: true };
      }

      return null;
    }));
  }

  autocompleteCallback(searchPattern: string): Observable<Array<any>> {
    const opts = [{ id: 1, label: 'One' },
    { id: 2, label: 'Two' },
    { id: 3, label: 'Three' },
    { id: 4, label: 'For' },
    { id: 5, label: 'Five' },
    { id: 6, label: 'Six' },
    { id: 7, label: 'Seven' },
    { id: 8, label: 'Eight' },
    { id: 9, label: 'Nine' },
    { id: 10, label: 'Ten' },
    { id: 11, label: 'Eleven' },
    { id: 12, label: 'Twelve' },
    { id: 13, label: 'Thirteen' },
    { id: 14, label: 'Fourteen' },
    { id: 15, label: 'Fifteen' },
    { id: 16, label: 'Sixteen' },
    { id: 17, label: 'Seventeen' },
    { id: 18, label: 'Eighteen' },
    { id: 19, label: 'Nineteen' },
    { id: 20, label: 'Twenty' }];

    return of(opts).pipe(
      delay(800),
      map(options => options.filter(opt => opt.label && opt.label.toLowerCase().includes(searchPattern.toLowerCase())))
    );
  }
}
