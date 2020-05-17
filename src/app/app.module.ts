import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { DataService } from './core/services/data.service';
import { TaxRefService } from './core/services/taxRef.service';
import { InputModule } from './shared/form-base/input-base/input-base.component';
import { SharedModule } from './shared/shared.module';
import { ItemLinkComponent } from './tree/item-link/item-link.component';
import { ItemComponent } from './tree/item/item.component';
import { TreeComponent } from './tree/tree.component';

@NgModule({
  declarations: [
    AppComponent,
    TreeComponent,
    ItemComponent,
    ItemLinkComponent
  ],
  imports: [
    BrowserModule,
    ReactiveFormsModule,
    SharedModule,
    HttpClientModule,
    InputModule
  ],
  providers: [
    {
      provide: DataService,
      useValue: TaxRefService
    }],
  bootstrap: [AppComponent]
})
export class AppModule { }
