import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NotifierService } from 'angular-notifier';
import { StoresService } from 'src/app/core/services/stores.service';
import { StocksService } from 'src/app/core/services/stocks.service';
import { Store } from 'src/app/core/models/store';
import { Stock } from 'src/app/core/models/stock';

@Component({
  selector: 'app-stores',
  templateUrl: './stores.component.html',
  styleUrls: ['./stores.component.scss']
})
export class StoresComponent implements OnInit {

  public list: FormGroup;
  public page: number;
  constructor(private _fb: FormBuilder, private _msg: NotifierService, private _service: StoresService, private _stocksService: StocksService) {
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
    const list = this._service.getStores();
    list.forEach((element: Store) => {
      this.addElement(element);
    });
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
      const payload = element.value;
      delete payload.edit;
      this._service.updateStore(payload as Store)
      element.get('edit').setValue(false);
      this._msg.notify('success', 'Excelente!, el elemento fue guardado correctamente.', String(new Date().getTime()));
    } else {
      this._msg.notify('error', 'Hey!, recuerda llenar todos los campos antes de confirmar.', String(new Date().getTime()));
    }
  }

  /**
   * @name addElement
   * @description pushes a new element to the list.
   * @param element (optional) if exists, sets an element with preloaded information.
   */
  public addElement(element?: Store) {
    const list = this.list.get('list') as FormArray;
    list.insert(0,
      this._fb.group({
        id: [element ? element.id : String(new Date().getTime())],
        name: [element ? element.name : null, Validators.required],
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
    if (this.canDeleteStore(id)) {
      this._service.deleteStore(id);
      list.removeAt(index);
      this._msg.notify('info', 'Listo, elemento eliminado con éxito.', String(new Date().getTime()));
    } else {
      this._msg.notify('error', 'Disculpa, no se puede eliminar esta tienda, ya que está siendo usada por un inventario. Primero elimine dicho inventario.', String(new Date().getTime()));
    }
  }

  /**
   * @name canDeleteStore
   * @description returns true if store can be removed.
   * @id id of the store to test.
   */
  public canDeleteStore(id: string): boolean {
    return !this._stocksService.getStocks().find((element: Stock) => { return element.storeId === id });
  }

}
