import {EMC, EventListenerOrFn, OnOptions} from './ts-refs/trans-render/be/types';
import {registeredHandlers, scopedHandlers, idHandlers} from './be-hive.js';
import { CSSQuery } from './ts-refs/trans-render/types';

export class Registry{
    static register(emc: EMC, handlerName: string, handler: EventListenerOrFn){
        const cluster = registeredHandlers.get(emc)!;
        const customHandlers = cluster.get(emc.handlerKey!)!;
        if(customHandlers.has(handlerName)){
            console.warn(`Overriding ${handlerName}`);
        }
        customHandlers.set(handlerName, handler);
    }

    static within(emc: EMC, q: CSSQuery,  handlerName: string, handler: EventListenerOrFn){
        const scopedCluster = scopedHandlers.get(emc)!;
        const scopedCustomHandlers = scopedCluster.get(emc.handlerKey!)!;
        if(!scopedCustomHandlers.has(handlerName)){
            scopedCustomHandlers.set(handlerName, []);
        }
        scopedCustomHandlers!.get(handlerName)!.push([q, handler]);
    }

    static on(emc: EMC, type: string, id: string, handler: EventListenerOrFn, options?: OnOptions){
        const eventTypeHandlers = idHandlers.get(emc)!;
        if(!eventTypeHandlers.has(id)){
            eventTypeHandlers.set(id, new Map());
        }
        const tbd = eventTypeHandlers.get(id)!;
        tbd.set(type, handler);
    }

}