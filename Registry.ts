import {EMC, EventListenerOrFn, OnOptions} from './ts-refs/trans-render/be/types';
import {registeredHandlers} from './be-hive.js';
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

}