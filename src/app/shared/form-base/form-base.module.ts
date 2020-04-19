import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { TextMaskModule } from 'angular2-text-mask';
import { MaterialModule } from '../material.module';
import { DateBaseComponent } from './date-base/date-base.component';
import { InputBaseComponent } from './input-base/input-base.component';

@NgModule({
    declarations: [InputBaseComponent, DateBaseComponent],
    imports: [ReactiveFormsModule, CommonModule, TextMaskModule, MaterialModule],
    providers: [],
    exports: [InputBaseComponent, DateBaseComponent]
})
export class FormBaseModule { }
