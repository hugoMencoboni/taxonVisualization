import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { AbstractControl, FormControl } from '@angular/forms';
import { conformToMask } from 'angular2-text-mask';
import { Subscription } from 'rxjs';

@Component({
  selector: 'base-input',
  templateUrl: './input-base.component.html',
  styleUrls: ['./input-base.component.scss']
})
export class InputBaseComponent implements OnInit, OnDestroy {

  @Input() label: string;
  @Input() control: FormControl;
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

    this.defineIfRequired();

    if (!this.mask) {
      this.defineMask();
    }
  }

  ngOnDestroy(): void {
    this.subsriptions.unsubscribe();
  }

  private defineMask(): void {
    switch (this.type) {
      case 'date': {
        this.mask = [/[0-3]/, /\d/, '-', /[0-1]/, /\d/, '-', /[1-2]/, /\d/, /\d/, /\d/];
        this.placeholder = !this.placeholder ? this.maskFormatedValue('31101985') : this.placeholder;
        break;
      }
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

  private defineIfRequired(): void {
    if (this.control && this.control.validator) {
      const validator = this.control.validator({} as AbstractControl);
      if (validator && validator.required) {
        this.required = true;
      }
    }
  }
}
