import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { FormTestComponent } from './form-test/form-test.component';
import { AutocompleteModule } from './shared/form-base/autocomplete-base/autocomplete-base.component';
import { DateModule } from './shared/form-base/date-base/date-base.component';
import { InputModule } from './shared/form-base/input-base/input-base.component';
import { SelectModule } from './shared/form-base/select-base/select-base.component';
import { SharedModule } from './shared/shared.module';

@NgModule({
  declarations: [
    AppComponent,
    FormTestComponent
  ],
  imports: [
    BrowserModule,
    ReactiveFormsModule,
    InputModule,
    AutocompleteModule,
    DateModule,
    SelectModule,
    SharedModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
