import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductsService } from './services/products.service';
import { ProvidersService } from './services/providers.service';
import { StoresService } from './services/stores.service';
import { StocksService } from './services/stocks.service';


@NgModule({
  declarations: [],
  imports: [
    CommonModule
  ],
  providers: [ ProductsService, ProvidersService, StoresService, StocksService ]
})
export class CoreModule { }
