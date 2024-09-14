import { registeredHandlers, scopedHandlers } from './be-hive.js';
export class Registry {
    static register(emc, handlerName, handler) {
        const cluster = registeredHandlers.get(emc);
        const customHandlers = cluster.get(emc.handlerKey);
        if (customHandlers.has(handlerName)) {
            console.warn(`Overriding ${handlerName}`);
        }
        customHandlers.set(handlerName, handler);
    }
    static within(emc, q, handlerName, handler) {
        const scopedCluster = scopedHandlers.get(emc);
        const scopedCustomHandlers = scopedCluster.get(emc.handlerKey);
        if (!scopedCustomHandlers.has(handlerName)) {
            scopedCustomHandlers.set(handlerName, []);
        }
        scopedCustomHandlers.get(handlerName).push([q, handler]);
    }
}
