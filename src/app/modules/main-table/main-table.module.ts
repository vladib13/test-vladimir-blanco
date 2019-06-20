import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import {NgxPaginationModule} from 'ngx-pagination'; 
import { TooltipModule } from 'ng2-tooltip-directive';

import { MainTableRoutingModule } from './main-table-routing.module';

import { TableComponent } from './pages/table/table.component';
import { ProductsComponent } from './components/products/products.component';
import { ProvidersComponent } from './components/providers/providers.component';
import { StoresComponent } from './components/stores/stores.component';
import { StocksComponent } from './components/stocks/stocks.component';
import { CoreModule } from 'src/app/core/core.module';

@NgModule({
  declarations: [TableComponent, ProductsComponent, ProvidersComponent, StoresComponent, StocksComponent,],
  imports: [
    CommonModule,
    MainTableRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    CoreModule,
    NgxPaginationModule,
    TooltipModule,
  ]
})
export class MainTableModule { }
