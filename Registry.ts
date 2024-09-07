import {EMC, EventListenerOrFn} from './ts-refs/trans-render/be/types';
import {registeredHandlers} from './be-hive.js';

export class Registry{
    //This one has global reach
    static register(emc: EMC, handlerName: string, handler: EventListener | ((e: Event) => void)){
        const handlers = registeredHandlers.get(emc)!;
        if(handlers.has(handlerName)){
            console.warn(`Overriding ${handlerName}`);
        }
        handlers.set(handlerName, handler);
    }


}