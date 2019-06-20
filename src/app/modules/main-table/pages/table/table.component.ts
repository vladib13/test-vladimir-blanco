import { Component, OnInit } from '@angular/core';
import { ELEMENTTYPES } from 'src/app/core/utils/select.utils';
import { ProductsService } from 'src/app/core/services/products.service';
import { ProvidersService } from 'src/app/core/services/providers.service';
import { StoresService } from 'src/app/core/services/stores.service';
import { NotifierService } from 'angular-notifier';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss']
})
export class TableComponent implements OnInit {

  public elementTypes = ELEMENTTYPES;
  public elementType: String;
  public previousElement: String;

  constructor(private _productsService: ProductsService,
              private _providersService: ProvidersService,
              private _storesService: StoresService,
              private _msg: NotifierService) {
    this.elementType = 'Proveedores';
    this.previousElement = this.elementType;
  }

  ngOnInit() {
  }

  /**
   * @name validateElementSelection
   * @description validations that allows the navigation between element types sections.
   */
  public validateElementSelection() {
    switch (this.elementType) {
      case 'Productos':
        if (this.hasProviders) {
          setTimeout(() => {
            this.previousElement = this.elementType;
          }, 5);
        } else {
          this._msg.notify('warning', 'Disculpa, antes de manejar productos debes crear al menos un proveedor.', String(new Date().getTime()));
          setTimeout(() => {
            this.elementType = this.previousElement;
          }, 5);
        }
        break;
      case 'Inventarios':
        if (this.hasStores && this._productsService) {
          setTimeout(() => {
            this.previousElement = this.elementType;
          }, 5);
        } else {
          setTimeout(() => {
            this.elementType = this.previousElement;
            this._msg.notify('warning', 'Disculpa, antes de manejar inventarios debes crear al menos una tienda y un producto.', String(new Date().getTime()));
          }, 5);
        }
        break;
      default:
        this.previousElement = this.elementType;
        break;
    }
  }

  /**
   * @name hasProviders
   * @description returns true if there is at least one provider on the list.
   */
  public get hasProviders() {
    return this._providersService.getProviders().length > 0;
  }

  /**
   * @name hasProducts
   * @description returns true if there is at least one product on the list.
   */
  public get hasProducts() {
    return this._productsService.getProducts().length > 0;
  }

  /**
   * @name hasStores
   * @description returns true if there is at least one store on the list.
   */
  public get hasStores() {
    return this._storesService.getStores().length > 0;
  }

}
