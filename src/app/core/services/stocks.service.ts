import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Stock } from '../models/stock';
import { ProductsService } from './products.service';

const STOCKS = 'DT_TEST_STOCKS';

@Injectable()
export class StocksService {

    constructor(private _productsService: ProductsService) { }

    /**
     * @name getStocks
     * @description returns an array with the existing elements of the list.
     */
    public getStocks(): Array<Stock> {
        return this.isStorageEmpty ? [] : JSON.parse(this.stocksList);
    }

    /**
     * @name updateStock
     * @description depending the situation, creates or updates an element on the list.
     * @param payload object to create or edit on the list.
     */
    public updateStock(payload: Stock) {
        const list = this.getStocks();
        const oldElement = list.find((element: Stock) => { return element.id === payload.id });
        oldElement ? list.splice(list.indexOf(oldElement), 1, payload) : list.push(payload);
        this._productsService.disccountQuantity(payload.productId, payload.productsQuantity);
        localStorage.setItem(STOCKS, JSON.stringify(list));

    }

    /**
     * @name deleteStock
     * @description deletes an element of the list, given an id.
     * @param id id of the element to remove.
     */
    public deleteStock(id: string) {
        const list = this.getStocks();
        const element = list.find((element: Stock) => { return element.id === id });
        this._productsService.addQuantity(element.productId, element.productsQuantity);
        list.splice(list.indexOf(element), 1);
        localStorage.setItem(STOCKS, JSON.stringify(list));
    }

    /**
     * @name isStorageEmpty
     * @description returns true if there is at least one element on the storage.
     */
    private get isStorageEmpty(): boolean {
        return this.stocksList === null || this.stocksList === undefined;
    }

    /**
     * @name stocksList
     * @description returns the string form of the element's array.
     */
    private get stocksList(): string {
        return localStorage.getItem(STOCKS);
    }

}
