import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { DataService } from './core/services/data.service';
import { GBIFService } from './core/services/GBIF.service';
import { FiltersComponent } from './filters/filters.component';
import { LegendComponent } from './legend/legend.component';
import { SelectModule } from './shared/form-base/select-base/select-base.component';
import { SharedModule } from './shared/shared.module';
import { ItemLinkComponent } from './tree/item-link/item-link.component';
import { ItemComponent } from './tree/item/item.component';
import { TreeComponent } from './tree/tree.component';

@NgModule({
  declarations: [
    AppComponent,
    TreeComponent,
    LegendComponent,
    ItemComponent,
    ItemLinkComponent,
    FiltersComponent
  ],
  imports: [
    BrowserModule,
    ReactiveFormsModule,
    SharedModule,
    HttpClientModule,
    SelectModule
  ],
  providers: [
    {
      provide: DataService,
      useClass: GBIFService
    }],
  bootstrap: [AppComponent]
})
export class AppModule { }
