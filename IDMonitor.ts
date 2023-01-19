import {BeHive} from './be-hive.js';
import { IHasID } from './types.js';
export class IDMonitor{
    #mut: MutationObserver;
    constructor(public instance: BeHive){
        const config: MutationObserverInit = { childList: true};
        instance.querySelectorAll('*').forEach(element => {
            const {id} = element;
            if(id){
                instance.define({element, meta: {}}, false);
            }
        })
        this.#mut = new MutationObserver((mutationList: MutationRecord[]) => {
            for(const mutation of mutationList){
                const {addedNodes} = mutation;
                if(addedNodes !== undefined){
                    for(const addedNode of addedNodes){
                        const element = addedNode as any as IHasID;
                        const {id} = element
                        if(id){
                            instance.define({element, meta: {}}, false);
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