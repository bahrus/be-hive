import {EMC, EventListenerOrFn} from './ts-refs/trans-render/be/types';
import {registeredHandlers} from './be-hive.js';

export class Registry{
    static register(emc: EMC, handlerName: string, handler: EventListener | ((e: Event) => void)){
        const cluster = registeredHandlers.get(emc)!;
        const customHandlers = cluster.get(emc.handlerKey!)!;
        if(customHandlers.has(handlerName)){
            console.warn(`Overriding ${handlerName}`);
        }
        customHandlers.set(handlerName, handler);
    }


}