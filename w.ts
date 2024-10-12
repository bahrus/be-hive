import { EventListenerOrFn, OnOptions, IW, MappedListeners } from './ts-refs/trans-render/be/types';
import { CSSQuery } from './ts-refs/trans-render/types';
export function w(q: CSSQuery, ws: Array<IW>){
    const returnObj = new W(q);
    ws.push(returnObj);
    return returnObj;
}

export class W<T = EventTarget> implements IW<T>{
    constructor(public q: CSSQuery){}
    #listeners:  MappedListeners = {};
    get listeners(){
        return this.#listeners;
    }
    #props: Partial<T> = {};
    get props(){
        return this.#props;
    }
    #refs: {[key: string]: any} = {};
    get refs(){
        return this.#refs;
    }
    /**
     * add events
     * @param eventsToAdd 
     * @returns 
     */
    a(eventsToAdd: {[key: string]: EventListenerOrFn}){
        this.#listeners = {...this.#listeners, ...eventsToAdd};
        return this;
    }
    /**
     * set props
     * @param props 
     * @returns 
     */
    s(props: Partial<T>){
        this.#props = {...this.#props, ...props};
        return this;
    }

    /**
     * register refs
     * @param refs 
     * @returns 
     */
    r(refs: {[key: string]: any}){
        this.#refs = {...this.#refs, ...refs};
        return this;
    }

}