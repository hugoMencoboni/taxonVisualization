import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { TextMaskModule } from 'angular2-text-mask';
import { FormBaseModule } from './form-base/form-base.module';
import { MaterialModule } from './material.module';

@NgModule({
    imports: [ReactiveFormsModule, CommonModule, TextMaskModule, MaterialModule, FormBaseModule],
    providers: [],
    exports: [FormBaseModule, MaterialModule]
})
export class SharedModule { }
