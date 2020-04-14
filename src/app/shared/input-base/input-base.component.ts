import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'base-input',
  templateUrl: './input-base.component.html',
  styleUrls: ['./input-base.component.css']
})
export class InputBaseComponent implements OnInit {

  @Input() label: string;
  @Input() formGroup: FormGroup;
  @Input() controlName: string;
  @Input() maxLength: number | undefined = undefined;
  @Input() type = 'text';

  required: boolean;

  constructor() { }

  ngOnInit(): void {
  }
}
