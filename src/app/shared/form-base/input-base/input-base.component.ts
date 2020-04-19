import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { conformToMask } from 'angular2-text-mask';
import { Subscription } from 'rxjs';
import { ValidationHelper } from 'src/app/core/validators/validation.helper';

@Component({
  selector: 'base-input',
  templateUrl: './input-base.component.html',
  styleUrls: ['../form-base.scss', './input-base.component.scss']
})
export class InputBaseComponent implements OnInit, OnDestroy {

  @Input() label: string;
  @Input() control: FormControl;
  @Input() errorList = new Array<{ code: string, message: string }>();
  @Input() maxLength: number | undefined = undefined;
  @Input() type = 'text';
  @Input() showStatus: 'onPending' | 'none' = 'onPending';
  @Input() mask: Array<string | RegExp> | false = false;
  @Input() placeholder = '';

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

    this.required = ValidationHelper.isRequired(this.control);

    if (!this.mask) {
      this.defineMask();
    }
  }

  ngOnDestroy(): void {
    this.subsriptions.unsubscribe();
  }

  getErrorMessage(): string {
    return ValidationHelper.getErrorMessage(this.control, this.errorList);
  }

  private defineMask(): void {
    switch (this.type) {
      case 'telephone': {
        this.mask = ['(', '+', /\d/, /\d/, ')', /\d/, '.', /\d/, /\d/, '.', /\d/, /\d/, '.', /\d/, /\d/, '.', /\d/, /\d/];
        this.placeholder = !this.placeholder ? this.maskFormatedValue('33100000000') : this.placeholder;
        break;
      }
    }
  }

  private maskFormatedValue(valueToFormate: string): string {
    let formatedValue: any;

    try {
      formatedValue = conformToMask(
        valueToFormate,
        this.mask,
        { guide: false }
      );
    } catch (err) {
      console.error(err);
    }

    return formatedValue ? formatedValue.conformedValue : undefined;
  }
}
