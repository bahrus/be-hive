import { EventListenerOrFn, OnOptions, IW, MappedListeners } from './ts-refs/trans-render/be/types';
import { CSSQuery } from './ts-refs/trans-render/types';
export function w(q: CSSQuery, ws: Array<IW>, callback: (q: CSSQuery) => W){
    const returnObj = new W(q, callback);
    ws.push(returnObj);
    return returnObj;
}

export class W<T = EventTarget> implements IW<T>{
    constructor(public q: CSSQuery, public w: (q: CSSQuery) => W){}



    #listeners:  MappedListeners = {};
    get listeners(){
        return this.#listeners;
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
    #primaryVal: any
    get primaryVal(){
        return this.#primaryVal
    }
    p(val: any){
        this.#primaryVal = val;
    }
    #props: Partial<T> = {};
    get props(){
        return this.#props;
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
    #refs: {[key: string]: any} = {};
    get refs(){
        return this.#refs;
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