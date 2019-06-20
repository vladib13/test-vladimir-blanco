import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Provider } from '../models/provider';

const PROVIDERS = 'DT_TEST_PROVIDERS';

@Injectable()
export class ProvidersService {

    constructor() { }

    /**
     * @name getProviders
     * @description returns an array with the existing elements of the list.
     */
    public getProviders(): Array<Provider> {
        return this.isStorageEmpty ? [] : JSON.parse(this.providersList);
    }

    /**
     * @name updateProvider
     * @description depending the situation, creates or updates an element on the list.
     * @param payload object to create or edit on the list.
     */
    public updateProvider(payload: Provider) {
        const list = this.getProviders();
        const oldElement = list.find((element: Provider) => { return element.id === payload.id });
        oldElement ? list.splice(list.indexOf(oldElement), 1, payload) : list.push(payload);
        localStorage.setItem(PROVIDERS, JSON.stringify(list));

    }

    /**
     * @name deleteProvider
     * @description deletes an element of the list, given an id.
     * @param id id of the element to remove.
     */
    public deleteProvider(id: string) {
        const list = this.getProviders();
        const element = list.find((element: Provider) => { return element.id === id });
        list.splice(list.indexOf(element), 1);
        localStorage.setItem(PROVIDERS, JSON.stringify(list));
    }

    /**
     * @name isStorageEmpty
     * @description returns true if there is at least one element on the storage.
     */
    private get isStorageEmpty(): boolean {
        return this.providersList === null || this.providersList === undefined;
    }

    /**
     * @name providersList
     * @description returns the string form of the element's array.
     */
    private get providersList(): string {
        return localStorage.getItem(PROVIDERS);
    }

}
