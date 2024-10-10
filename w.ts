import { EventListenerOrFn, OnOptions } from './ts-refs/trans-render/be/types';
import { CSSQuery } from './ts-refs/trans-render/types';
export function w(q: CSSQuery, ws: Array<W>){
    const returnObj = new W(q);
    ws.push(returnObj);
    return returnObj;
}

export class W{
    constructor(public q: CSSQuery){}
    #a:  {[key: string]: EventListenerOrFn} = {}
    a(eventsToAdd: {[key: string]: EventListenerOrFn}){
        this.#a = {...this.#a, ...eventsToAdd};
    }

}