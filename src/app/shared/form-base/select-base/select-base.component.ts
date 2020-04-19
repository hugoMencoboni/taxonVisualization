import { Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { AbstractControl, FormControl } from '@angular/forms';
import { MatSelect } from '@angular/material/select';
import { Subscription } from 'rxjs';

@Component({
  selector: 'base-select',
  templateUrl: './select-base.component.html',
  styleUrls: ['../form-base.scss', './select-base.component.scss']
})
export class SelectBaseComponent implements OnInit, OnDestroy {

  @Input() label: string;
  @Input() control: FormControl;
  @Input() options: Array<any>;
  @Input() displayedProperty = 'label'; // Indique quelle propriété des options est affichée
  @Input() valueProperty = 'id'; // Indique quelle propriété est associée au control lors du choix d'un option
  @Input() emptyOptionEnable = true; // Option vide sélectionnable
  @Input() emptyOptionText = '--';
  @Input() selectMany = false; // Défini si plusieurs options peuvent être choisis
  @Input() errorList = new Array<{ code: string, message: string }>();
  @Input() showStatus: 'onPending' | 'none' = 'onPending';

  @ViewChild('select') selectElmt: MatSelect;

  required: boolean;
  status: string;

  subsriptions = new Subscription();

  constructor() { }

  ngOnInit(): void {
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

  focus(): void {
    this.selectElmt.focus();
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
