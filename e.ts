import { EMC, EventListenerClass, EventListenerOrFn, IW } from "./ts-refs/trans-render/be/types";


export function e(emc: EMC, matchingElement: Element, ws: Array<IW>, initialPropVals: any, ac?: AbortController){
    const matchingWs = [];
    const {mapWSTo, primaryProp} = emc;
    for(const w of ws){
        if(!matchingElement.matches(w.q)) continue;
        matchingWs.push(w);
        const {listeners, props, primaryVal} = w;
        for(const key in listeners){
            let listener = listeners[key] as any;
            if(listener.toString().substring(0, 5) === 'class'){
                listener = new (<EventListenerClass>listener)() as any as EventListenerOrFn;
            }
            matchingElement.addEventListener(key, listener, {signal: ac?.signal});
        }
        Object.assign(initialPropVals, props);
        if(primaryProp !== undefined && primaryVal !== undefined){
            //TODO:  check if object and use object.assign?
            initialPropVals[primaryProp] = primaryVal;
        }
    }
    
    if(mapWSTo !== undefined){
        initialPropVals[mapWSTo] = matchingWs;
    }
}