import {BeHiveProps, BeHiveActions, BehaviorKeys, IHasID, IDisposable} from './types';
import {BeEnhanced} from 'be-enhanced/beEnhanced.js';
import 'be-enhanced/beEnhanced.js';
export class BeHive extends HTMLElement{

    constructor(){
        super();
        this.registeredBehaviors = {};

    }
    async connectedCallback(){
        this.hidden = true;
        const overridesAttr = this.getAttribute('overrides');
        if(overridesAttr !== null){
            this.overrides = JSON.parse(overridesAttr);
        }else{
            this.overrides = {};
        }
        this.#getInheritedBehaviors();
        this.#addMutationObserver();
    }

    disconnectedCallback(){
        if(this.#mutationObserver !== undefined){
            this.#mutationObserver.disconnect();
        }
    }


    #getInheritedBehaviors(){
        const rn = this.getRootNode();
        const host = (<any>rn).host;
        if(!host) return;
        const parentShadowRealm = host.getRootNode();
        const parentBeHiveInstance = parentShadowRealm.querySelector('be-hive') as BeHiveProps & Element;
        if(parentBeHiveInstance !== null){
            const {registeredBehaviors} = parentBeHiveInstance;
            for(const key in registeredBehaviors){
                this.register(registeredBehaviors[key]);
            }

            parentBeHiveInstance.addEventListener('latest-behavior-changed', (e: Event) => {
                this.register((<any>e).detail.value);
            });

            
        }
    }

    #mutationObserver: MutationObserver | undefined;

    
    #addMutationObserver(){
        const rn = this.getRootNode() as DocumentFragment;
        const config = { attributes: true, childList: true, subtree: true } as MutationObserverInit;
        const callback = (mutationList: MutationRecord[], observer: MutationObserver) => {

            for (const mutation of mutationList) {
                if (mutation.type === "childList") {
                    for(const node of mutation.addedNodes){
                        if(node instanceof Element && node.hasAttribute('data--ignore')) {
                            //console.log('ignore');
                            continue;
                        }
                        this.#inspectNewNode(node);
                    }
                    for(const node of mutation.removedNodes){
                        const beEnhanced = (<any>node).beEnhanced;
                        if(beEnhanced === undefined) continue;
                        for(const key in beEnhanced){
                            const enhancement = beEnhanced[key];
                            const detach = enhancement['detach'];
                            if(typeof(detach) === 'function'){
                                const boundDetach = detach.bind(enhancement);
                                boundDetach(node);
                            }
                        }
                    }
                } else if (mutation.type === "attributes") {
                    const {target} = mutation;
                    if(target instanceof Element && target.hasAttribute('data--ignore')){
                        //console.log('ignore');
                        continue;
                    } 
                    this.#inspectNewNode(target);
                }
            }
        };
        
        // Create an observer instance linked to the callback function
        const observer = new MutationObserver(callback);
        observer.observe(rn, config);
        this.#mutationObserver = observer;
    }

    #inspectNewNode(node: Node){
        if(!(node instanceof Element)) return;
        const {beEnhanced} : {beEnhanced: BeEnhanced} = (<any>node);
        const {registeredBehaviors} = this;
        for(const key in registeredBehaviors){
            const registeredBehavior = registeredBehaviors[key];
            const {upgrade} = registeredBehavior;
            if(!node.matches(upgrade)) continue;
            const namespacedName = beEnhanced.getFQName(key);
            if(namespacedName === undefined) continue;
            beEnhanced.whenAttached(key);
            //beEnhanced.attachAttr(namespacedName, key);
        }
        for(const child of node.children){
            this.#inspectNewNode(child);
        }
    }


    #scanForSingleRegisteredBehavior(localName: string, behaviorKeys: BehaviorKeys){
        const {ifWantsToBe, upgrade, aspects} = behaviorKeys;
        const allAspects = aspects !== undefined ? ['', ...aspects.map(x => '-' + x)] : [''];
        for(const aspect of allAspects){
            const match = localName + aspect;
            const attr = `${upgrade}[${match}],${upgrade}[enh-by-${match}],${upgrade}[data-enh-by-${match}]`;
            const rn = this.getRootNode() as DocumentFragment;
            rn.querySelectorAll(attr).forEach(el => {
                const {beEnhanced} : {beEnhanced: BeEnhanced} = (<any>el);
                const namespacedName = beEnhanced.getFQName(localName);
                if(namespacedName === undefined) return;
                //console.log({namespacedName});
                beEnhanced.whenAttached(namespacedName);
            });
        }

    }

    async beatify(content: DocumentFragment | Element){
        const {beatify} = await import('./beatify.js');
        return await beatify(content, this);
    }

    register(parentInstance: BehaviorKeys){
        const parentInstanceLocalName =  parentInstance.localName;
        if(this.querySelector(parentInstanceLocalName) !== null) return;
        const override =  this.overrides[parentInstanceLocalName];
        let newInstanceTagName = parentInstanceLocalName;
        let newIfWantsToBe = parentInstance.ifWantsToBe;
        let newDisabled = parentInstance.disabled;
        
        if(override !== undefined){
            const {ifWantsToBe, block, unblock} = override;
            if(block) {
                newDisabled = true;
            } else if(unblock){
                newDisabled = false;
            }

            if(ifWantsToBe){
                newIfWantsToBe = ifWantsToBe;
                newInstanceTagName = 'be-' + ifWantsToBe;
            }
        }
        const beSevered = this.hasAttribute('be-severed');
        if(beSevered) newDisabled = true;
        const newBehaviorEl = document.createElement('template');
        Object.assign(newBehaviorEl.dataset, {
            localName: parentInstanceLocalName,
            ifWantsToBe: newIfWantsToBe,
            upgrade: parentInstance.upgrade,
        });
        //parentInstanceLocalName
        // newBehaviorEl.setAttribute('if-wants-to-be', newIfWantsToBe);
        // newBehaviorEl.setAttribute('upgrade', parentInstance.upgrade);
        if(newDisabled) newBehaviorEl.setAttribute('disabled', '');
        this.appendChild(newBehaviorEl);
        const newRegisteredBehavior: BehaviorKeys = {
            ...parentInstance,
            ifWantsToBe: newIfWantsToBe,
            disabled: newDisabled,
        };
            
        this.registeredBehaviors[parentInstanceLocalName] = newRegisteredBehavior;
        this.#scanForSingleRegisteredBehavior(parentInstanceLocalName, newRegisteredBehavior);
        //console.log({newRegisteredBehavior});
        this.dispatchEvent(new CustomEvent('latest-behavior-changed', {
            detail:{
                value: newRegisteredBehavior,
            }
        }));
        //this.latestBehaviors = [...this.latestBehaviors, newRegisteredBehavior];
        //this.#doSweepingScan();
        return newBehaviorEl;
    }


}

if(!customElements.get('be-hive')){
    customElements.define('be-hive', BeHive);
}

export interface BeHive extends BeHiveProps{}