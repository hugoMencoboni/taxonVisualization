import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { AbstractControl, FormControl } from '@angular/forms';
import { MAT_MOMENT_DATE_ADAPTER_OPTIONS, MomentDateAdapter } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { Subscription } from 'rxjs';

export const DATE_FORMATS = {
  parse: {
    dateInput: 'DD/MM/YYYY',
  },
  display: {
    dateInput: 'DD/MM/YYYY',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};

@Component({
  selector: 'base-date',
  templateUrl: './date-base.component.html',
  styleUrls: ['../form-base.scss', './date-base.component.scss'],
  providers: [
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
    { provide: MAT_MOMENT_DATE_ADAPTER_OPTIONS, useValue: { strict: true } },
    { provide: MAT_DATE_FORMATS, useValue: DATE_FORMATS },
  ],
})
export class DateBaseComponent implements OnInit, OnDestroy {

  @Input() label: string;
  @Input() control: FormControl;
  @Input() errorList = new Array<{ code: string, message: string }>();
  @Input() showStatus: 'onPending' | 'none' = 'onPending';
  @Input() placeholder = 'jj/mm/aaaa';

  required: boolean;
  status: string;
  id: string;

  subsriptions = new Subscription();

  constructor() { }

  ngOnInit(): void {
    this.id = `${Math.random().toString(36).substring(9)}-${Math.random().toString(36).substring(9)}`;

    if (this.showStatus !== 'none') {
      this.subsriptions.add(
        this.control.statusChanges.subscribe(status => this.status = status)
      );
    }

    this.defineIfRequired();
  }

  ngOnDestroy(): void {
    this.subsriptions.unsubscribe();
  }

  getErrorMessage(): string {
    const errors = this.errorList.filter((err: { code: string, message: string }) => this.control.hasError(err.code));
    return errors ? errors.map(err => err.message).join('<br>') : '';
  }

  private defineIfRequired(): void {
    if (this.control && this.control.validator) {
      const validator = this.control.validator({} as AbstractControl);
      if (validator && validator.required) {
        this.required = true;
      }
    }
  }
}
