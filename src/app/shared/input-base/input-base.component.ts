import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
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
  }

  ngOnDestroy(): void {
    this.subsriptions.unsubscribe();
  }
}
