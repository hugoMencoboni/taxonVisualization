import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { conformToMask } from 'angular2-text-mask';
import { Subscription } from 'rxjs';

@Component({
  selector: 'base-input',
  templateUrl: './input-base.component.html',
  styleUrls: ['./input-base.component.css']
})
export class InputBaseComponent implements OnInit, OnDestroy {

  @Input() label: string;
  @Input() formGroup: FormGroup;
  @Input() controlName: string;
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
    this.id = `${this.controlName}-${Math.random().toString(36).substring(8)}`;

    if (this.showStatus !== 'none') {
      const control = this.formGroup.get(this.controlName);
      this.subsriptions.add(
        control.statusChanges.subscribe(status => this.status = status)
      );
    }

    if (!this.mask) {
      this.defineMask();
    }
  }

  ngOnDestroy(): void {
    this.subsriptions.unsubscribe();
  }

  defineMask(): void {
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

  maskFormatedValue(valueToFormate: string): string {
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
