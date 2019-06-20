import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NotifierService } from 'angular-notifier';
import { ProductsService } from 'src/app/core/services/products.service';
import { Product } from 'src/app/core/models/product';
import { StocksService } from 'src/app/core/services/stocks.service';
import { Stock } from 'src/app/core/models/stock';
import { StoresService } from 'src/app/core/services/stores.service';
import { Store } from 'src/app/core/models/store';

@Component({
  selector: 'app-stocks',
  templateUrl: './stocks.component.html',
  styleUrls: ['./stocks.component.scss']
})
export class StocksComponent implements OnInit {

  public list: FormGroup;
  public page: number;
  constructor(private _fb: FormBuilder,
              private _msg: NotifierService,
              private _service: StocksService,
              private _storesService: StoresService,
              private _productsService: ProductsService) {
    this.page = 1;
    this.list = this.generateForm();
  }

  ngOnInit() {
    this.fillList();
  }

  /**
   * @name fillList
   * @description fills the list with the storage elements if they exist.
   */
  private fillList() {
    const list = this._service.getStocks();
    list.forEach((element: Stock) => {
      this.addElement(element);
    });
  }

  /**
   * @name products
   * @description returns all the products on the list.
   */
  public get products(): Array<Product> {
    return this._productsService.getProducts();
  }

  /**
   * @name stores
   * @description returns all the stores on the list.
   */
  public get stores(): Array<Store> {
    return this._storesService.getStores();
  }

  /**
   * @name storeName
   * @description given an id, returns the name of the store.
   * @param id id of the store to search.
   */
  public storeName(id: string): string {
    return this.stores.find((element: Store) => element.id === id).name;
  }

  /**
   * @name productName
   * @description given an id, returns the name of the product.
   * @param id id of the product to search.
   */
  public productName(id: string): string {
    return this.products.find((element: Product) => element.id === id).name;
  }

  /**
   * @name productQuantity
   * @description given an id, returns the quantiy of products.
   * @param id id of the product to search.
   */
  public productQuantity(id: string): number {
    return this.products.find((element: Product) => element.id === id).quantity;
  }

  /**
   * @name generateForm
   * @description returns the empty and initialized form group.
   */
  private generateForm(): FormGroup {
    return this._fb.group({
      list: this._fb.array([])
    })
  }

  /**
   * @name confirm
   * @description completes the creation of an element.
   * @param element formgroup object that represents the element to create.
   */
  public confirm(element: FormGroup) {
    if (element.valid) {
      this._productsService.addQuantity(element.value.productId, element.value.oldProductsQuantity);
      element.get('oldProductsQuantity').setValue(element.value.productsQuantity);
      if (this.validQuantity(element.value.productId, element.value.productsQuantity)) {
        const payload = element.value;
        delete payload.edit;
        delete payload.oldProductsQuantity;
        this._service.updateStock(payload as Stock)
        element.get('edit').setValue(false);
        this._msg.notify('success', 'Excelente!, el elemento fue guardado correctamente.', String(new Date().getTime()));
      } else {
        this._msg.notify('error', 'Lo sentimos, la cantidad solicitada, excede la existencia actual del producto.', String(new Date().getTime()));
      }
    } else {
      this._msg.notify('error', 'Hey!, recuerda llenar todos los campos antes de confirmar.', String(new Date().getTime()));
    }
  }

  /**
   * @name validQuantity
   * @description returns true if element's quantity is less or equal to product's existance.
   * @param id id of the product.
   * @param quantity stock's quantity to be compared versus product's existance.
   */
  public validQuantity(id: string, quantity: number) {
    return quantity <= this.productQuantity(id);
  }

  /**
   * @name addElement
   * @description pushes a new element to the list.
   * @param element (optional) if exists, sets an element with preloaded information.
   */
  public addElement(element?: Stock) {
    const list = this.list.get('list') as FormArray;
    list.insert(0,
      this._fb.group({
        id: [element ? element.id : String(new Date().getTime())],
        storeId: [element ? element.storeId : null, Validators.required],
        productId: [element ? element.productId : null, Validators.required],
        productsQuantity: [element ? element.productsQuantity : null, Validators.required],
        oldProductsQuantity: [element ? element.productsQuantity : 0],
        purchaseDate: [element ? element.purchaseDate : new Date(), Validators.required],
        edit: [element ? false : true]
      })
    );
    if (!element) {
      this.page = 1;
      this._msg.notify('info', 'Genial, ahora llena todos los campos y confirma la creación.', String(new Date().getTime()));
    }
  }

  /**
   * @name deleteElement
   * @description removes an element of the list.
   * @param index index of the element to remove from the list.
   */
  public deleteElement(index: number) {
    const list = this.list.get('list') as FormArray;
    const id = list.get(String(index)).value.id;
    this._service.deleteStock(id);
    list.removeAt(index);
    this._msg.notify('info', 'Listo, elemento eliminado con éxito.', String(new Date().getTime()));
  }

}
