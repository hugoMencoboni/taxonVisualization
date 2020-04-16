import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { TextMaskModule } from 'angular2-text-mask';
import { InputBaseComponent } from './input-base/input-base.component';

@NgModule({
    declarations: [InputBaseComponent],
    imports: [ReactiveFormsModule, CommonModule, TextMaskModule],
    providers: [],
    exports: [InputBaseComponent]
})
export class SharedModule { }
