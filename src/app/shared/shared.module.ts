import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { InputBaseComponent } from './input-base/input-base.component';


@NgModule({
    declarations: [InputBaseComponent],
    imports: [ReactiveFormsModule],
    providers: [],
    exports: [InputBaseComponent]
})
export class SharedModule { }
