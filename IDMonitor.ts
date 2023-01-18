import {BeHive} from './be-hive.js';
import { IHasID } from './types.js';
export class IDMonitor{
    #mut: MutationObserver;
    constructor(public instance: BeHive){
        const config: MutationObserverInit = { childList: true};
        instance.querySelectorAll('*').forEach(item => {
            const {id} = item;
            if(id){
                instance.define(item, false);
            }
        })
        this.#mut = new MutationObserver((mutationList: MutationRecord[]) => {
            for(const mutation of mutationList){
                const {addedNodes} = mutation;
                if(addedNodes !== undefined){
                    for(const addedNode of addedNodes){
                        const {id} = addedNode as any as IHasID;
                        if(id){
                            instance.define(addedNode as any as IHasID, false);
                        }
                    }
                }
            }
        });
        this.#mut.observe(instance, config);
    }
    dispose(){
        this.#mut.disconnect();
    }
}