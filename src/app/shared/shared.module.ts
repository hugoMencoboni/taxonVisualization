import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { InputBaseComponent } from './input-base/input-base.component';

@NgModule({
    declarations: [InputBaseComponent],
    imports: [ReactiveFormsModule, CommonModule],
    providers: [],
    exports: [InputBaseComponent]
})
export class SharedModule { }
