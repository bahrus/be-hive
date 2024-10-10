import {EMC, EventListenerOrFn, OnOptions} from './ts-refs/trans-render/be/types';
import {registeredHandlers, scopedHandlers, E2D2I2T2L} from './be-hive.js';
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

    static on(emc: EMC, type: string, id: string, listener: EventListenerOrFn, options?: OnOptions){
        const D2I2T2L = E2D2I2T2L.get(emc)!;
        if(!D2I2T2L.has(id)){
            D2I2T2L.set(id, new Map());
        }
        const I2T2L = D2I2T2L.get(id)!;
        I2T2L.set(type, {
            listener,
            options
        });
    }

}