import { EventListenerClass, EventListenerOrFn, IW } from "./ts-refs/trans-render/be/types";


export function e(matchingElement: Element, ws: Array<IW>, initialPropVals: any, ac?: AbortController){
    const matchingWs = [];
    for(const w of ws){
        if(!matchingElement.matches(w.q)) continue;
        matchingWs.push(w);
        const {listeners, props} = w;
        for(const key in listeners){
            let listener = listeners[key] as any;
            if(listener.toString().substring(0, 5) === 'class'){
                listener = new (<EventListenerClass>listener)() as any as EventListenerOrFn;
            }
            matchingElement.addEventListener(key, listener, {signal: ac?.signal});
        }
        Object.assign(initialPropVals, props);
    }
    return matchingWs;
}