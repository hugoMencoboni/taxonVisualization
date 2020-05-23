import { CommonModule } from '@angular/common';
import { Component, Input, NgModule, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelect, MatSelectModule } from '@angular/material/select';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Subscription } from 'rxjs';
import { ValidationHelper } from 'src/app/core/validators/validation.helper';

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
  @Input() emptyOptionEnable = false; // Option vide sélectionnable
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

    this.required = ValidationHelper.isRequired(this.control);
  }

  ngOnDestroy(): void {
    this.subsriptions.unsubscribe();
  }

  getErrorMessage(): string {
    return ValidationHelper.getErrorMessage(this.control, this.errorList);
  }

  focus(): void {
    this.selectElmt.focus();
  }
}

@NgModule({
  declarations: [SelectBaseComponent],
  exports: [SelectBaseComponent],
  imports: [
    ReactiveFormsModule,
    CommonModule,
    BrowserAnimationsModule,
    MatSelectModule,
    MatFormFieldModule
  ],
})
export class SelectModule { }
