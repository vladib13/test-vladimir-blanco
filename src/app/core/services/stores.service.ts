import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Store } from '../models/store';

const STORES = 'DT_TEST_STORES';

@Injectable()
export class StoresService {

    constructor() { }

    /**
     * @name getStores
     * @description returns an array with the existing elements of the list.
     */
    public getStores(): Array<Store> {
        return this.isStorageEmpty ? [] : JSON.parse(this.storesList);
    }

    /**
     * @name updateStore
     * @description depending the situation, creates or updates an element on the list.
     * @param payload object to create or edit on the list.
     */
    public updateStore(payload: Store) {
        const list = this.getStores();
        const oldElement = list.find((element: Store) => { return element.id === payload.id });
        oldElement ? list.splice(list.indexOf(oldElement), 1, payload) : list.push(payload);
        localStorage.setItem(STORES, JSON.stringify(list));

    }

    /**
     * @name deleteStore
     * @description deletes an element of the list, given an id.
     * @param id id of the element to remove.
     */
    public deleteStore(id: string) {
        const list = this.getStores();
        const element = list.find((element: Store) => { return element.id === id });
        list.splice(list.indexOf(element), 1);
        localStorage.setItem(STORES, JSON.stringify(list));
    }

    /**
     * @name isStorageEmpty
     * @description returns true if there is at least one element on the storage.
     */
    private get isStorageEmpty(): boolean {
        return this.storesList === null || this.storesList === undefined;
    }

    /**
     * @name storesList
     * @description returns the string form of the element's array.
     */
    private get storesList(): string {
        return localStorage.getItem(STORES);
    }

}
