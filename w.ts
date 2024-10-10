import { EventListenerOrFn, OnOptions, IW } from './ts-refs/trans-render/be/types';
import { CSSQuery } from './ts-refs/trans-render/types';
export function w(q: CSSQuery, ws: Array<IW>){
    const returnObj = new W(q);
    ws.push(returnObj);
    return returnObj;
}

export class W implements IW{
    constructor(public q: CSSQuery){}
    #a:  {[key: string]: EventListenerOrFn} = {}
    a(eventsToAdd: {[key: string]: EventListenerOrFn}){
        this.#a = {...this.#a, ...eventsToAdd};
        return this;
    }

}