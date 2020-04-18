import { Component, OnDestroy, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { Observable, of, Subscription } from 'rxjs';
import { delay, map, pairwise, startWith } from 'rxjs/operators';

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

  errorList = [
    { code: 'required', message: 'Ce champ est obligatoir.' },
    { code: 'asyncError5Char', message: 'Erreur asynchrone 5 char.' },
    { code: 'asyncError6Char', message: 'Erreur asynchrone 6 char.' }
  ];

  constructor(private fb: FormBuilder) { }

  ngOnInit(): void {
    this.form = this.fb.group({
      input: ['', Validators.required],
      input2: ['', Validators.required, [this.pendingSimulator5Char, this.pendingSimulator6Char]],
      input3: ['2020-04-16', undefined, this.pendingSimulator5Char],
      input4: ['', Validators.required],
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

  formSend(): void {
    const a = 5;
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
}
