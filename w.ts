import { EventListenerOrFn, OnOptions, IW, MappedListeners } from './ts-refs/trans-render/be/types';
import { CSSQuery } from './ts-refs/trans-render/types';
export function w(q: CSSQuery, ws: Array<IW>){
    const returnObj = new W(q);
    ws.push(returnObj);
    return returnObj;
}

export class W implements IW{
    constructor(public q: CSSQuery){}
    #listeners:  MappedListeners = {};
    get listeners(){
        return this.#listeners;
    }
    a(eventsToAdd: {[key: string]: EventListenerOrFn}){
        this.#listeners = {...this.#listeners, ...eventsToAdd};
        return this;
    }

}