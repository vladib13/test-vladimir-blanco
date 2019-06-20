import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Product } from '../models/product';

const PRODUCTS = 'DT_TEST_PRODUCTS';

@Injectable()
export class ProductsService {

    constructor() { }

    /**
     * @name getProducts
     * @description returns an array with the existing elements of the list.
     */
    public getProducts(): Array<Product> {
        return this.isStorageEmpty ? [] : JSON.parse(this.productsList);
    }

    /**
     * @name updateProduct
     * @description depending the situation, creates or updates an element on the list.
     * @param payload object to create or edit on the list.
     */
    public updateProduct(payload: Product) {
        const list = this.getProducts();
        const oldElement = list.find((element: Product) => { return element.id === payload.id });
        oldElement ? list.splice(list.indexOf(oldElement), 1, payload) : list.push(payload);
        localStorage.setItem(PRODUCTS, JSON.stringify(list));

    }

    /**
     * @name addQuantity
     * @description adds a stock purchase to existance of a product.
     * @param id id of the product.
     * @param quantity quantity to add.
     */
    public addQuantity(id: string, quantity: number) {
        const list = this.getProducts();
        const product = list.find((element: Product) => { return element.id === id });
        product.quantity += quantity;
        // list.splice(list.indexOf(pr), 1, payload);
        localStorage.setItem(PRODUCTS, JSON.stringify(list));
    }

    /**
     * @name disccountQuantity
     * @description disccounts a stock purchase from existance of a product.
     * @param id id of the product.
     * @param quantity quantity to disccount.
     */
    public disccountQuantity(id: string, quantity: number) {
        const list = this.getProducts();
        const product = list.find((element: Product) => { return element.id === id });
        product.quantity -= quantity;
        // list.splice(list.indexOf(pr), 1, payload);
        localStorage.setItem(PRODUCTS, JSON.stringify(list));
    }

    /**
     * @name deleteProduct
     * @description deletes an element of the list, given an id.
     * @param id id of the element to remove.
     */
    public deleteProduct(id: string) {
        const list = this.getProducts();
        const element = list.find((element: Product) => { return element.id === id });
        list.splice(list.indexOf(element), 1);
        localStorage.setItem(PRODUCTS, JSON.stringify(list));
    }

    /**
     * @name isStorageEmpty
     * @description returns true if there is at least one element on the storage.
     */
    private get isStorageEmpty(): boolean {
        return this.productsList === null || this.productsList === undefined;
    }

    /**
     * @name productsList
     * @description returns the string form of the element's array.
     */
    private get productsList(): string {
        return localStorage.getItem(PRODUCTS);
    }

}
